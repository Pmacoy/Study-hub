import { useState } from 'react';
import { Copy, Check, Layers } from 'lucide-react';

type View = 'osi' | 'tcpudp' | 'dns' | 'ssh';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') ? 'text-emerald-300'
            : 'text-slate-300'
          }>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const OSI_LAYERS = [
  { n: 7, name: 'Application', pt: 'Aplicação', does: 'Serviços de rede directamente às aplicações do utilizador', protos: 'HTTP, HTTPS, FTP, SMTP, DNS, DHCP, SSH', pdu: 'Data', color: 'violet' },
  { n: 6, name: 'Presentation', pt: 'Apresentação', does: 'Formatação de dados, encriptação, desencriptação e compressão', protos: 'SSL/TLS, JPEG, MPEG, ASCII', pdu: 'Data', color: 'violet' },
  { n: 5, name: 'Session', pt: 'Sessão', does: 'Estabelece, gere e termina sessões entre aplicações', protos: 'NetBIOS, RPC, SQL, Named Pipes', pdu: 'Data', color: 'violet' },
  { n: 4, name: 'Transport', pt: 'Transporte', does: 'Comunicação ponta a ponta, segmentação, fiabilidade, controlo de fluxo', protos: 'TCP, UDP', pdu: 'Segment (TCP) / Datagram (UDP)', color: 'amber' },
  { n: 3, name: 'Network', pt: 'Rede', does: 'Endereçamento lógico e routing de pacotes entre redes', protos: 'IP (IPv4, IPv6), ICMP, IGMP', pdu: 'Packet', color: 'sky' },
  { n: 2, name: 'Data Link', pt: 'Ligação de dados', does: 'Entrega nó a nó, framing, endereçamento MAC, detecção de erros', protos: 'Ethernet, PPP, MAC, VLAN, ARP', pdu: 'Frame', color: 'emerald' },
  { n: 1, name: 'Physical', pt: 'Física', does: 'Transmite bits em bruto sobre o meio físico', protos: 'Ethernet (PHY), Hubs, Repetidores, Cabos', pdu: 'Bits', color: 'rose' },
];

const ENCAPSULATION = `# Como os dados descem a pilha (encapsulação)

  Application Data
        ↓
L4  [ TCP Header | Data ]
        ↓
L3  [ IP Header | TCP Header | Data ]
        ↓
L2  [ MAC Header | IP Header | TCP Header | Data | FCS ]
        ↓
L1  0101010101010101010101...

# Cada camada acrescenta o seu cabeçalho ao descer.
# No receptor o processo inverte-se (desencapsulação)
# e os dados originais chegam à aplicação.`;

const TCP_VS_UDP = [
  ['Ligação', 'Orientado a ligação', 'Sem ligação'],
  ['Fiabilidade', 'Fiável (ACK, retransmissão)', 'Não fiável'],
  ['Ordem dos dados', 'Mantém a ordem', 'Sem garantia de ordem'],
  ['Velocidade', 'Mais lento', 'Mais rápido'],
  ['Overhead', 'Maior (cabeçalhos, handshake)', 'Menor (cabeçalho mínimo)'],
  ['Controlo de fluxo', 'Sim', 'Não'],
  ['Verificação de erros', 'Sim', 'Só checksum'],
  ['Tamanho do cabeçalho', '20–60 bytes', '8 bytes'],
];

const HANDSHAKE = `# TCP — three-way handshake (orientado a ligação)

  Emissor                          Receptor
     |  ──────── 1. SYN ─────────>  |
     |  <────── 2. SYN-ACK ───────  |
     |  ──────── 3. ACK ─────────>  |
     |                              |
     |   ligação estabelecida       |
     |  <═══ transferência ═══>     |

# UDP — sem handshake (sem ligação)

  Emissor                          Receptor
     |  ──────── Data ──────────>   |
     |   começa a enviar já         |`;

const TCP_FLAGS = `# Flags do cabeçalho TCP

URG  Urgent          — dados urgentes, processar primeiro
ACK  Acknowledgment  — confirma recepção
PSH  Push            — entrega imediata à aplicação
RST  Reset           — termina a ligação abruptamente
SYN  Synchronize     — inicia ligação (handshake)
FIN  Finish          — termina ligação graciosamente

# Cabeçalho TCP: 20–60 bytes
#   Source Port (16) · Destination Port (16)
#   Sequence Number (32) · Acknowledgment Number (32)
#   Data Offset · Reserved · Flags · Window Size (16)
#   Checksum (16) · Urgent Pointer (16) · Options (0–40 bytes)

# Cabeçalho UDP: 8 bytes apenas
#   Source Port (16) · Destination Port (16)
#   Length (16) · Checksum (16)`;

const DNS_RECORDS = [
  ['A', 'Mapeia domínio para endereço IPv4', 'example.com → 93.184.216.34'],
  ['AAAA', 'Mapeia domínio para endereço IPv6', 'example.com → 2606:2800:220:1:248:1893:25c8:1946'],
  ['CNAME', 'Alias de um domínio para outro', 'www.example.com → example.com'],
  ['MX', 'Servidor de correio do domínio', 'example.com → mail.example.com'],
  ['NS', 'Servidores de nomes do domínio', 'example.com → ns1.example.com'],
  ['TXT', 'Informação em texto (SPF, verificação)', '"v=spf1 include:_spf.google.com ~all"'],
];

const DNS_RESOLUTION = `# Resolução de www.example.com — passo a passo

 1. Utilizador escreve www.example.com no browser
 2. Browser verifica a cache local
 3. Se não encontrar, consulta o DNS Resolver (ISP)
 4. Resolver consulta um Root server
 5. Root responde com o servidor TLD de .com
 6. Resolver consulta o servidor TLD .com
 7. TLD responde com o servidor autoritativo de example.com
 8. Resolver consulta o servidor autoritativo
 9. Autoritativo devolve o endereço IP
10. Resolver devolve o IP ao browser
11. Browser liga-se ao IP

# Hierarquia DNS (do mais genérico ao mais específico)
#   Root (.)  →  TLD (.com .org .net)
#   →  Second Level (example.com)
#   →  Subdomínio / Host (www.example.com)`;

const DNS_COMMANDS = `# Verificar resolução DNS
$ nslookup example.com
$ dig example.com

# Obter apenas o registo A
$ host example.com

# Reverse lookup (IP → domínio)
$ dig -x 8.8.8.8

# Consultar um tipo de registo específico
$ dig example.com MX

# Forçar um resolver específico (contorna o do sistema)
$ dig @8.8.8.8 example.com

# DNS públicos comuns
#   Google      8.8.8.8      8.8.4.4
#   Cloudflare  1.1.1.1      1.0.0.1
#   OpenDNS     208.67.222.222  208.67.220.220

# Cache: cada registo tem um TTL (Time To Live).
# Até o TTL expirar, é usada a resposta em cache.`;

const SSH_FLOW = `# Fluxo de ligação SSH

  Cliente                            Servidor
     |  ── 1. Pedido de ligação ───>   |
     |  <─ 2. Chave pública ────────   |
     |     3. Verificação da chave     |
     |        (cliente valida)         |
     |  <═ 4. Sessão encriptada ═══>   |
     |  <═ 5. Troca de dados segura ═> |

# Comando base
$ ssh username@ip_address

# Exemplo
$ ssh ubuntu@10.0.1.10

# Opções úteis
$ ssh -p 2222 user@host        # porta alternativa
$ ssh -i key.pem user@host     # ficheiro de chave`;

const SSH_KEYS = `# Autenticação por chave (melhor que password)

# 1. Gerar par de chaves
$ ssh-keygen -t rsa -b 4096

#    id_rsa      → chave privada (NUNCA partilhar)
#    id_rsa.pub  → chave pública (vai para o servidor)

# 2. Copiar a chave pública para o servidor
$ ssh-copy-id username@ip

# 3. Login sem password
$ ssh username@ip

# Config em ~/.ssh/config para simplificar
Host myserver
  HostName 10.0.1.10
  User ubuntu
  Port 22
  IdentityFile ~/.ssh/id_rsa

# Passa a bastar:
$ ssh myserver`;

const SCP_SYNTAX = `# SCP — copiar ficheiros de forma segura (usa SSH, porta 22)

# Local → Remoto
$ scp file.txt username@ip:/path/
$ scp app.py ubuntu@10.0.1.10:/home/ubuntu/

# Remoto → Local
$ scp username@ip:/path/file.txt /local/path/
$ scp ubuntu@10.0.1.10:/home/ubuntu/app.py ./

# Directório inteiro (recursivo)
$ scp -r folder/ username@ip:/path/
$ scp -r myproject/ ubuntu@10.0.1.10:/backup/`;

export default function NetworkingReferenceModule() {
  const [view, setView] = useState<View>('osi');

  const tabs: { id: View; label: string }[] = [
    { id: 'osi',    label: 'Modelo OSI' },
    { id: 'tcpudp', label: 'TCP & UDP' },
    { id: 'dns',    label: 'DNS' },
    { id: 'ssh',    label: 'SSH & SCP' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-emerald-500/25 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3">
          <Layers size={22} className="text-emerald-400" />
          <div>
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Referência</div>
            <h2 className="text-lg font-bold text-white">Fundamentos de rede</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          As quatro peças que sustentam qualquer diagnóstico de rede: como os dados atravessam as camadas,
          a escolha entre TCP e UDP, como um nome se transforma em endereço, e como se liga a uma máquina
          remota em segurança.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OSI ─────────────────────────────────────────────── */}
      {view === 'osi' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-1">As 7 camadas</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Um modelo de referência que divide a comunicação em sete responsabilidades, cada uma com o seu papel.
            </p>
            <div className="space-y-1.5">
              {OSI_LAYERS.map(l => (
                <div key={l.n} className={`p-3 rounded-xl bg-slate-900 border-l-2 border-${l.color}-500/50`}>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`shrink-0 w-6 h-6 rounded-full bg-${l.color}-500/15 border border-${l.color}-500/30 flex items-center justify-center text-[10px] font-black text-${l.color}-300`}>
                      {l.n}
                    </span>
                    <span className="text-[13px] font-bold text-white">{l.name}</span>
                    <span className="text-[11px] text-slate-500">· {l.pt}</span>
                    <span className="ml-auto text-[10px] font-mono text-slate-600">{l.pdu}</span>
                  </div>
                  <div className="mt-1.5 pl-8">
                    <p className="text-[12px] text-slate-400">{l.does}</p>
                    <p className="text-[11px] text-slate-600 font-mono mt-1">{l.protos}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Encapsulação</h3>
            <Code code={ENCAPSULATION} lang="texto" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Na prática</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              O OSI é um modelo de referência — o que corre na internet é o modelo TCP/IP, com quatro camadas.
              A utilidade do OSI está em dar-te vocabulário preciso para dizer <em>onde</em> está o problema:
              &ldquo;isto é L3&rdquo; comunica muito mais do que &ldquo;a rede não funciona&rdquo;.
            </p>
          </div>
        </div>
      )}

      {/* ── TCP & UDP ───────────────────────────────────────── */}
      {view === 'tcpudp' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Comparação directa</h3>
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <span>Característica</span><span>TCP</span><span>UDP</span>
              </div>
              {TCP_VS_UDP.map(([f, tcp, udp]) => (
                <div key={f} className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 text-[11px]">
                  <span className="text-slate-300 font-medium">{f}</span>
                  <span className="text-sky-300">{tcp}</span>
                  <span className="text-amber-300">{udp}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Handshake</h3>
            <Code code={HANDSHAKE} lang="texto" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Flags e cabeçalhos</h3>
            <Code code={TCP_FLAGS} lang="texto" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Quando usar cada um</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Usa TCP quando</div>
                <ul className="space-y-1 text-[12px] text-slate-400">
                  <li>· Precisas de entrega fiável</li>
                  <li>· A ordem dos dados importa</li>
                  <li>· A integridade é crítica</li>
                  <li className="text-slate-500 pt-1">Web (HTTP/HTTPS), email, transferência de ficheiros, SSH, bases de dados</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Usa UDP quando</div>
                <ul className="space-y-1 text-[12px] text-slate-400">
                  <li>· A velocidade importa mais</li>
                  <li>· Dados pequenos, tempo real</li>
                  <li>· Alguma perda é aceitável</li>
                  <li className="text-slate-500 pt-1">Streaming de vídeo, VoIP, DNS, gaming online</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              Não há protocolo melhor — há o protocolo certo para cada trabalho. O trade-off é sempre
              fiabilidade contra velocidade.
            </p>
          </section>
        </div>
      )}

      {/* ── DNS ─────────────────────────────────────────────── */}
      {view === 'dns' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Tipos de registo</h3>
            <div className="space-y-1.5">
              {DNS_RECORDS.map(([type, purpose, example]) => (
                <div key={type} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline gap-3">
                    <code className="shrink-0 text-[12px] font-bold text-emerald-300 w-14">{type}</code>
                    <span className="text-[12px] text-slate-300">{purpose}</span>
                  </div>
                  <code className="block mt-1 pl-[4.25rem] text-[11px] text-slate-600 font-mono break-all">{example}</code>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Como um nome vira endereço</h3>
            <Code code={DNS_RESOLUTION} lang="texto" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Comandos de diagnóstico</h3>
            <Code code={DNS_COMMANDS} lang="bash" />
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Ligação ao terreno</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              Perceber a hierarquia explica por que razão <code className="text-sky-300">dig @8.8.8.8 nome</code> é
              o comando decisivo quando o DNS falha: contorna o resolver do host e prova se o problema
              é o servidor configurado ou o nome em si.
            </p>
          </div>
        </div>
      )}

      {/* ── SSH & SCP ───────────────────────────────────────── */}
      {view === 'ssh' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Como a ligação se estabelece</h3>
            <Code code={SSH_FLOW} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Autenticação por chave</h3>
            <Code code={SSH_KEYS} lang="bash" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">SCP — copiar ficheiros</h3>
            <Code code={SCP_SYNTAX} lang="bash" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Primeira ligação</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Na primeira vez que ligas a um servidor, o SSH mostra a fingerprint da chave
              (<code className="text-amber-300">SHA256:...</code>) e pede confirmação. Verifica-a por um canal
              independente antes de escreveres &ldquo;yes&rdquo; — é a única defesa contra um ataque
              man-in-the-middle na ligação inicial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
