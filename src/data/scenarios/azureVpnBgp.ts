import type { Scenario } from '../../types/scenario';

export const azureVpnBgpScenario: Scenario = {
  id: 'azure-vpn-bgp-routes',
  domain: 'azure',
  format: 'guided',
  title: 'VPN Gateway aparenta OK mas Databricks não fala com a base de dados',
  hook: 'Um cluster Databricks foi migrado para uma VNet Spoke em Azure com Private Link para uma base de dados em AWS via VPN. O VPN Gateway diz "Connected" mas os notebooks estão a dar timeout ao conectar a `warehouse-db.acme.internal`. O CIO pergunta quando arranca a demo dos dashboards. É agora.',
  difficulty: 'senior',
  timeEstimateMin: 10,
  tags: ['azure', 'networking', 'vpn', 'bgp', 'hybrid'],

  contextArtifacts: [
    {
      id: 'context-topology',
      label: 'Topologia da rede',
      language: 'text',
      content: `Hub VNet:     10.82.0.0/24 (vnet-hub-dev)
Spoke VNet:   10.82.30.0/24 (vnet-dbx-pl-dev)
Peering:      hub-to-spoke ✓ | spoke-to-hub ✓

VPN Gateway:  vpn-gw-hub-dev (Standard SKU, BGP enabled, ASN 65515)
AWS Peer:     Customer Gateway ASN 65000
Túnel:        oracle-prod-tunnel

Oracle target: warehouse-db.acme.internal → resolve para 10.90.5.20
Databricks target: workspace com Private Link (NCC)`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'vpn-status',
      label: 'Portal · VPN Gateway → Connections',
      language: 'text',
      content: `Connection: oracle-prod-tunnel
Status:     Connected ✓
Data in:    12 GB
Data out:   890 MB
Ingress packets dropped: 0
Egress packets dropped: 47,203 (!!)

Last connected: 2 hours ago
Shared key: ****
BGP: Enabled`,
    },
    {
      id: 'bgp-peer-status',
      label: 'az network vnet-gateway list-bgp-peer-status',
      language: 'bash',
      content: `[
  {
    "asn": 65000,
    "connectedDuration": "02:07:41",
    "localAddress": "10.82.0.254",
    "messagesReceived": 1247,
    "messagesSent": 4210,
    "neighbor": "169.254.21.2",
    "routesReceived": 0,          ← Zero rotas recebidas!
    "state": "Connected"
  }
]`,
    },
    {
      id: 'effective-routes',
      label: 'az network nic show-effective-route-table (do node Databricks)',
      language: 'bash',
      content: `Source                  State    AddressPrefixes    NextHopType
──────────────────────  ─────────  ─────────────────  ──────────────────
Default                 Active   10.82.0.0/24       VNetPeering
Default                 Active   10.82.30.0/24      VnetLocal
Default                 Active   0.0.0.0/0          Internet
User                    Active   10.90.0.0/16       VirtualNetworkGateway  ← existe!
Default                 Active   10.0.0.0/8         None

# 10.90.5.20 (Oracle) → matches 10.90.0.0/16 → hop: VirtualNetworkGateway ✓`,
    },
    {
      id: 'aws-side-routes',
      label: 'Ticket da equipa AWS (screenshot Route Table)',
      language: 'text',
      content: `Route Table: rt-oracle-prod-vpc
Destination        Target                    Propagated
10.90.0.0/16       local                     No
10.82.30.0/24      ???                       ???   ← NÃO EXISTE
0.0.0.0/0          igw-abc123                No

Nota da equipa AWS: "O nosso lado da VPN só está a propagar rotas para
o VPC Oracle. Não vejo nenhuma rota de volta para o subnet Databricks 10.82.30.0/24."`,
    },
    {
      id: 'gateway-config',
      label: 'Configuração do Local Network Gateway (Azure)',
      language: 'yaml',
      content: `# local-network-gateway-aws.yaml
name: lng-aws-oracle-prod
gatewayIpAddress: 52.14.xx.xx
addressSpace:
  addressPrefixes:
    - 10.90.0.0/16          # rede Oracle (destino)
bgpSettings:
  asn: 65000
  bgpPeeringAddress: 169.254.21.2
  peerWeight: 0
# BGP enabled, mas... e o que anunciamos?`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'VPN diz "Connected" mas há timeout. Qual é a tua primeira verificação?',
      options: [
        {
          id: 'a',
          label: 'Ver as effective routes na NIC do node Databricks',
          correct: true,
          feedback: 'Boa. "Connected" só significa que o túnel IPsec está up. Não garante rotas nem alcançabilidade fim-a-fim.',
          revealArtifacts: ['effective-routes'],
        },
        {
          id: 'b',
          label: 'Fazer telnet 10.90.5.20 1521 do Databricks',
          correct: false,
          feedback: 'Vais só confirmar o que já sabes (timeout). Precisas de entender PORQUÊ, não replicar o sintoma.',
        },
        {
          id: 'c',
          label: 'Reiniciar o VPN Gateway',
          correct: false,
          feedback: 'Cortas 20min de disponibilidade para nada. VPN diz "Connected" — o problema não está no túnel.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'A effective route table mostra 10.90.0.0/16 → VirtualNetworkGateway. Do lado Azure parece OK. O que verificas a seguir?',
      options: [
        {
          id: 'a',
          label: 'Estado do BGP peer e rotas anunciadas/recebidas',
          correct: true,
          feedback: 'Correcto. Com BGP habilitado, as rotas devem ser aprendidas dinamicamente do outro lado. Se a Azure está a mandar mas não recebe, algo está partido no BGP.',
          revealArtifacts: ['bgp-peer-status', 'vpn-status'],
        },
        {
          id: 'b',
          label: 'Verificar NSG do subnet Databricks',
          correct: false,
          feedback: 'NSG bloquearia ambos os sentidos e verias packets dropped em ingress. Aqui só há drops em egress — o problema é upstream.',
        },
        {
          id: 'c',
          label: 'Refazer o Private Endpoint',
          correct: false,
          feedback: 'PE é para serviços PaaS Azure, não afecta rotas VPN cross-cloud. Estás a olhar para o lado errado do problema.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'BGP status mostra "state: Connected" mas `routesReceived: 0`. E na VPN vês 47k egress packets dropped. Qual é a hipótese?',
      options: [
        {
          id: 'a',
          label: 'O peer AWS não está a anunciar rotas — falta configurar Route Propagation na route table AWS',
          correct: true,
          feedback: 'Exacto. BGP sessão está de pé, mas o lado AWS não está a propagar rotas para o subnet Databricks. Sem rota de volta, o tráfego chega mas as respostas nunca voltam — dropped em egress.',
          revealArtifacts: ['aws-side-routes'],
        },
        {
          id: 'b',
          label: 'O ASN local está mal configurado',
          correct: false,
          feedback: 'Se o ASN estivesse mal, o BGP não passava do estado "Idle". A sessão está "Connected" — os ASN batem certo.',
        },
        {
          id: 'c',
          label: 'A MTU do túnel é demasiado baixa',
          correct: false,
          feedback: 'MTU causa fragmentação, não drops em egress. E os drops seriam em ambos os lados, não só num.',
        },
      ],
      teachingNote: 'Regra do BGP em VPN: "Connected" ≠ "a trocar rotas". Verifica sempre routesReceived e routesAdvertised em ambos os lados.',
    },
    {
      id: 'step-4',
      prompt: 'Confirmaste com a equipa AWS. Route table deles não tem `10.82.30.0/24` propagada. Qual a acção imediata?',
      revealArtifacts: ['gateway-config'],
      options: [
        {
          id: 'a',
          label: 'Pedir à equipa AWS para activar "Route Propagation" na route table associada ao VGW',
          correct: true,
          feedback: 'Exacto. Em AWS, Route Propagation na route table + VGW é o que permite às rotas BGP aparecerem automaticamente. Sem isso, o BGP funciona mas as rotas ficam órfãs.',
        },
        {
          id: 'b',
          label: 'Adicionar rota estática 10.82.30.0/24 no Azure Local Network Gateway',
          correct: false,
          feedback: 'O LNG Azure descreve as REDES REMOTAS (AWS). Adicionar 10.82.30.0/24 lá é errado — essa é a nossa rede. E o problema está do lado AWS não anunciar de volta.',
        },
        {
          id: 'c',
          label: 'Criar peering directo entre VNets sem passar pela VPN',
          correct: false,
          feedback: 'VNet Peering é intra-Azure. Não podes fazer peering entre Azure VNet e AWS VPC.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'AWS activou Route Propagation. Rotas aparecem, conectividade restaurada. No post-mortem, qual acção de prevenção adicionas?',
      options: [
        {
          id: 'a',
          label: 'Alerta Prometheus: BGP routesReceived == 0 por mais de 5min → PagerDuty',
          correct: true,
          feedback: 'É a métrica que te teria avisado 2 horas antes do CIO. `az network vnet-gateway list-bgp-peer-status` é scrapeable via Azure Monitor.',
        },
        {
          id: 'b',
          label: 'Migrar tudo para ExpressRoute',
          correct: false,
          feedback: 'ExpressRoute custa 10x mais e não resolve o problema — se a route propagation não estiver activa, o mesmo acontece.',
        },
        {
          id: 'c',
          label: 'Substituir BGP por rotas estáticas em ambos os lados',
          correct: false,
          feedback: 'Perdes a capacidade de convergência automática em failover. Rotas estáticas são frágeis em ambientes híbridos.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'Do lado Azure, o BGP peer estava configurado correctamente e a anunciar `10.82.30.0/24` para o AWS. Mas a route table do VPC Oracle em AWS não tinha "Route Propagation" activada para o Virtual Private Gateway. Resultado: o túnel IPsec estava up, o BGP session estava up, mas as rotas aprendidas não entravam na route table AWS. Tráfego Azure → Oracle passava, mas as respostas Oracle → Azure não sabiam para onde ir.',
    fix: 'Na AWS VPC Console, editar a route table associada ao subnet Oracle e activar "Route Propagation" para o Virtual Private Gateway. Rotas aprendidas via BGP começaram a aparecer em ~30 segundos. Conectividade restaurada.',
    preventions: [
      'Alerta: `bgp_peer_routes_received == 0 for 5m` em ambos os gateways',
      'Runbook: checklist de "connectividade híbrida OK" que inclui verificação BGP em ambos os lados',
      'Terraform: adicionar `propagating_vgws` explicitamente ao `aws_route_table` para o VGW',
      'Adicionar teste synthetic: pod que faz `nc -zv warehouse-db.acme.internal 1521` cada 60s e exporta métrica',
      'Documentar a topologia BGP no service catalog (Backstage) com donos claros de ambos os lados',
    ],
  },
};
