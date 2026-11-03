import type { Scenario } from '../../types/scenario';

export const cloudHybridBgpPartitionScenario: Scenario = {
  id: 'cloud-hybrid-bgp-partition',
  domain: 'networking',
  format: 'guided',
  title: 'Falha de Roteamento BGP Híbrido entre Data Center e AWS VPC',
  hook: 'Uma falha intermitente de conectividade isolou o banco de dados on-premises da aplicação na AWS. Diagnostique o AS-PATH, rotas BGP e túnel IPsec.',
  difficulty: 'senior',
  timeEstimateMin: 15,
  tags: ['networking', 'bgp', 'vpn', 'hybrid', 'aws'],

  contextArtifacts: [
    {
      id: 'bgp-topology',
      label: 'Topologia BGP Híbrida',
      language: 'text',
      content: `On-Premises Edge Router: ASN 65001 (192.168.100.1)
AWS Transit Gateway / VPN: ASN 16509 (10.0.0.0/16)
Protocolo: BGP over IPsec IKEv2`,
    }
  ],

  progressiveArtifacts: [],

  steps: [
    {
      id: 'step-1',
      prompt: 'Passo 1: Qual comando deve executar no router de borda para inspecionar os vizinhos BGP e o estado da sessão?',
      options: [
        { id: 'a', label: 'show ip bgp summary', correct: true, feedback: 'Correto! `show ip bgp summary` mostra o estado dos peers BGP.' },
        { id: 'b', label: 'ping 8.8.8.8', correct: false, feedback: 'Incorreto. Ping testa conectividade IP genérica.' },
        { id: 'c', label: 'netstat -an', correct: false, feedback: 'Incorreto. Netstat lista sockets locais.' },
      ]
    },
    {
      id: 'step-2',
      prompt: 'Passo 2: O vizinho BGP está em estado "Active". Qual a causa mais provável para não estabelecer o Established?',
      options: [
        { id: 'a', label: 'Porta TCP 179 bloqueada por ACL ou divergência no BGP ASN', correct: true, feedback: 'Perfeito! BGP usa TCP porta 179.' },
        { id: 'b', label: 'Falta de espaço em disco no router', correct: false, feedback: 'Incorreto. Routers gerem control plane em memória.' },
        { id: 'c', label: 'Versão do Python desatualizada', correct: false, feedback: 'Incorreto. Irrelevante.' },
      ]
    },
    {
      id: 'step-3',
      prompt: 'Passo 3: Após corrigir a ACL, como valida se a rota /24 do on-prem foi aprendida pela AWS VPC?',
      options: [
        { id: 'a', label: 'Consultar a tabela de rotas da VPC e o comando `show ip bgp` no router', correct: true, feedback: 'Correto! Validar a propagação garante convergência.' },
        { id: 'b', label: 'Reiniciar todas as instâncias EC2', correct: false, feedback: 'Incorreto. Reiniciar instâncias não resolve roteamento.' },
        { id: 'c', label: 'Alterar a senha do root no Linux', correct: false, feedback: 'Incorreto. Irrelevante.' },
      ]
    }
  ],

  resolution: {
    rootCause: 'Bloqueio na porta TCP 179 no firewall intermediário após alteração de política de segurança, derrubando a sessão BGP entre o Data Center e a AWS.',
    fix: 'Liberação da porta TCP 179 para BGP peer, revisão do ASN configurado e verificação da estabilidade do túnel IPsec de backup.',
    preventions: [
      'Implementar monitoramento automatizado de largura de banda e estado de peers BGP com alertas no CloudWatch/Prometheus.'
    ]
  }
};
