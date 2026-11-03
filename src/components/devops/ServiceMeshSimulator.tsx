import { useState } from 'react';
import { Copy, Check, Network, Shield, Zap, Layers, RefreshCw, Activity, Terminal, AlertTriangle } from 'lucide-react';

export default function ServiceMeshSimulator() {
  const [section, setSection] = useState<'what' | 'mtls' | 'traffic' | 'fault-injection' | 'observability'>('what');

  // Fault injection interactive state
  const [faultType, setFaultType] = useState<'none' | 'delay' | 'abort'>('none');
  const [faultResponse, setFaultResponse] = useState<string>('Tráfego normal (200 OK - 12ms)');
  const [isInjecting, setIsInjecting] = useState<boolean>(false);

  const testFault = (type: 'none' | 'delay' | 'abort') => {
    setIsInjecting(true);
    setFaultType(type);
    setTimeout(() => {
      if (type === 'delay') setFaultResponse('⏱️ HTTP 200 OK — Latência injetada de 3.2s (Timeout test)');
      else if (type === 'abort') setFaultResponse('❌ HTTP 503 Service Unavailable — Falha simulada pelo Istio FaultInjection');
      else setFaultResponse('🟢 Tráfego normal (200 OK - 12ms)');
      setIsInjecting(false);
    }, 800);
  };

  const views = [
    { id: 'what' as const, label: 'O que é?', icon: Network },
    { id: 'mtls' as const, label: 'mTLS', icon: Shield },
    { id: 'traffic' as const, label: 'Traffic Mgmt', icon: Zap },
    { id: 'fault-injection' as const, label: 'Fault Injection Lab', icon: AlertTriangle },
    { id: 'observability' as const, label: 'Observability', icon: Activity },
  ];

  const VIRTUAL_SERVICE_FAULT = `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings-route
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percentage:
          value: 100.0
        fixedDelay: 3s
    route:
    - destination:
        host: ratings
        subset: v1`;

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
                <div className="text-lg font-bold text-violet-300">Service Mesh & Istio (SRE Course Standard)</div>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Um service mesh é uma <span className="text-white font-bold">camada de infraestrutura dedicada</span> para gerir a comunicação entre microsserviços. Baseado no curso SRE Istio, desacoplamos resiliência, mTLS e observabilidade da aplicação para o sidecar <span className="font-mono text-xs bg-violet-500/20 px-1 rounded text-violet-300">Envoy</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── mTLS ── */}
      {section === 'mtls' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-violet-300 font-bold">
              <Shield size={18} /> mTLS Mode: STRICT vs PERMISSIVE
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No modo <span className="text-white font-mono">STRICT</span>, todo o tráfego inter-serviços no namespace deve ser encriptado via TLS. No modo <span className="text-white font-mono">PERMISSIVE</span>, aceita conexões encriptadas e em plaintext simultaneamente (útil para migrações).
            </p>
          </div>
        </div>
      )}

      {/* ── Fault Injection Lab ── */}
      {section === 'fault-injection' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle size={18} /> Laboratório SRE: Injeção de Falhas (Istio VirtualService)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teste a resiliência da sua arquitetura simulando latência de rede ou falhas HTTP 503 sem alterar o código da aplicação.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button onClick={() => testFault('none')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${faultType === 'none' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-400'}`}>
                Tráfego Normal
              </button>
              <button onClick={() => testFault('delay')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${faultType === 'delay' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'border-slate-800 text-slate-400'}`}>
                Injetar Latência (3s)
              </button>
              <button onClick={() => testFault('abort')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border ${faultType === 'abort' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'border-slate-800 text-slate-400'}`}>
                Injetar Erro (HTTP 503)
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-500">// Simulação de Chamada gRPC / HTTP</div>
              <div className="text-white flex items-center gap-2">
                <Terminal size={14} className="text-violet-400" />
                curl -i http://ratings.production.svc.cluster.local/items/1
              </div>
              <div className={`p-2 rounded ${isInjecting ? 'text-amber-400 animate-pulse' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'}`}>
                {isInjecting ? 'A enviar pedido através do Envoy Proxy...' : faultResponse}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-slate-400 mb-2">YAML Istio Correspondente:</div>
              <div className="rounded-xl border border-slate-800 p-3 bg-[#181926] font-mono text-2xs text-violet-300 overflow-x-auto">
                <pre>{VIRTUAL_SERVICE_FAULT}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Traffic & Observability ── */}
      {section === 'traffic' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-sm font-bold text-violet-300">Traffic Management & Canary Deployments</div>
          <p className="text-xs text-slate-400">Utilize DestinationRules e Subsets para dividir tráfego entre v1 (90%) e v2 (10%).</p>
        </div>
      )}

      {section === 'observability' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-sm font-bold text-violet-300">Distributed Tracing (Jaeger / Kiali)</div>
          <p className="text-xs text-slate-400">Visualização em tempo de execução da malha de serviços, latências p99 e fluxos mTLS.</p>
        </div>
      )}
    </div>
  );
}
