import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // IP & Subnetting
  { category: 'IP & Subnets', front: '/24 — quantos hosts úteis?', back: '254 hosts (2^8 - 2). O -2 desconta o IP de Rede e o de Broadcast.' },
  { category: 'IP & Subnets', front: 'Endereço de Broadcast', back: 'O último IP do bloco — envia uma mensagem para todos os hosts da sub-rede em simultâneo.' },
  { category: 'IP & Subnets', front: 'Dividir uma sub-rede em 2', back: 'O CIDR aumenta +1 (ex: /24 → /25). "Rouba-se" 1 bit dos hosts, cortando a rede exactamente a meio.' },
  { category: 'IP & Subnets', front: '10.0.0.0/8', back: 'Bloco privado RFC 1918 — usado em redes enterprise grandes (~16M de IPs).' },
  { category: 'IP & Subnets', front: '192.168.0.0/16', back: 'Bloco privado RFC 1918 mais comum em redes domésticas e pequenos labs.' },

  // TCP/UDP
  { category: 'TCP/UDP', front: '3-Way Handshake', back: 'SYN → SYN-ACK → ACK. Estabelece a conexão TCP antes de qualquer dado fluir.' },
  { category: 'TCP/UDP', front: 'Porque é que DNS usa UDP?', back: 'Queries são pequenas e rápidas — não vale a pena o overhead de estabelecer conexão TCP. Zone transfers usam TCP.' },
  { category: 'TCP/UDP', front: 'Window Size (TCP)', back: 'Controlo de fluxo — diz ao remetente quanto espaço o receptor tem livre no buffer, sem "engasgar".' },
  { category: 'TCP/UDP', front: 'Porta 443', back: 'HTTPS / TLS. TLS 1.2+ é obrigatório em produção.' },
  { category: 'TCP/UDP', front: 'Porta 6443', back: 'API server do Kubernetes — deve ser restringida a IPs de gestão, nunca exposta publicamente.' },

  // Routing
  { category: 'Routing', front: 'Longest Prefix Match', back: 'Quando várias rotas correspondem a um destino, o router escolhe sempre a rota com a máscara mais específica (maior CIDR).' },
  { category: 'Routing', front: 'Métrica de rota', back: 'O "custo" — entre duas rotas para o mesmo destino com a mesma máscara, vence a de menor métrica.' },
  { category: 'Routing', front: 'Rota Default (0.0.0.0/0)', back: 'Usada quando nenhuma outra rota corresponde — normalmente aponta para a internet via gateway.' },

  // DNS & Application
  { category: 'Aplicação', front: 'Ordem de resolução DNS', back: 'Cache local → DNS Resolver (ISP) → Root Server → TLD Server (.com) → Servidor Autoritativo.' },
  { category: 'Aplicação', front: 'GET vs POST', back: 'GET é idempotente e cacheável, busca dados. POST não é idempotente, cria recursos novos.' },
  { category: 'Aplicação', front: 'HTTP 201 vs 200', back: '200 OK = sucesso genérico. 201 Created = sucesso e um novo recurso foi criado.' },
  { category: 'Aplicação', front: 'HTTP 404 vs 400', back: '400 Bad Request = erro do cliente no pedido. 404 Not Found = o recurso pedido não existe.' },

  // Security & Diagnostics
  { category: 'Segurança', front: 'Para que serve o ARP?', back: 'Resolve um IP para o endereço MAC físico correspondente, via broadcast na rede local.' },
  { category: 'Segurança', front: 'TLS Handshake — 4 passos', back: 'Client Hello → Server Hello + Certificado → Key Exchange → Túnel simétrico estabelecido.' },
  { category: 'Segurança', front: 'Para que serve o TTL no Traceroute?', back: 'Cada router no caminho decrementa o TTL; quando chega a 0, devolve "tempo excedido", revelando a sua morada.' },
  { category: 'Segurança', front: 'Porta 22 aberta a 0.0.0.0/0', back: 'Anti-pattern grave — SSH nunca deve estar acessível à internet pública sem restrição de IP.' },

  // Cloud Networking
  { category: 'Cloud Networking', front: 'NSG vs Security Group', back: 'Azure NSG e AWS SG são firewalls stateful por subnet/NIC. AWS NACL é stateless, ao nível da subnet.' },
  { category: 'Cloud Networking', front: 'Private Link / PrivateLink', back: 'Acede a serviços cloud via IP privado, sem tráfego sair para a internet pública.' },
  { category: 'Cloud Networking', front: 'NAT Gateway', back: 'Permite egress de subnets privadas para a internet, sem expor os IPs privados internos.' },
  { category: 'Cloud Networking', front: 'VNet Peering — é transitivo?', back: 'Não. Se A↔B e B↔C estão peered, A não comunica directamente com C sem peering próprio.' },
];

export const networkingFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `networking-${i}`,
  domain: 'networking' as const,
}));
