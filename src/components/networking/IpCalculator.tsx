
import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import SubnetTree from './SubnetTree'; // Importa a sua árvore que já está perfeita

// --- HELPER LOCAL DE MATEMÁTICA DE IP ---
function ipToInt(ip: string): number {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

function getSubnetDetails(ip: string, cidr: number) {
  try {
    const ipInt = ipToInt(ip);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | ~maskInt) >>> 0;
    const hosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;

    return {
      networkIp: intToIp(networkInt),
      broadcastIp: intToIp(broadcastInt),
      mask: intToIp(maskInt),
      firstHost: cidr >= 31 ? '-' : intToIp(networkInt + 1),
      lastHost: cidr >= 31 ? '-' : intToIp(broadcastInt - 1),
      hosts
    };
  } catch (error) {
    return null;
  }
}

// --- SUB-COMPONENTE: CAIXA DE RESULTADO COM TOOLTIP ---
function ResultBox({ label, value, color, helpText }: { label: string, value: string, color: string, helpText?: string }) {
  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 relative group transition-colors hover:border-slate-700">
      <div className="text-xs text-slate-500 uppercase font-bold flex justify-between items-center mb-1">
        {label}
        {helpText && <span className="cursor-help text-sky-400 text-sm">ⓘ</span>}
      </div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
      
      {helpText && (
        <div className="absolute bottom-full left-0 mb-2 w-56 p-3 bg-slate-800 text-slate-200 text-xs rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 whitespace-pre-line leading-relaxed pointer-events-none">
          {helpText}
          <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ALINHADO ---
export default function IpCalculator() {
  const [ip, setIp] = useState('10.0.0.0');
  const [cidr, setCidr] = useState(24);

  const details = useMemo(() => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) return null;
    return getSubnetDetails(ip, cidr);
  }, [ip, cidr]);

  const quickCidrs = [8, 16, 24, 25, 27, 30, 32];
  const networkIpInt = details ? ipToInt(details.networkIp) : 0;

  const renderBinaryMask = (currentCidr: number) => {
    const bits = [];
    for (let i = 0; i < 32; i++) {
      const isNetBit = i < currentCidr;
      bits.push(
        <span key={i} className={isNetBit ? "text-emerald-400" : "text-slate-600"}>
          {isNetBit ? '1' : '0'}
        </span>
      );
      if ((i + 1) % 8 === 0 && i !== 31) {
        bits.push(<span key={`dot-${i}`} className="text-slate-500 font-bold mx-1">.</span>);
      }
    }
    return bits;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-8 animate-in fade-in duration-300">
      
      {/* --- CABEÇALHO ALINHADO COM O RESTO DO APP --- */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="text-emerald-400" />
          Módulo 1: Calculadora de IP e Sub-redes
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Insira um IP e o prefixo CIDR para calcular os blocos, broadcast e entender a matemática binária por trás das redes.
        </p>
      </div>

      {/* --- INPUTS --- */}
      <div className="flex flex-wrap gap-6 items-end bg-slate-900/30 p-5 rounded-lg border border-slate-800/50">
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Endereço IP</label>
          <input 
            type="text" 
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="bg-slate-950 text-emerald-400 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition-all"
            placeholder="Ex: 192.168.1.0"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-[300px]">
          <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Prefixo CIDR (/{cidr})</label>
          <div className="flex items-center gap-4 bg-slate-950 border border-slate-700 p-2 rounded-md">
            <input 
              type="range" min="0" max="32" 
              value={cidr} onChange={(e) => setCidr(Number(e.target.value))}
              className="accent-emerald-500 flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <input 
              type="number" min="0" max="32"
              value={cidr} onChange={(e) => setCidr(Number(e.target.value))}
              className="bg-transparent text-emerald-400 w-12 text-center font-mono font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* --- QUICK CIDR BUTTONS --- */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-slate-500 uppercase font-bold mr-2">Comuns:</span>
        {quickCidrs.map(c => (
          <button 
            key={c} onClick={() => setCidr(c)}
            className={`px-4 py-1.5 text-sm rounded-md border font-mono transition-all ${
              cidr === c 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            /{c}
          </button>
        ))}
      </div>

      {/* --- GRID DE RESULTADOS COM EXPLICAÇÕES DIDÁTICAS --- */}
      {!details ? (
        <div className="p-8 text-center border border-dashed border-slate-800 rounded-lg text-slate-500">
          Endereço IP inválido. Por favor, insira um formato IPv4 válido.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultBox 
              label="Endereço de Rede" 
              value={details.networkIp} 
              color="text-emerald-400" 
              helpText="O primeiro IP do bloco. É a 'identidade' da rede nos routers. Nunca pode ser atribuído a um host."
            />
            <ResultBox 
              label="Broadcast" 
              value={details.broadcastIp} 
              color="text-amber-400" 
              helpText="O último IP do bloco. Usado para enviar uma mensagem para TODOS os computadores da rede em simultâneo."
            />
            <ResultBox 
              label="Máscara de Sub-rede" 
              value={details.mask} 
              color="text-purple-400" 
              helpText={`Representação do /${cidr}. Serve para o computador saber onde acaba a rede e onde começam os hosts.`}
            />
            <ResultBox 
              label="Hosts Úteis" 
              value={details.hosts.toLocaleString('pt-PT')} 
              color="text-white" 
              helpText={`Fórmula: 2^(32 - ${cidr}) - 2.\nO "-2" existe precisamente para descontar o IP de Rede e o IP de Broadcast!`}
            />
            <ResultBox label="Primeiro Host" value={details.firstHost} color="text-sky-400" />
            <ResultBox label="Último Host" value={details.lastHost} color="text-rose-400" />
          </div>

          {/* RANGE VISUAL */}
          <div className="bg-slate-900/30 p-5 rounded-lg border border-slate-800/50 mt-6">
            <div className="text-xs text-slate-500 uppercase font-bold mb-3">Espectro / Range da sub-rede:</div>
            <div className="flex h-10 rounded-md overflow-hidden text-xs font-bold text-center leading-10 border border-slate-800 relative group cursor-help">
              <div className="bg-emerald-950/80 text-emerald-500 w-[15%] sm:w-[12%] border-r border-slate-900">REDE</div>
              <div className="bg-slate-800/50 text-slate-300 flex-1 hover:bg-slate-800 transition-colors">{details.hosts.toLocaleString('pt-PT')} HOSTS ÚTEIS</div>
              <div className="bg-amber-950/80 text-amber-500 w-[15%] sm:w-[12%] border-l border-slate-900">BC</div>
              
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-800 text-slate-200 text-xs rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left">
                Os IPs nas pontas (Rede e Broadcast) são reservados pelo protocolo. Apenas a zona central contém IPs "Úteis" que podem ser atribuídos a computadores.
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-2 px-1 font-mono">
              <span>{details.networkIp}</span>
              <span>{details.broadcastIp}</span>
            </div>
          </div>

          {/* BINÁRIO */}
          <div className="mt-6">
            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Máscara em binário (32 bits):</div>
            <div className="bg-slate-900 p-4 rounded-md border border-slate-800 text-base sm:text-xl tracking-[0.15em] sm:tracking-[0.2em] break-all font-mono group cursor-help relative shadow-inner text-center">
              {renderBinaryMask(cidr)}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-slate-200 text-xs rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none leading-relaxed text-left">
                <span className="text-emerald-400 font-bold">Bits 1 (Verdes):</span> Bloqueados para a Rede. <br/>
                <span className="text-slate-400 font-bold">Bits 0 (Cinzentos):</span> Livres para atribuir aos Hosts.
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800" />
              </div>
            </div>
          </div>

          {/* CHAMA A ÁRVORE DE SUB-REDES */}
          <SubnetTree baseIpInt={networkIpInt} baseCidr={cidr} />
        </>
      )}
    </div>
  );
}