
import React, { useState, useEffect } from 'react';
import { 
  Network, Router, Globe, Laptop, ShieldAlert, 
  Zap, Ghost, Search, BookOpen, ArrowRightLeft 
} from 'lucide-react';

// --- TIPAGENS ---
type TabType = 'diagnostico' | 'nat' | 'ipv6';

type IpClassInfo = { className: string; range: string; defaultMask: string; use: string };

const classReference: IpClassInfo[] = [
  { className: 'Classe A', range: '1.0.0.0 a 126.255.255.255', defaultMask: '255.0.0.0 (/8)', use: 'Redes Gigantes' },
  { className: 'Classe B', range: '128.0.0.0 a 191.255.255.255', defaultMask: '255.255.0.0 (/16)', use: 'Redes Médias/Grandes' },
  { className: 'Classe C', range: '192.0.0.0 a 223.255.255.255', defaultMask: '255.255.255.0 (/24)', use: 'Redes Pequenas (Residenciais)' },
  { className: 'Classe D', range: '224.0.0.0 a 239.255.255.255', defaultMask: 'N/A', use: 'Multicast (Streaming, Roteamento)' },
  { className: 'Classe E', range: '240.0.0.0 a 255.255.255.255', defaultMask: 'N/A', use: 'Experimental / Pesquisa' },
];

export default function Module4Addressing() {
  const [activeTab, setActiveTab] = useState<TabType>('diagnostico');
  
  // Estados partilhados
  const [testIp, setTestIp] = useState('192.168.1.10');
  const [isSimulating, setIsSimulating] = useState(false);

  // ==========================================
  // LÓGICA DA ABA 1: DIAGNÓSTICO (O Seu Código)
  // ==========================================
  const analyzeIp = (ipStr: string) => {
    const octets = ipStr.split('.').map(Number);
    if (octets.length !== 4 || octets.some(isNaN) || octets.some(o => o < 0 || o > 255)) {
      return { valid: false, message: "IP Inválido. Digite 4 octetos entre 0 e 255." };
    }

    const first = octets[0];
    const second = octets[1];

    let ipClass = "Desconhecida";
    let mask = "N/A";
    
    if (first >= 1 && first <= 126) { ipClass = "Classe A"; mask = "255.0.0.0"; }
    else if (first >= 128 && first <= 191) { ipClass = "Classe B"; mask = "255.255.0.0"; }
    else if (first >= 192 && first <= 223) { ipClass = "Classe C"; mask = "255.255.255.0"; }
    else if (first >= 224 && first <= 239) { ipClass = "Classe D (Multicast)"; mask = "N/A"; }
    else if (first >= 240 && first <= 255) { ipClass = "Classe E (Experimental)"; mask = "N/A"; }

    let category = "IP Público (Roteável)";
    let color = "text-sky-400";
    let type = "public";
    let description = "Endereço válido na internet global. Qualquer dispositivo conectado à rede pública pode tentar se comunicar com ele.";

    if (first === 10 || (first === 172 && second >= 16 && second <= 31) || (first === 192 && second === 168)) {
      category = "IP Privado (LAN)";
      color = "text-emerald-400";
      type = "private";
      description = "Reservado para uso interno em redes locais (RFC 1918). Não funciona diretamente na internet sem passar por um roteador com NAT (Network Address Translation).";
    } else if (first === 127) {
      category = "Loopback (Localhost)";
      color = "text-amber-400";
      type = "loopback";
      description = "O dispositivo está 'falando com ele mesmo'. Muito usado por desenvolvedores para testar serviços locais (como bancos de dados) sem precisar de rede.";
    } else if (first === 169 && second === 254) {
      category = "APIPA (Falha de DHCP)";
      color = "text-rose-400";
      type = "apipa";
      description = "Automatic Private IP Addressing: O sistema operacional atribui este IP quando o PC pede um IP na rede, mas o servidor DHCP/Roteador está fora do ar.";
    } else if (first === 0 || first === 255) {
      category = "Reservado / Broadcast";
      color = "text-slate-400";
      type = "special";
      description = "Endereços especiais. 0.0.0.0 indica 'qualquer IP' (rota padrão), e 255.255.255.255 é usado para 'gritar' para todos na mesma rede local.";
    }

    return { valid: true, ipClass, mask, category, color, description, type };
  };

  const analysis = analyzeIp(testIp);

  // Lógica da Aba 2 (NAT)
  const triggerSimulation = () => {
    if (analysis.valid) {
      setIsSimulating(true);
      setTimeout(() => setIsSimulating(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-6">
      
      {/* CABEÇALHO */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Network className="text-indigo-400" />
          Módulo 4: Endereçamento, NAT e IPv6
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Da teoria das Classes de IP até a prática de roteamento e o futuro da internet.
        </p>
      </div>

      {/* TABS (ABAS) */}
      <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 w-full">
        <button
          onClick={() => setActiveTab('diagnostico')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'diagnostico' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Search size={16} /> <span className="hidden sm:inline">Diagnóstico & Classes</span>
        </button>
        <button
          onClick={() => setActiveTab('nat')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'nat' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <ArrowRightLeft size={16} /> <span className="hidden sm:inline">Simulador NAT</span>
        </button>
        <button
          onClick={() => setActiveTab('ipv6')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'ipv6' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Ghost size={16} /> <span className="hidden sm:inline">O Fantasma do IPv6</span>
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
        
        {/* === ABA 1: DIAGNÓSTICO (Seu Código Polido) === */}
        {activeTab === 'diagnostico' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 shadow-inner">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col gap-2 w-full md:w-1/3">
                  <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Digite um IP para analisar</label>
                  <input 
                    type="text" 
                    value={testIp}
                    onChange={(e) => setTestIp(e.target.value)}
                    placeholder="Ex: 172.16.0.5"
                    className="bg-slate-950 text-indigo-400 border border-slate-700 p-3 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-lg transition-all"
                  />
                </div>

                <div className="w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {analysis.valid ? (
                    <>
                      <div className="bg-slate-950 p-4 rounded border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Classe</div>
                        <div className="font-bold text-lg text-slate-200">{analysis.ipClass}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded border border-slate-800 shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Máscara Padrão</div>
                        <div className="font-bold text-slate-300 font-mono text-sm sm:text-base mt-1.5">{analysis.mask}</div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded border border-slate-800 shadow-sm col-span-2 md:col-span-1">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Categoria</div>
                        <div className={`font-bold text-sm sm:text-base mt-1.5 ${analysis.color}`}>{analysis.category}</div>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-full bg-rose-950/20 border border-rose-500/50 p-4 rounded text-rose-400 text-sm flex items-center justify-center font-bold">
                      {analysis.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Painel Didático */}
              {analysis.valid && (
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-md mt-6 flex items-start gap-4">
                  <div className={`p-2 rounded bg-slate-900 ${analysis.color}`}>
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span className={`font-bold text-sm uppercase ${analysis.color}`}>{analysis.category}: </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{analysis.description}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Cheat Sheet */}
            <div>
              <h3 className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                <Network size={14} /> Cheat Sheet: Classes de IP (Arquitetura Classful)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-900 text-slate-400">
                    <tr>
                      <th className="p-3 font-bold text-xs uppercase tracking-wider">Classe</th>
                      <th className="p-3 font-bold text-xs uppercase tracking-wider">Range (1º Octeto)</th>
                      <th className="p-3 font-bold text-xs uppercase tracking-wider">Máscara Padrão</th>
                      <th className="p-3 font-bold text-xs uppercase tracking-wider">Uso Principal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {classReference.map((ref, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-bold text-slate-300">{ref.className}</td>
                        <td className="p-3 font-mono text-indigo-400 text-xs">{ref.range}</td>
                        <td className="p-3 font-mono text-emerald-400 text-xs">{ref.defaultMask}</td>
                        <td className="p-3 text-slate-400 text-xs">{ref.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === ABA 2: SIMULADOR NAT === */}
        {activeTab === 'nat' && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">Por que o NAT existe?</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                IPs da Categoria <strong className="text-emerald-400">Privada</strong> (como {testIp}) não existem na Internet. 
                O seu Roteador precisa usar o NAT (Network Address Translation) para trocar o seu IP Privado por um IP Público na hora de enviar dados para a web.
              </p>
              
              <button 
                onClick={triggerSimulation}
                disabled={isSimulating || !analysis.valid}
                className="w-full bg-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-600/40 text-emerald-400 font-bold px-6 py-3 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSimulating ? 'Simulando Tráfego...' : 'Testar Rota de Tráfego'} <ArrowRightLeft size={18} />
              </button>

              {analysis.valid && analysis.type !== 'private' && !isSimulating && (
                <div className="mt-4 text-xs text-amber-400 bg-amber-950/20 p-3 rounded border border-amber-900/50">
                  <ShieldAlert className="inline mr-1" size={14}/> 
                  Nota: Como este IP <strong>não é Privado</strong>, o NAT não precisará "mascarar" o endereço (ou a simulação falhará dependendo da rota). Teste com um IP como 192.168.1.10.
                </div>
              )}
            </div>

            <div className="flex-[1.5] bg-slate-950 p-6 rounded-lg border border-slate-800 flex flex-col justify-center relative overflow-hidden min-h-[250px]">
              <div className="flex items-center justify-between relative px-2 sm:px-8">
                
                {/* Computador Local */}
                <div className="flex flex-col items-center z-10">
                  <Laptop size={40} className={analysis.type === 'private' ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="text-xs font-mono mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                    {analysis.valid ? testIp : '???'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Sua Máquina</span>
                </div>

                {/* O Roteador / NAT */}
                <div className="flex flex-col items-center z-10 relative">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 relative z-10 shadow-lg">
                    <Router size={28} className="text-slate-300" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Roteador (NAT)</span>
                </div>

                {/* A Internet */}
                <div className="flex flex-col items-center z-10">
                  <Globe size={40} className="text-sky-400" />
                  <span className="text-xs font-mono mt-2 bg-slate-900 px-2 py-1 rounded border border-slate-700 text-sky-400">
                    {analysis.type === 'private' ? '203.0.113.45' : (analysis.valid ? testIp : '---')}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold">Internet Pública</span>
                </div>

                {/* Animação do Pacote */}
                {isSimulating && (
                  <div className="absolute left-12 sm:left-20 top-[15px] flex items-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full z-20 animate-move-packet relative">
                      {analysis.type === 'private' && (
                        <span className="absolute -top-6 -left-8 text-[10px] text-emerald-400 font-mono w-24 text-center animate-text-change">
                          {testIp}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === ABA 3: IPv6 === */}
        {activeTab === 'ipv6' && (
          <div className="bg-sky-950/20 border border-sky-500/30 rounded-lg p-6 relative overflow-hidden group min-h-[300px] flex items-center">
            <Ghost className="absolute -right-4 -bottom-4 text-sky-500/10 w-64 h-64 transform -rotate-12 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-sky-400 flex items-center gap-2 mb-4">
                <Zap size={24} /> O Fantasma do IPv6 (O Padrão de 2026)
              </h3>
              <p className="text-base text-slate-300 leading-relaxed mb-6 max-w-3xl">
                A divisão em <strong>Classes (A, B, C)</strong> falhou em prever o tamanho da internet. O <strong>NAT</strong> foi um "band-aid" brilhante criado nos anos 90 porque os 4.3 bilhões de endereços IPv4 acabaram. 
                Porém, com a explosão da IoT (Internet das Coisas) e Cloud Computing, o NAT adiciona overhead desnecessário nos roteadores.
              </p>
              <div className="bg-slate-950 p-5 rounded-lg border border-sky-900/50 inline-block shadow-lg">
                <span className="text-xs text-slate-500 uppercase font-bold block mb-2">Exemplo de IPv6 (Sem necessidade de NAT)</span>
                <span className="font-mono text-sky-300 font-bold tracking-wider text-sm sm:text-lg">
                  2001:0db8:85a3:0000:0000:8a2e:0370:7334
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-6 max-w-3xl leading-relaxed">
                O IPv6 possui 340 undecilhões de IPs — o suficiente para dar um endereço público a cada grão de areia da Terra. Em arquiteturas modernas em Nuvem (AWS/GCP), já operamos em modo *Dual-Stack* ou *IPv6-Only* por padrão, eliminando a dor de cabeça de configurar sub-redes NAT Complexas.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Estilos de Animação embutidos */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes move-packet {
          0% { transform: translateX(0); background-color: #34d399; }
          45% { transform: translateX(calc(50cqw - 20px)); background-color: #34d399; }
          55% { transform: translateX(calc(50cqw + 20px)); background-color: #38bdf8; }
          100% { transform: translateX(calc(100cqw - 40px)); background-color: #38bdf8; opacity: 0; }
        }
        @keyframes text-change {
          0%, 45% { content: "${testIp}"; color: #34d399; }
          55%, 100% { color: #38bdf8; }
        }
        .animate-move-packet {
          container-type: inline-size;
          animation: move-packet 3s ease-in-out forwards;
        }
        .animate-text-change {
          animation: text-change 3s ease-in-out forwards;
        }
      `}} />
    </div>
  );
}