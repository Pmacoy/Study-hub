import type { Scenario } from '../../types/scenario';

export const networkingDnsScenario: Scenario = {
  id: 'networking-dns-private-resolver',
  domain: 'networking',
  format: 'guided',
  title: 'DNS interno resolve, DNS externo não',
  hook: 'Depois de uma janela de manutenção nocturna, os pods conseguem resolver `warehouse-db.acme.internal` mas não `api.stripe.com`. Ninguém consegue fazer deploy porque o `docker pull` falha. Que raio aconteceu?',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['networking', 'dns', 'resolvers', 'private-dns'],

  contextArtifacts: [
    {
      id: 'context-dns',
      label: 'Setup de DNS',
      language: 'text',
      content: `Cluster:                aks-prod
CoreDNS:                deployment/coredns em kube-system
DNS server upstream:    10.82.0.10 (Azure DNS Private Resolver)
Private zones:          acme.internal → forwarder para on-prem
Manutenção de ontem:    Update de CoreDNS de 1.10 → 1.11 e alteração no ConfigMap`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'test-dns',
      label: 'Test de DNS de dentro de um pod',
      language: 'bash',
      content: `$ kubectl exec -it debug-pod -- nslookup warehouse-db.acme.internal
Server:    10.96.0.10
Address:   10.96.0.10#53

Non-authoritative answer:
Name:      warehouse-db.acme.internal
Address:   10.90.5.20                     ✓ RESOLVE

$ kubectl exec -it debug-pod -- nslookup api.stripe.com
Server:    10.96.0.10
Address:   10.96.0.10#53

;; connection timed out; no servers could be reached   ✗ FALHA`,
    },
    {
      id: 'coredns-config',
      label: 'kubectl get configmap coredns -n kube-system -o yaml',
      language: 'yaml',
      content: `apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom
data:
  Corefile: |
    .:53 {
        errors
        health
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 10.82.0.10          # ← ontem: era "forward . /etc/resolv.conf"
        cache 30
        loop
        reload
        loadbalance
    }
    acme.internal:53 {
        forward . 10.82.0.10
        cache 30
    }`,
    },
    {
      id: 'private-resolver',
      label: 'Azure DNS Private Resolver — Ruleset',
      language: 'text',
      content: `Resolver: dns-priv-resolver-hub
Ruleset:  ruleset-corporate

Forwarding Rules:
  acme.internal   →  10.100.0.53 (on-prem DNS)  ✓
  # ...
  # NENHUMA regra genérica para o resto (.)

Behaviour:  Só resolve domínios listados nas rules.
            Domínios não configurados → SERVFAIL / timeout.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Primeiro teste rápido: consegues distinguir entre falha de DNS interno vs externo. O que fazes?',
      revealArtifacts: [],
      options: [
        {
          id: 'a',
          label: 'nslookup a um domínio interno E a um externo do mesmo pod',
          correct: true,
          feedback: 'Boa — isola imediatamente se é problema de resolução para tudo ou só para uma zona específica.',
          revealArtifacts: ['test-dns'],
        },
        {
          id: 'b',
          label: 'Reiniciar todos os pods do CoreDNS',
          correct: false,
          feedback: 'Antes de saber o que está mal, não. Perdes evidência.',
        },
        {
          id: 'c',
          label: 'ping 8.8.8.8 para ver se há internet',
          correct: false,
          feedback: 'Consegues chegar a 8.8.8.8 sem DNS. Precisas de perceber o resolver, não a conectividade IP.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'Interno OK, externo timeout. Sabendo que houve mudança no CoreDNS ontem, o que verificas?',
      options: [
        {
          id: 'a',
          label: 'kubectl get configmap coredns -n kube-system -o yaml',
          correct: true,
          feedback: 'Sim. A mudança de configuração é o suspeito nº1. Ver o Corefile actual mostra-nos como está a rotear queries.',
          revealArtifacts: ['coredns-config'],
        },
        {
          id: 'b',
          label: 'kubectl logs coredns e procurar erros',
          correct: false,
          feedback: 'Útil mais tarde, mas a config diz-te o comportamento esperado. Logs sem contexto de config são só ruído.',
        },
        {
          id: 'c',
          label: 'Rollback imediato do update do CoreDNS 1.10',
          correct: false,
          feedback: 'Reverter sem entender é sortudo, não engenharia. E se a mudança que quebrou foi noutro sítio, perdes tempo.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'O Corefile mostra `forward . 10.82.0.10` — antes era `forward . /etc/resolv.conf`. O que mudou?',
      options: [
        {
          id: 'a',
          label: 'Antes, o CoreDNS usava o resolver do node (que provavelmente tinha 8.8.8.8 upstream). Agora força TUDO pelo Azure Private Resolver.',
          correct: true,
          feedback: 'Correcto. Isto é o gatilho. Tens de olhar para o que o Private Resolver faz com queries que ele NÃO conhece.',
          revealArtifacts: ['private-resolver'],
        },
        {
          id: 'b',
          label: 'O endereço 10.82.0.10 está errado — devia ser 10.96.0.10',
          correct: false,
          feedback: '10.96.0.10 é o service IP do CoreDNS (kube-dns). O 10.82.0.10 é o upstream — é onde o CoreDNS envia queries que não sabe resolver.',
        },
        {
          id: 'c',
          label: 'A directiva `forward .` só suporta um servidor. É preciso listar múltiplos.',
          correct: false,
          feedback: 'Não. `forward .` aceita múltiplos IPs, mas ter um só está bem. O problema é para onde vai, não quantos.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt: 'O Private Resolver só tem regra para `acme.internal`. Domínios fora dessa lista dão SERVFAIL. Qual é a correcção mais robusta?',
      options: [
        {
          id: 'a',
          label: 'Adicionar uma rule "." (fallback) no Private Resolver a apontar para 8.8.8.8 ou 168.63.129.16',
          correct: true,
          feedback: 'Correcto. O Private Resolver precisa de saber o que fazer para queries genéricas. Rule "." + Azure default DNS 168.63.129.16 resolve isto arquitecturalmente.',
        },
        {
          id: 'b',
          label: 'Voltar `forward . /etc/resolv.conf` no Corefile',
          correct: false,
          feedback: 'Trabalha, mas volta ao mundo em que cada node decide o seu upstream — inconsistente entre AZs, e queries a domínios internos podem vazar para a internet.',
        },
        {
          id: 'c',
          label: 'Adicionar hardcoded o `api.stripe.com` no Corefile como hosts entry',
          correct: false,
          feedback: 'Não escala. Vais adicionar todos os domínios externos que a app usa? Amanhã é `github.com`, depois `hub.docker.com`...',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'Aplicaste a rule "." no Private Resolver. Tudo volta a resolver. Prevenção mais importante?',
      options: [
        {
          id: 'a',
          label: 'Teste synthetic: pod que faz nslookup a um domínio interno E externo cada 60s e exporta métrica',
          correct: true,
          feedback: 'Esta detectaria a falha na primeira sessão de manutenção, antes dos pipelines falharem.',
        },
        {
          id: 'b',
          label: 'Bloquear todas as mudanças no CoreDNS ConfigMap com OPA/Gatekeeper',
          correct: false,
          feedback: 'Muito restritivo. A mudança em si era razoável — o que falta é validação pós-mudança. Bloquear engenheiros de config é o outro extremo.',
        },
        {
          id: 'c',
          label: 'Rollback automático se o pod-restart-rate do namespace kube-system subir',
          correct: false,
          feedback: 'CoreDNS não crashou — respondeu SERVFAIL. Não vais detectar isto por métricas de restart.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'A mudança no Corefile trocou `forward . /etc/resolv.conf` (que herdava do node) por `forward . 10.82.0.10` (Azure DNS Private Resolver explícito). O Private Resolver só tinha regras para zonas privadas corporate (acme.internal) — para tudo o resto devolvia SERVFAIL. Domínios externos como `api.stripe.com` deixaram de resolver.',
    fix: 'Adicionar uma forwarding rule "." (catch-all) no Ruleset do Private Resolver a apontar para o Azure default DNS (168.63.129.16). Propagação de rule em ~1 minuto. DNS externo volta.',
    preventions: [
      'Synthetic test: DaemonSet com Alpine + script que faz nslookup a 3 domínios (interno, externo, docker registry) cada 60s → métrica',
      'Runbook de mudanças CoreDNS: "após aplicar, exec num pod e testa 3 tipos de resolução"',
      'Documentar no Backstage a arquitectura de DNS híbrido — quem lê fica a saber os limites do Private Resolver',
      'Terraform: quando defines o Ruleset, exige explicitamente a rule "." como default (via policy)',
      'Considerar deixar a resolução externa fora do Private Resolver e usar Azure Firewall com DNS proxy para casos híbridos complexos',
    ],
  },
};
