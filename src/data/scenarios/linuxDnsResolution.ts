import type { Scenario } from '../../types/scenario';

export const linuxDnsResolutionScenario: Scenario = {
  id: 'linux-dns-resolution',
  domain: 'networking',
  format: 'guided',
  title: 'DNS não resolve — serviços externos falham',
  hook: 'O servidor de API não consegue contactar o serviço de terceiros. curl retorna "Could not resolve host". O DNS interno funciona mas o externo falha.',
  difficulty: 'mid',
  timeEstimateMin: 8,
  tags: ['linux', 'dns', 'networking', 'troubleshooting'],

  contextArtifacts: [
    {
      id: 'context-server',
      label: 'Contexto do servidor',
      language: 'text',
      content: `Servidor:   api-gw-prod-02 (Ubuntu 22.04)
IP:         10.0.2.15/24
Gateway:    10.0.2.1
DNS interno (corp.example.local):   10.0.1.53
DNS externo (provider):             8.8.8.8
Última mudança: ontem — actualização de segurança do iptables
Serviço afectado: api-gw (Node.js, porta 3000)
Sintoma: requests a https://api.thirdparty.com falham com "Could not resolve host"`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'dig-external',
      label: '$ dig api.thirdparty.com @8.8.8.8',
      language: 'bash',
      content: `; <<>> DiG 9.18.12-1ubuntu1.1-Ubuntu <<>> api.thirdparty.com @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54321
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;api.thirdparty.com.            IN      A

;; ANSWER SECTION:
api.thirdparty.com.     300     IN      A       52.14.200.88

;; Query time: 38 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Mon Sep 01 10:15:42 UTC 2026
;; MSG SIZE  rcvd: 57`,
    },
    {
      id: 'dig-default',
      label: '$ dig api.thirdparty.com',
      language: 'bash',
      content: `; <<>> DiG 9.18.12-1ubuntu1.1-Ubuntu <<>> api.thirdparty.com
;; global options: +cmd
;; connection timed out; no servers could be reached`,
    },
    {
      id: 'resolv-conf',
      label: '$ cat /etc/resolv.conf',
      language: 'text',
      content: `# DNS resolv.conf — managed by systemd-resolved
nameserver 127.0.0.53
options edns0 trust-ad
search corp.example.local`,
    },
    {
      id: 'resolvectl-status',
      label: '$ resolvectl status',
      language: 'bash',
      content: `System Resolved Status/Configuration:
        DNSSEC allow: no
        DNSSEC LLMNR support: no
        LLMNR local multicast: yes
        LLMNR local resolve: yes

Current DNS Server: 10.0.1.53
       DNS Servers: 10.0.1.53
        DNS Domain: corp.example.local
         DNSSEC NTA: 10.in-addr.arpa.

Link 200 (eth0):
    Current Scopes: DNS
 DefaultRoute setting: yes
        LLMNR setting: yes
LLMNR support: yes
DNS Servers: 10.0.1.53
     DNS Domain: corp.example.local`,
    },
    {
      id: 'iptables-rules',
      label: '$ sudo iptables -L -n -v --line-numbers',
      language: 'bash',
      content: `Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in out     source               destination
1      342  28K ACCEPT     all  --  *    *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
2       12   720 ACCEPT     tcp  --  *    *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
3        0     0 ACCEPT     tcp  --  *    *       0.0.0.0/0            0.0.0.0/0            tcp dpt:3000
4        0     0 ACCEPT     udp  --  *    *       0.0.0.0/0            127.0.0.53           udp dpt:53
5        0     0 DROP       udp  --  *    *       0.0.0.0/0            8.8.8.8              udp dpt:53
6        0     0 DROP       tcp  --  *    *       0.0.0.0/0            8.8.8.8              tcp dpt:53

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in out     source               destination

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in out     source               destination
1     1205  180K ACCEPT     all  --  *    *       0.0.0.0/0            0.0.0.0/0
2        0     0 DROP       udp  --  *    *       0.0.0.0/0            8.8.8.8              udp dpt:53
3        0     0 DROP       tcp  --  *    *       0.0.0.0/0            8.8.8.8              tcp dpt:53`,
    },
    {
      id: 'dig-internal',
      label: '$ dig @10.0.1.53 db.internal.corp.example.local',
      language: 'bash',
      content: `; <<>> DiG 9.18.12-1ubuntu1.1-Ubuntu <<>> @10.0.1.53 db.internal.corp.example.local
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; QUESTION SECTION:
;db.internal.corp.example.local. IN A
;; ANSWER SECTION:
db.internal.corp.example.local. 3600 IN A 10.0.1.100
;; Query time: 1 msec
;; SERVER: 10.0.1.53#53(10.0.1.53)
;; WHEN: Mon Sep 01 10:18:05 UTC 2026
;; MSG SIZE  rcvd: 92`,
    },
    {
      id: 'curl-debug',
      label: '$ curl -v https://api.thirdparty.com/health',
      language: 'bash',
      content: `*   Trying 52.14.200.88:443...
* connect to 52.14.200.88 port 443 failed: Connection timed out
* Failed to connect to api.thirdparty.com port 443: Connection timed out
* Closing connection 0
curl: (7) Failed to connect to api.thirdparty.com port 443: Connection timed out

$ dig api.thirdparty.com @10.0.1.53
;; connection timed out; no servers could be reached`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'O servidor não consegue resolver nomes externos. Qual é o primeiro comando para diagnosticar?',
      options: [
        {
          id: 'a',
          label: 'dig <dominio> para ver se a resolução funciona com o servidor padrão',
          correct: true,
          feedback: 'Correto. O dig com o servidor por omissão (/etc/resolv.conf) mostra se a resolução falha. Depois podemos comparar com dig contra um servidor específico.',
          revealArtifacts: ['dig-default', 'dig-external'],
        },
        {
          id: 'b',
          label: 'restartar o serviço systemd-resolved',
          correct: false,
          feedback: 'Restart pode ajudar se houver cache corrompido, mas não diagnostica a causa raiz. Primeiro coletamos informações.',
        },
        {
          id: 'c',
          label: 'verificar se o serviço da API está a correr',
          correct: false,
          feedback: 'O serviço da API está a correr — o problema é a resolução de nomes, não o processamento das requests.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'dig contra 8.8.8.8 funciona (resposta em 38ms) mas dig sem especificar servidor não responde. O resolv.conf aponta para 127.0.0.53 (systemd-resolved). O que está a acontecer?',
      options: [
        {
          id: 'a',
          label: 'O systemd-resolved está configurado para usar apenas o DNS interno (10.0.1.53) e esse servidor não consegue resolver domínios externos',
          correct: true,
          feedback: 'Exato. O resolvectl status mostra que o DNS Server é 10.0.1.53. O dig @10.0.1.53 também falha para domínios externos — o DNS interno não faz forward para resolvers externos.',
          revealArtifacts: ['resolvectl-status', 'dig-internal'],
        },
        {
          id: 'b',
          label: 'O resolv.conf está errado e precisa de ter 8.8.8.8',
          correct: false,
          feedback: 'O resolv.conf aponta para 127.0.0.53 que é o stub do systemd-resolved — isso é o padrão em Ubuntu 22.04. O problema está na configuração upstream do resolved, não no resolv.conf em si.',
        },
        {
          id: 'c',
          label: 'O iptables está a bloquear as respostas DNS de volta para o localhost',
          correct: false,
          feedback: 'O iptables INPUT permiteRELATED,ESTABLISHED e a regra 4 permite udp para 127.0.0.53:53. O problema não está no INPUT chain para o resolver local.',
        },
      ],
      teachingNote: 'Em Ubuntu 22.04+, o resolv.conf aponta para 127.0.0.53 (stub resolver do systemd-resolved). O resolved faz forwarding para os upstreams configurados. Se o upstream não tiver acesso a DNS externo, nada resolve.',
    },
    {
      id: 'step-3',
      prompt: 'Vemos no resolvectl que o DNS Server é 10.0.1.53 com DefaultRoute=yes. O que é que isto significa e porquê que falha?',
      options: [
        {
          id: 'a',
          label: 'O resolved está a usar 10.0.1.53 como único upstream, mas o DNS interno não está configurado para fazer forward de zonas externas',
          correct: true,
          feedback: 'Correto. O DNS interno (10.0.1.53) serve apenas a zona corp.example.local. Quando recebe queries para domínios externos, não tem forwarders configurados e não consegue resolver.',
          revealArtifacts: ['resolv-conf'],
        },
        {
          id: 'b',
          label: 'O DefaultRoute=yes está a causar conflito com o DNS interno',
          correct: false,
          feedback: 'DefaultRoute=yes significa que o resolved usa este DNS para todas as zonas. Isso é desejável — o problema é que o upstream (10.0.1.53) não consegue resolver zonas externas.',
        },
        {
          id: 'c',
          label: 'O trust-ad e edns0 no resolv.conf estão a causar problemas de compatibilidade',
          correct: false,
          feedback: 'edns0 e trust-ad são configurações padrão e correctas. O problema é a ausência de upstream DNS capaz de resolver zonas externas.',
        },
      ],
    },
    {
      id: 'step-4',
      prompt: 'Olhando para as regras do iptables, vês regras 5, 6 no INPUT e regras 2, 3 no OUTPUT que fazem DROP em 8.8.8.8:53. O que é isto?',
      options: [
        {
          id: 'a',
          label: 'Alguém adicionou regras que bloqueiam tráfego DNS para o 8.8.8.8 — isso explicaria porque o dig directo funciona (pode ser via uma rota diferente) mas o resolved não',
          correct: true,
          feedback: 'Esta é uma pista importante. As regras DROP em 8.8.8.8:53 no iptables bloqueiam DNS UDP e TCP para o Google DNS. Mas o dig @8.8.8.8 funcionou — o que sugere que o dig pode estar a usar uma via diferente (talvez via IPv6 ou uma regra ACCEPT precedente). O mais provável é que o problema principal continue a ser o upstream do resolved, mas estas regras também precisam de ser corrigidas.',
          revealArtifacts: ['iptables-rules'],
        },
        {
          id: 'b',
          label: 'As regras estão correctas e protegem o servidor',
          correct: false,
          feedback: 'Regras que bloqueiam DNS para 8.8.8.8 são problemáticas num servidor de API que precisa de resolver domínios externos. Esta política de segurança excessiva quebra funcionalidade.',
        },
        {
          id: 'c',
          label: 'O iptables não está relacionado com o problema porque as regras estão no INPUT mas a resolução DNS vai pelo OUTPUT',
          correct: false,
          feedback: 'O iptables processa tanto INPUT como OUTPUT. As regras 2 e 3 no OUTPUT chain também bloqueiam DNS para 8.8.8.8, impedindo o servidor de enviar queries para lá.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'Tens duas causas identificadas: (1) o systemd-resolved usa apenas o DNS interno que não faz forward externo, e (2) regras iptables bloqueiam 8.8.8.8:53. Qual é o plano de correção correcto?',
      options: [
        {
          id: 'a',
          label: 'Configurar forwarders no systemd-resolved (8.8.8.8 e/ou 1.1.1.1) E remover as regras DROP do iptables para 8.8.8.8:53',
          correct: true,
          feedback: 'Correto. As duas correções são necessárias: o resolved precisa de upstreams capazes de resolver externas, e as regras iptables estão a bloquear o acesso ao Google DNS. Resolver apenas um dos problemas não basta.',
          revealArtifacts: ['curl-debug'],
        },
        {
          id: 'b',
          label: 'Apenas remover as regras iptables — o DNS interno vai começar a funcionar',
          correct: false,
          feedback: 'Remover as regras iptables ajuda, mas o DNS interno (10.0.1.53) não está configurado para forward de zonas externas. Mesmo com o iptables limpo, o resolved ainda aponta para um servidor que não resolve externos.',
        },
        {
          id: 'c',
          label: 'Apenas adicionar 8.8.8.8 ao systemd-resolved — o iptables não é problema',
          correct: false,
          feedback: 'Adicionar o forwarder ao resolved é necessário, mas as regras DROP no iptables (especialmente no OUTPUT chain) continuariam a bloquear o tráfego DNS de saída para 8.8.8.8.',
        },
      ],
      teachingNote: 'Troubleshooting de rede em camadas: aplica a regra "resolve uma camada de cada vez". DNS → resolv.conf → resolved config → firewall → connectivity. Cada camada pode ter múltiplas causas.',
    },
  ],

  resolution: {
    rootCause: 'Dois problemas combinados: (1) o systemd-resolved estava configurado com apenas o DNS interno (10.0.1.53) como upstream, e esse servidor não tinha forwarders configurados para zonas externas — só resolves a zona corp.example.local. (2) Regras iptables adicionadas numa actualização de segurança anterior bloqueavam explicitamente tráfego DNS UDP e TCP para 8.8.8.8 tanto no INPUT como no OUTPUT chain, impedindo qualquer workaround temporário.',
    fix: '1) Configurar DNS forwarders no systemd-resolved: editar /etc/systemd/resolved.conf com DNS=8.8.8.8 1.1.1.1 e DefaultRoute=yes, depois systemctl restart systemd-resolved. 2) Remover as regras DROP do iptables: sudo iptables -D INPUT 5; sudo iptables -D INPUT 5; sudo iptables -D OUTPUT 2; sudo iptables -D OUTPUT 2 (ou melhor, replace by uma regra ACCEPT para 127.0.0.53:53 antes do DROP). Salvar as regras com iptables-save.',
    preventions: [
      'Centralizar regras de firewall em Git (iptables-rules.yaml) com revisão obrigatória antes de aplicar',
      'Adicionar teste de conectividade DNS a domínios externos no pipeline de deploy do firewall',
      'Configurar o systemd-resolved com múltiplos upstreams (primário + secundário) para redundancy',
      'Monitorizar resolução DNS com um check a cada 60s (dig + timer) e alertar se falhar',
      'Documentar no runbook: como verificar camadas de DNS (resolv.conf → resolved → iptables → rede)',
    ],
  },
};
