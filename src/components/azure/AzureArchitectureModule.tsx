import { useState } from 'react';
import { Network, Copy, Check } from 'lucide-react';

type View = 'stack' | 'delivery' | 'identity' | 'questions';

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
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const ARCHITECTURE = `# Como as peças se ligam numa solução Azure bem desenhada

                        Utilizadores
                             │
                    ┌────────▼────────┐
                    │ Azure Front Door │  ← global, L7, com WAF
                    └────────┬────────┘
                             │
              ┌──────────────▼──────────────┐
              │ Application Gateway / APIM   │  ← regional, L7
              └──────────────┬──────────────┘
                             │
   ┌─────────────────────────▼─────────────────────────┐
   │              CAMADA DE APLICAÇÃO                   │
   │   App Service · Container Apps · AKS · VMs         │
   └─────────────────────────┬─────────────────────────┘
                             │
   ┌─────────────────────────▼─────────────────────────┐
   │                CAMADA DE DADOS                     │
   │   Azure SQL · Cosmos DB · Storage Account          │
   └───────────────────────────────────────────────────┘

# Serviços transversais que sustentam tudo:
#
#   Entra ID          autenticação e acesso
#   Key Vault         segredos, chaves e certificados
#   Private Endpoints acesso privado aos serviços de plataforma
#   Azure Firewall    protecção de rede
#   NSGs              filtragem ao nível de subnet e NIC
#   Azure Monitor     logs, métricas e alertas
#   Defender          postura de segurança
#   Azure Policy      governança e conformidade
#   Terraform/Bicep   infraestrutura reproduzível
#   Backup            recuperação de falhas`;

const DELIVERY_SERVICES = [
  { n: 1, name: 'Azure Load Balancer', scope: 'Regional · Layer 4', points: ['TCP e UDP', 'Cargas públicas ou internas', 'Sem inspecção de conteúdo'], color: 'sky' },
  { n: 2, name: 'Application Gateway', scope: 'Regional · Layer 7', points: ['Routing HTTP e HTTPS', 'Web Application Firewall', 'Terminação TLS'], color: 'violet' },
  { n: 3, name: 'Azure Front Door', scope: 'Global · Layer 7', points: ['Serviço de edge global', 'Aceleração de aplicação', 'Routing global com WAF'], color: 'amber' },
  { n: 4, name: 'Traffic Manager', scope: 'Global · DNS', points: ['Routing baseado em DNS', 'Direcciona para endpoints', 'NÃO faz proxy do tráfego'], color: 'emerald' },
  { n: 5, name: 'API Management', scope: 'Regional · APIs', points: ['Publica e protege APIs', 'Autenticação e políticas', 'Rate limiting'], color: 'rose' },
];

const DECISION_TREE = `# Como escolher o serviço de distribuição de tráfego

  A carga é TCP ou UDP (não-HTTP)?
      └─> Azure Load Balancer

  É uma aplicação web regional?
      └─> Application Gateway

  É uma aplicação web global?
      └─> Azure Front Door

  Precisas de routing global por DNS?
      └─> Traffic Manager

  Vais publicar e governar APIs?
      └─> API Management

# Fluxo típico de uma aplicação global:
#
#   Utilizadores → Front Door → Application Gateway
#   → Instâncias da aplicação → Health probes
#
# Load balancing não é um serviço só. Escolhe pelo
# protocolo, pela camada e pelo âmbito geográfico.`;

const IDENTITY_TYPES = [
  { title: 'Identidades humanas', items: ['Utilizadores', 'Grupos', 'Utilizadores convidados (guest)', 'Contas administrativas'], color: 'sky' },
  { title: 'Identidades de workload', items: ['Service principals', 'Managed identity atribuída pelo sistema', 'Managed identity atribuída pelo utilizador'], color: 'violet' },
  { title: 'Protecção de identidade', items: ['Autenticação multifactor (MFA)', 'Conditional Access', 'Privileged Identity Management (PIM)', 'Revisões de acesso'], color: 'emerald' },
];

const RBAC_FORMULA = `# A fórmula do Azure RBAC

  Security Principal  +  Role Definition  +  Scope  =  Role Assignment
  (quem)                 (o que pode fazer)   (onde)     (a atribuição)

# Âmbitos, do mais amplo ao mais estreito:

  Management Group   aplica políticas e acesso a várias subscrições
        │
  Subscription       fronteira de faturação, acesso e limites
        │
  Resource Group     contentor lógico de recursos com ciclo de vida comum
        │
  Resource           o serviço individual

# A atribuição herda para baixo: dar Contributor numa
# subscrição dá Contributor em todos os recursos dentro dela.`;

const ROLES_COMPARISON = `# Dois sistemas de papéis diferentes — não confundir

  MICROSOFT ENTRA ROLES          AZURE RBAC ROLES
  ─────────────────────          ────────────────
  Controlam acesso a             Controlam acesso a
  identidade e funções           recursos do Azure
  de directório

  Exemplos:                      Exemplos:
   · Global Administrator         · Owner
   · User Administrator           · Contributor
   · Authentication Admin         · Reader

# Um Global Administrator do Entra ID não tem
# automaticamente acesso aos recursos Azure —
# são planos de controlo distintos.`;

const ARCH_QUESTIONS = [
  'Como é que os utilizadores e as workloads se vão autenticar?',
  'Que componentes precisam mesmo de acesso público?',
  'Como vai funcionar a conectividade privada e o DNS?',
  'Como é que a aplicação vai escalar?',
  'Como serão os dados protegidos e recuperados?',
  'Como vai o ambiente ser monitorizado?',
  'Como serão os padrões e o custo governados?',
];

export default function AzureArchitectureModule() {
  const [view, setView] = useState<View>('stack');

  const tabs: { id: View; label: string }[] = [
    { id: 'stack',     label: 'A stack completa' },
    { id: 'delivery',  label: 'Entrega e balanceamento' },
    { id: 'identity',  label: 'Identidade e RBAC' },
    { id: 'questions', label: 'Perguntas de desenho' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-sky-500/25 bg-sky-500/5 p-5">
        <div className="flex items-center gap-3">
          <Network size={22} className="text-sky-400" />
          <div>
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Arquitectura</div>
            <h2 className="text-lg font-bold text-white">Como os serviços Azure se ligam</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          Os outros módulos mostram cada serviço isoladamente. Este mostra o desenho —
          como identidade, rede, segurança, dados, monitorização e governança se combinam
          numa solução que funciona em produção.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Stack ───────────────────────────────────────────── */}
      {view === 'stack' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">A arquitectura de referência</h3>
            <Code code={ARCHITECTURE} lang="texto" />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">O que distingue um bom desenho</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Reparar que os serviços transversais — identidade, segredos, rede privada, monitorização,
              governança — não estão numa camada. Atravessam todas. É por isso que decisões sobre Entra ID
              ou Private Endpoints afectam a aplicação inteira, e não apenas um componente.
            </p>
          </div>
        </div>
      )}

      {/* ── Delivery ────────────────────────────────────────── */}
      {view === 'delivery' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-1">Cinco serviços, cinco propósitos</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Distribuem tráfego em camadas e âmbitos geográficos diferentes.
            </p>
            <div className="space-y-2">
              {DELIVERY_SERVICES.map(s => (
                <div key={s.n} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`shrink-0 w-5 h-5 rounded-full bg-${s.color}-500/15 border border-${s.color}-500/30 flex items-center justify-center text-[9px] font-black text-${s.color}-300`}>
                      {s.n}
                    </span>
                    <span className="text-[13px] font-bold text-white">{s.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{s.scope}</span>
                  </div>
                  <ul className="mt-1.5 pl-7 space-y-0.5">
                    {s.points.map(p => (
                      <li key={p} className="text-[11px] text-slate-400">· {p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Árvore de decisão</h3>
            <Code code={DECISION_TREE} lang="texto" />
          </section>

          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Boa prática</div>
            <p className="text-[12px] text-emerald-100 leading-relaxed">
              Activa health probes e distribui as instâncias por domínios de falha diferentes.
              Sem health probes, o balanceador continua a enviar tráfego para instâncias mortas.
            </p>
          </div>
        </div>
      )}

      {/* ── Identity ────────────────────────────────────────── */}
      {view === 'identity' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Três tipos de identidade</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {IDENTITY_TYPES.map(t => (
                <div key={t.title} className={`p-4 rounded-2xl border border-${t.color}-500/20 bg-${t.color}-500/5`}>
                  <div className={`text-[10px] font-black text-${t.color}-400 uppercase tracking-widest mb-2`}>{t.title}</div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    {t.items.map(i => <li key={i}>· {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">A fórmula do RBAC</h3>
            <Code code={RBAC_FORMULA} lang="texto" />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Entra roles vs Azure RBAC roles</h3>
            <Code code={ROLES_COMPARISON} lang="texto" />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Boas práticas de acesso</h3>
            <div className="space-y-1.5">
              {[
                'Atribuir acesso a grupos, não a utilizadores individuais',
                'Preferir managed identities para workloads Azure — sem credenciais para gerir',
                'Exigir MFA para acesso privilegiado',
                'Usar elevação temporária (PIM) onde fizer sentido',
                'Seguir o princípio do menor privilégio no âmbito mais estreito possível',
              ].map(p => (
                <div key={p} className="flex gap-2 p-2.5 rounded-xl bg-slate-900">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span className="text-[12px] text-slate-300">{p}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">A distinção essencial</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              A autenticação prova quem és. A autorização determina o que podes fazer.
              O Entra ID trata da primeira; o RBAC da segunda. Confundi-las é a origem
              de metade dos problemas de permissões em Azure.
            </p>
          </div>
        </div>
      )}

      {/* ── Questions ───────────────────────────────────────── */}
      {view === 'questions' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-1">Sete perguntas antes de desenhar</h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Se conseguires responder a estas, tens o desenho. Se ficares preso numa,
              encontraste a decisão que ainda falta tomar.
            </p>
            <div className="space-y-2">
              {ARCH_QUESTIONS.map((q, i) => (
                <div key={q} className="flex gap-3 p-3 rounded-xl bg-slate-900">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-[10px] font-black text-sky-300">
                    {i + 1}
                  </span>
                  <span className="text-[12px] text-slate-300 leading-relaxed">{q}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Numa entrevista</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              Estas sete perguntas são também a estrutura de uma boa resposta a
              &ldquo;desenha-me uma solução em Azure&rdquo;. Percorrê-las em voz alta mostra método
              em vez de memória — e garante que não te esqueces de identidade, rede privada
              ou governança, que são precisamente onde a maioria dos candidatos falha.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
