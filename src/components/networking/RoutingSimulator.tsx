import React, { useState, useMemo } from 'react';
import { Waypoints, Globe, CheckCircle2, XCircle, Map, Server, Shield, Zap } from 'lucide-react';

function ipToInt(ip: string): number {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
}

interface Route {
  id: number;
  destination: string;
  cidr: number;
  gateway: string;
  interface: string;
  metric: number;
  description: string;
}

const routingTable: Route[] = [
  { id: 1, destination: '192.168.1.0', cidr: 24, gateway: 'On-link (Conectado Diretamente)', interface: 'eth0 (LAN)', metric: 10, description: "Rede Local: O IP de destino está na mesma rede física do roteador." },
  { id: 2, destination: '10.0.0.0', cidr: 8, gateway: '192.168.1.254', interface: 'tun0 (VPN Matriz)', metric: 50, description: "Rota Corporativa Genérica: Envia tráfego 10.x.x.x para o túnel da VPN." },
  { id: 3, destination: '10.5.0.0', cidr: 16, gateway: '192.168.1.253', interface: 'tun1 (VPN Filial)', metric: 40, description: "Rota Específica (Longest Prefix Match): Escolhida por ter maior máscara (/16)." },
  { id: 4, destination: '0.0.0.0', cidr: 0, gateway: '192.168.1.1', interface: 'eth1 (WAN/Internet)', metric: 100, description: "Rota Padrão (Default Gateway): Encaminhado para a Internet." }
];

export default function RoutingSimulator() {
  const [activeTab, setActiveTab] = useState<'l3' | 'omniroute'>('l3');
  const [inputValue, setInputValue] = useState('netflix.com');
  const [activeIp, setActiveIp] = useState('186.192.90.5');
  const [resolvedDomain, setResolvedDomain] = useState<string | null>('netflix.com');

  const [isResolving, setIsResolving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OmniRoute intelligent edge state
  const [omniStrategy, setOmniStrategy] = useState<'latency' | 'geo' | 'failover'>('latency');
  const [edgeSimulating, setEdgeSimulating] = useState(false);
  const [edgeResult, setEdgeResult] = useState('Região Ativa: US-East (Latência: 18ms)');

  const simulateOmniRoute = (strategy: 'latency' | 'geo' | 'failover') => {
    setEdgeSimulating(true);
    setOmniStrategy(strategy);
    setTimeout(() => {
      if (strategy === 'latency') setEdgeResult('⚡ OmniRoute Smart Edge: Roteado para US-East (Menor latência: 18ms)');
      else if (strategy === 'geo') setEdgeResult('🌍 OmniRoute Geo-Routing: Roteado para EU-Central (Compliance GDPR ativado)');
      else setEdgeResult('🛡️ OmniRoute Failover: Região primária falhou. Tráfego redirecionado para AP-South (Zero Downtime)');
      setEdgeSimulating(false);
    }, 700);
  };

  const handleSimulate = async () => {
    setErrorMsg(null);
    setResolvedDomain(null);
    const val = inputValue.trim().toLowerCase();
    if (!val) return;

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(val);
    if (isIp) {
      setActiveIp(val);
    } else {
      setIsResolving(true);
      try {
        const response = await fetch(`https://dns.google/resolve?name=${val}&type=A`);
        const data = await response.json();
        if (data.Answer && data.Answer.length > 0) {
          const ipRecord = data.Answer.find((a: any) => a.type === 1);
          if (ipRecord) {
            setActiveIp(ipRecord.data);
            setResolvedDomain(val);
          } else {
            setErrorMsg(`Nenhum IPv4 encontrado para '${val}'.`);
          }
        } else {
          setErrorMsg(`Domínio '${val}' não encontrado.`);
        }
      } catch {
        setErrorMsg("Erro de rede ao consultar DNS.");
      } finally {
        setIsResolving(false);
      }
    }
  };

  const matchedRoute = useMemo(() => {
    try {
      const targetInt = ipToInt(activeIp);
      const validRoutes = routingTable.filter(route => {
        const routeIpInt = ipToInt(route.destination);
        const maskInt = route.cidr === 0 ? 0 : (0xFFFFFFFF << (32 - route.cidr)) >>> 0;
        return (targetInt & maskInt) === (routeIpInt & maskInt);
      });
      validRoutes.sort((a, b) => b.cidr - a.cidr);
      return validRoutes.length > 0 ? validRoutes[0] : null;
    } catch {
      return null;
    }
  }, [activeIp]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#181926] text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-6">

      {/* Cabeçalho & Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Waypoints className="text-emerald-400" />
            Roteamento L3 & OmniRoute Smart Edge
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore o roteamento tradicional (Longest Prefix Match) e roteamento de borda inteligente baseado em latência e GEOIP.
          </p>
        </div>

        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('l3')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'l3' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            Tabela L3 Standard
          </button>
          <button
            onClick={() => setActiveTab('omniroute')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'omniroute' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            OmniRoute Smart Edge
          </button>
        </div>
      </div>

      {activeTab === 'omniroute' ? (
        /* OmniRoute Smart Edge Lab */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="text-cyan-400" size={18} /> OmniRoute: Intelligent Edge & Reverse Proxy Routing
            </h3>
            <p className="text-sm text-slate-300">
              O OmniRoute atua como proxy reverso inteligente de borda, tomando decisões de encaminhamento dinâmicas baseadas em latência, geolocalização e failover automático.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => simulateOmniRoute('latency')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${omniStrategy === 'latency' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'border-slate-800 text-slate-400'}`}
              >
                ⚡ Latency-Based Routing
              </button>
              <button
                onClick={() => simulateOmniRoute('geo')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${omniStrategy === 'geo' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-400'}`}
              >
                🌍 GeoIP Routing (GDPR)
              </button>
              <button
                onClick={() => simulateOmniRoute('failover')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${omniStrategy === 'failover' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'border-slate-800 text-slate-400'}`}
              >
                🛡️ Automatic Failover
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-400 space-y-2">
              <div className="text-slate-500">// OmniRoute Edge Decision Engine</div>
              <div className={`p-3 rounded bg-slate-900 border border-slate-800 ${edgeSimulating ? 'animate-pulse text-amber-400' : 'text-emerald-400'}`}>
                {edgeSimulating ? 'A calcular rota ótima na borda global...' : edgeResult}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* L3 Standard Routing */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 shadow-inner space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Globe size={18} /> Destino da Requisição
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSimulate(); }}
                placeholder="Ex: google.com"
                className="flex-1 bg-[#181926] text-emerald-400 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-emerald-500 font-mono text-lg"
              />
              <button
                onClick={handleSimulate}
                disabled={isResolving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-md transition-colors disabled:opacity-50"
              >
                {isResolving ? 'Consultando...' : 'Traçar Rota'}
              </button>
            </div>

            {resolvedDomain && !errorMsg && (
              <div className="bg-sky-950/30 border border-sky-500/30 text-sky-300 px-4 py-2 rounded text-xs font-mono">
                Domínio <strong>{resolvedDomain}</strong> resolvido para <strong>{activeIp}</strong>
              </div>
            )}
            {errorMsg && (
              <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 px-4 py-2 rounded text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 text-xs uppercase">Destino / Máscara</th>
                  <th className="p-3 text-xs uppercase">Gateway</th>
                  <th className="p-3 text-xs uppercase">Interface</th>
                  <th className="p-3 text-xs uppercase text-center">Métrica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-[#181926]">
                {routingTable.map((route) => {
                  const isWinner = matchedRoute?.id === route.id;
                  return (
                    <tr key={route.id} className={isWinner ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' : 'hover:bg-slate-900/80'}>
                      <td className={`p-3 font-mono ${isWinner ? 'text-emerald-400 font-bold' : 'text-sky-400'}`}>
                        {route.destination}/{route.cidr}
                      </td>
                      <td className="p-3 text-slate-300 font-mono text-xs">{route.gateway}</td>
                      <td className="p-3 text-slate-400 text-xs">{route.interface}</td>
                      <td className="p-3 text-center text-amber-400 font-mono text-xs">{route.metric}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {matchedRoute && (
            <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-5 space-y-3">
              <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <CheckCircle2 size={16} /> Rota Selecionada (Longest Prefix Match): {matchedRoute.destination}/{matchedRoute.cidr}
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {matchedRoute.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
