import { useState } from 'react';
import { Copy, Check, Network, Shield, Zap, Layers, RefreshCw, Activity } from 'lucide-react';

function Code({ code, lang = 'yaml' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-400">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-300">
          {c ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-[#181926]">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600'
            : /^(apiVersion|kind|metadata|spec|name|namespace):/.test(line.trim()) ? 'text-violet-400'
            : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const ISTIO_GATEWAY = `apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: myapp-gateway
  namespace: production
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: myapp-tls
    hosts:
    - "myapp.acme.com"`;

const VIRTUAL_SERVICE = `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp-routing
spec:
  hosts: ["myapp.acme.com"]
  gateways: [myapp-gateway]
  http:
  - match:
    - uri:
        prefix: /v2
    route:
    - destination:
        host: myapp
        subset: v2
        port:
          number: 80
    timeout: 5s
    retries:
      attempts: 3
      perTryTimeout: 2s
  - route:
    - destination:
        host: myapp
        subset: v1
        port:
          number: 80`;

export default function ServiceMeshSimulator() {
  const [section, setSection] = useState<'what' | 'mtls' | 'traffic' | 'observability'>('what');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const views = [
    { id: 'what' as const, label: 'O que é?', icon: Network },
    { id: 'mtls' as const, label: 'mTLS', icon: Shield },
    { id: 'traffic' as const, label: 'Traffic Mgmt', icon: Zap },
    { id: 'observability' as const, label: 'Observability', icon: Activity },
  ];

  const quizQuestions = [
    { q: 'O que é o sidecar num service mesh?', a: ['Um proxy que corre no mesmo pod que a aplicação', 'Um load balancer externo', 'Uma base de dados em memória', 'Um orchestrator de containers'], correct: 0 },
    { q: 'Qual o propósito do mTLS num service mesh?', a: ['Aumentar throughput', 'Autenticação e encriptação entre services', 'Cache de respostas', 'Balanceamento de carga'], correct: 1 },
    { q: 'O que é o "canary deployment" no Istio?', a: ['Deploy para todos de uma vez', 'Roteamento de uma percentagem de tráfego para uma versão nova', 'Deploy em ambiente de staging', 'Rollback automático'], correct: 1 },
  ];

  const q = quizQuestions[section === 'what' ? 0 : section === 'mtls' ? 1 : 2];
  const showQuiz = section === 'observability' ? false : true;

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setSection(v.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${section === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300'}`}>
            <v.icon size={14} />
            {v.label}
          </button>
        ))}
      </div>

      {/* ── O que é ── */}
      {section === 'what' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Network size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Service Mesh: Infraestrutura de Comunicação</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Um service mesh é uma <span className="text-white font-bold">camada de infraestrutura dedicada</span> que gere a comunicação service-a-service num cluster. A lógica de rede (retry, timeout, circuit breaker, mTLS) é movida do código da aplicação para um <span className="text-violet-300 font-bold">sidecar proxy</span> — tipicamente <span className="font-mono text-xs bg-violet-500/20 px-1 rounded">Envoy</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Architecture diagram */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Arquitetura com Sidecar</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { title: 'App Container', desc: 'A tua aplicação (Go, Python, Java...)', color: 'violet' },
                { title: 'Envoy Sidecar', desc: 'Proxy lateral — intercepta todo o tráfego', color: 'amber' },
                { title: 'Istio Control Plane', desc: 'Istiod — configura os proxies', color: 'emerald' },
              ].map(card => (
                <div key={card.title} className={`p-3 rounded-xl border border-${card.color}-500/20 bg-${card.color}-500/5`}>
                  <div className={`text-xs font-bold mb-1 ${card.color === 'violet' ? 'text-violet-300' : card.color === 'amber' ? 'text-amber-300' : 'text-emerald-300'}`}>{card.title}</div>
                  <div className="text-2xs text-slate-400">{card.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center text-2xs text-slate-500 font-mono">
              Tráfego: App → Envoy (out) → Envoy (in) → App → Envoy (out) → Istiod
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'mTLS Automático', desc: 'Encriptação ponto-a-ponto sem tocar no código', icon: Shield },
              { title: 'Circuit Breaker', desc: 'Previne cascata de falhas entre services', icon: RefreshCw },
              { title: 'Observability', desc: 'Métricas, tracing e logs automáticos', icon: Activity },
              { title: 'Traffic Mgmt', desc: 'Canary, A/B, blue-green sem código', icon: Zap },
            ].map(f => (
              <div key={f.title} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <f.icon size={16} className="text-violet-400 mb-2" />
                <div className="text-sm font-bold text-white">{f.title}</div>
                <div className="text-2xs text-slate-400 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── mTLS ── */}
      {section === 'mtls' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Shield size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">mTLS — Mutual TLS</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Ambos os lados (cliente e servidor) autenticam-se mutuamente. O Istio gera e rota os certificados automaticamente — <span className="text-white font-bold">zero config manual</span>.
                </p>
              </div>
            </div>
          </div>

          {/* mTLS flow */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-3">Fluxo de Handshake mTLS</div>
            <div className="space-y-2 text-xs font-mono">
              {[
                '1. Client → Server: ClientHello + certificado do cliente',
                '2. Server → Client: ServerHello + certificado do servidor',
                '3. Ambos verificam CA (Certificate Authority) do Istio',
                '4. Chave de sessão é derivada → canal encriptado',
                '5. Tráfego flui encriptado (AES-256-GCM)',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-2xs font-bold shrink-0">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <Code code={ISTIO_GATEWAY} />

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Traffic Management ── */}
      {section === 'traffic' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Zap size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Traffic Management</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Controla como o tráfego flui entre versões de services. Sem tocar no código da app — <span className="text-white font-bold">só YAML</span>.
                </p>
              </div>
            </div>
          </div>

          <Code code={VIRTUAL_SERVICE} />

          {/* Traffic strategies */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Canary', desc: '5% do tráfego para v2, monitorizar, escalar', pattern: 'weight: 95,5' },
              { title: 'A/B Testing', desc: 'Cada subset recebe tráfego baseado em header', pattern: 'header: user-type=beta' },
              { title: 'Blue/Green', desc: 'Tráfego switch total de blue para green', pattern: 'switch: instant' },
              { title: 'Fault Injection', desc: 'Simular latency/falhas para testar resilience', pattern: 'abort: 5%, delay: 5s' },
            ].map(s => (
              <div key={s.title} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="text-sm font-bold text-white">{s.title}</div>
                <div className="text-2xs text-slate-400 mt-1">{s.desc}</div>
                <div className="mt-2 text-2xs font-mono text-violet-400">{s.pattern}</div>
              </div>
            ))}
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">{q.q}</p>
            <div className="space-y-2">
              {q.a.map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === q.correct ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === q.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === q.correct ? '✓ Correto!' : `✗ Incorreto — resposta: ${q.a[q.correct]}`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Observability ── */}
      {section === 'observability' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-start gap-3">
              <Activity size={22} className="text-violet-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-lg font-bold text-violet-300">Observabilidade Nativa</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  O Istio expõe automaticamente <span className="text-white font-bold">métricas, tracing distribuído e logs</span> — sem instrumentação na app.
                </p>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Request Rate', desc: 'Req/s por service', unit: 'qps' },
              { title: 'Error Rate', desc: '% de respostas 5xx', unit: '%' },
              { title: 'Latency', desc: 'P50/P90/P99', unit: 'ms' },
              { title: 'Trace', desc: 'Jaeger — hotpath', unit: 'span' },
              { title: 'Circuit Breaker', desc: 'Estados abertos/fechados', unit: 'state' },
              { title: 'mTLS', desc: 'Conexões seguras', unit: 'conn' },
            ].map(m => (
              <div key={m.title} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
                <div className="text-lg font-bold text-violet-300">{m.unit}</div>
                <div className="text-xs font-bold text-white mt-1">{m.title}</div>
                <div className="text-2xs text-slate-500">{m.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Kiali — Visual Graph</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              O <span className="text-white font-bold">Kiali</span> desenha automaticamente o grafo de serviços no cluster, com heatmaps de latência e taxa de erro por hop. Cada linha é uma chamada service-to-service; a espessura é o volume.
            </div>
          </div>

          {/* Quiz */}
          <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5">
            <div className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Mini-Quiz</div>
            <p className="text-sm text-white font-semibold mb-3">Qual a principal vantagem da observabilidade num service mesh?</p>
            <div className="space-y-2">
              {[
                'Reduz o custo de infraestrutura',
                'Métricas e tracing automáticos sem tocar no código da app',
                'Aumenta a throughput dos containers',
                'Elimina a necessidade de logs',
              ].map((a, i) => (
                <button key={i} onClick={() => setQuizAnswer(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    quizAnswer === i
                      ? i === 1 ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : 'border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}>
                  {['A', 'B', 'C', 'D'][i]}. {a}
                </button>
              ))}
            </div>
            {quizAnswer !== null && (
              <div className={`mt-2 text-xs font-semibold ${quizAnswer === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quizAnswer === 1 ? '✓ Correto!' : '✗ Incorreto — resposta: B'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
