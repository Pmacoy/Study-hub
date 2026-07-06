
import React, { useState, useMemo } from 'react';
import { Waypoints, Globe, CheckCircle2, XCircle, Map } from 'lucide-react';

// --- HELPER LOCAL DE MATEMÁTICA DE IP ---
// Mantido internamente para garantir independência do componente
function ipToInt(ip: string): number {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
}

// Estrutura de uma Rota
interface Route {
  id: number;
  destination: string;
  cidr: number;
  gateway: string;
  interface: string;
  metric: number;
  description: string;
}

// Nossa Tabela de Roteamento Didática
const routingTable: Route[] = [
  { id: 1, destination: '192.168.1.0', cidr: 24, gateway: 'On-link (Conectado Diretamente)', interface: 'eth0 (LAN)', metric: 10, description: "Rede Local: O IP de destino está na mesma rede física do roteador. Não precisa de gateway, entrega direto pelo switch." },
  { id: 2, destination: '10.0.0.0', cidr: 8, gateway: '192.168.1.254', interface: 'tun0 (VPN Matriz)', metric: 50, description: "Rota Corporativa Genérica: Envia qualquer tráfego da rede 10.x.x.x para o túnel da VPN da empresa." },
  { id: 3, destination: '10.5.0.0', cidr: 16, gateway: '192.168.1.253', interface: 'tun1 (VPN Filial)', metric: 40, description: "Rota Específica (Longest Prefix Match): Embora a rota 10.0.0.0/8 também sirva, esta rota (/16) é MAIS ESPECÍFICA. O roteador sempre escolhe a rota com a maior máscara." },
  { id: 4, destination: '0.0.0.0', cidr: 0, gateway: '192.168.1.1', interface: 'eth1 (WAN/Internet)', metric: 100, description: "Rota Padrão (Default Gateway): Como este IP não é da sua rede local nem da VPN, o roteador envia para a Internet através do provedor." }
];

export default function RoutingSimulator() {
  const [inputValue, setInputValue] = useState('netflix.com');
  const [activeIp, setActiveIp] = useState('186.192.90.5'); 
  const [resolvedDomain, setResolvedDomain] = useState<string | null>('netflix.com');
  
  const [isResolving, setIsResolving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            setErrorMsg(`Nenhum IPv4 encontrado para o domínio '${val}'.`);
          }
        } else {
          setErrorMsg(`Domínio '${val}' não encontrado no DNS global.`);
        }
      } catch (e) {
        setErrorMsg("Erro de rede ao tentar consultar o Servidor DNS.");
      } finally {
        setIsResolving(false);
      }
    }
  };

  // Lógica de decisão de roteamento (Longest Prefix Match)
  const matchedRoute = useMemo(() => {
    try {
      const targetInt = ipToInt(activeIp);
      
      const validRoutes = routingTable.filter(route => {
        const routeIpInt = ipToInt(route.destination);
        
        // CORREÇÃO: Se o CIDR for 0, a máscara binária é 0. 
        // Evitamos o bug do JS que falha ao fazer shift (<<) de 32 bits.
        const maskInt = route.cidr === 0 ? 0 : (0xFFFFFFFF << (32 - route.cidr)) >>> 0;
        
        return (targetInt & maskInt) === (routeIpInt & maskInt);
      });

      // Ordena decrescente pelo CIDR (A essência do Longest Prefix Match)
      validRoutes.sort((a, b) => b.cidr - a.cidr);
      return validRoutes.length > 0 ? validRoutes[0] : null;
    } catch {
      return null;
    }
  }, [activeIp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSimulate();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-8 animate-in fade-in duration-300">
      
      {/* --- CABEÇALHO PADRONIZADO --- */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Waypoints className="text-emerald-400" />
          Simulador de Roteamento (Layer 3)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Descubra como um roteador decide o caminho exato de um pacote utilizando a regra universal do <strong>Longest Prefix Match</strong>.
        </p>
      </div>

      {/* --- SEÇÃO 1: INPUT DE TESTE (PING/DNS) --- */}
      <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 shadow-inner">
        <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Globe size={18} /> Destino da Requisição
        </h2>
        
        <div className="flex flex-col gap-4">
          <label className="text-xs text-slate-500 uppercase font-bold">Digite um Domínio (ex: netflix.com) ou IP (ex: 10.5.0.10):</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: google.com"
              className="flex-1 bg-slate-950 text-emerald-400 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-lg transition-colors"
            />
            <button 
              onClick={handleSimulate}
              disabled={isResolving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md"
            >
              {isResolving ? 'Consultando DNS...' : 'Traçar Rota'}
            </button>
          </div>

          {resolvedDomain && !isResolving && !errorMsg && (
            <div className="bg-sky-950/30 border border-sky-500/30 text-sky-300 px-4 py-3 rounded-md text-sm font-mono flex items-center gap-2 animate-in slide-in-from-top-2">
              <Globe size={16} className="text-sky-400" /> 
              <span><strong>Resolução DNS:</strong> O domínio <strong>{resolvedDomain}</strong> foi resolvido para o IP público <strong>{activeIp}</strong></span>
            </div>
          )}
          {errorMsg && (
            <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-md text-sm flex items-center gap-2">
              <XCircle size={16} /> {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* --- SEÇÃO 2: TABELA DE ROTEAMENTO --- */}
      <div>
        <h3 className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2"><Map size={16} /> Tabela de Roteamento Ativa</span>
          <span className="text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">Regra: Longest Prefix Match</span>
        </h3>
        
        <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-lg">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Destino / Máscara</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Gateway (Next Hop)</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider">Interface de Saída</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-center">Métrica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950">
              {routingTable.map((route) => {
                const isWinner = matchedRoute?.id === route.id;
                return (
                  <tr 
                    key={route.id} 
                    className={`transition-all duration-300 ${isWinner ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500' : 'hover:bg-slate-900/80 border-l-4 border-l-transparent'}`}
                  >
                    <td className={`p-4 font-mono ${isWinner ? 'text-emerald-400 font-bold' : 'text-sky-400'}`}>
                      {route.destination}/{route.cidr}
                    </td>
                    <td className={`p-4 font-mono ${isWinner ? 'text-slate-200' : 'text-slate-400'}`}>{route.gateway}</td>
                    <td className={`p-4 ${isWinner ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>{route.interface}</td>
                    <td className={`p-4 text-center ${isWinner ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{route.metric}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- DICIONÁRIO DE ROTEAMENTO DIDÁTICO --- */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <h5 className="text-sky-400 font-bold text-xs uppercase mb-1">Gateway (Next Hop)</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
              É o "próximo salto". Se o destino não está na rede local, o pacote é entregue a este roteador vizinho. Se estiver "On-link", significa que o destino está ligado diretamente no mesmo switch físico.
            </p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <h5 className="text-amber-400 font-bold text-xs uppercase mb-1">Métrica (Metric / Custo)</h5>
            <p className="text-slate-400 text-xs leading-relaxed">
               É o "custo" da rota. Se existirem duas rotas para o <strong>mesmo destino</strong> com a <strong>mesma máscara</strong>, a rota com a MENOR métrica ganha (caminho mais rápido/barato).
            </p>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO 3: PAINEL DIDÁTICO (RESULTADO) --- */}
      {matchedRoute ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-6 relative overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} /> Rota Escolhida: {matchedRoute.destination}/{matchedRoute.cidr}
          </h4>
          
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono bg-slate-950 p-4 rounded-md border border-slate-800 w-fit overflow-x-auto max-w-full shadow-inner">
              <span className="text-slate-300 whitespace-nowrap bg-slate-800 px-2 py-1 rounded">Pacote ({activeIp})</span>
              <span className="text-emerald-500">➔</span>
              <span className="text-amber-400 whitespace-nowrap">{matchedRoute.interface}</span>
              <span className="text-emerald-500">➔</span>
              <span className="text-sky-400 whitespace-nowrap font-bold">{matchedRoute.gateway}</span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-4">
              <strong className="text-white block mb-1">Por que esta rota foi escolhida?</strong>
              {matchedRoute.description}
            </p>
          </div>
        </div>
      ) : !errorMsg ? (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-6 text-center animate-in zoom-in-95">
          <span className="text-rose-400 font-bold flex items-center justify-center gap-2">
            <XCircle size={20} /> IP de destino ({activeIp}) inválido. O pacote foi descartado (Drop).
          </span>
        </div>
      ) : null}

    </div>
  );
}