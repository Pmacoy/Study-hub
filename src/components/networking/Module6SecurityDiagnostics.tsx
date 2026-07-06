
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Search, Network, Key, FileBadge, 
  MapPin, Activity, ArrowRightLeft, Laptop, Router 
} from 'lucide-react';

type TabType = 'arp' | 'tls' | 'traceroute';

export default function Module6SecurityDiagnostics() {
  const [activeTab, setActiveTab] = useState<TabType>('arp');

  // --- ESTADOS: ARP ---
  const [arpStatus, setArpStatus] = useState<'idle' | 'broadcasting' | 'resolved'>('idle');

  const triggerArp = () => {
    setArpStatus('broadcasting');
    setTimeout(() => setArpStatus('resolved'), 2000);
  };

  const resetArp = () => setArpStatus('idle');

  // --- ESTADOS: TLS HANDSHAKE ---
  const [tlsStep, setTlsStep] = useState(0);
  const tlsSteps = [
    { id: 0, title: "1. Client Hello", desc: "O Cliente diz: 'Olá, quero ligar-me de forma segura. Aqui estão as versões de TLS e as cifras de criptografia que eu suporto.'", icon: <ArrowRightLeft className="text-sky-400" /> },
    { id: 1, title: "2. Server Hello & Certificate", desc: "O Servidor responde: 'Olá! Vamos usar TLS 1.3. Aqui está o meu Certificado Digital (a minha identidade) e a minha Chave Pública.'", icon: <FileBadge className="text-amber-400" /> },
    { id: 2, title: "3. Key Exchange", desc: "O Cliente valida o certificado. Depois, usa a Chave Pública do servidor para encriptar um 'Segredo Partilhado' e envia-o de volta.", icon: <Key className="text-purple-400" /> },
    { id: 3, title: "4. Secure Tunnel (Symmetric)", desc: "Ambos usam o Segredo Partilhado para gerar a mesma Chave Simétrica. A partir de agora, todo o tráfego de dados é ilegível para hackers!", icon: <Lock className="text-emerald-400" /> },
  ];

  // --- ESTADOS: TRACEROUTE ---
  const [hops, setHops] = useState<any[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  const startTrace = () => {
    setHops([]);
    setIsTracing(true);
    const simulatedHops = [
      { ttl: 1, ip: '192.168.1.1', location: 'O Seu Roteador (Gateway)', time: '1ms' },
      { ttl: 2, ip: '10.20.30.1', location: 'Provedor de Internet (ISP)', time: '12ms' },
      { ttl: 3, ip: '198.51.100.4', location: 'Backbone Internacional', time: '45ms' },
      { ttl: 4, ip: '203.0.113.88', location: 'Data Center da AWS', time: '110ms' },
      { ttl: 5, ip: '186.192.90.5', location: 'Servidor Final (Destino)', time: '112ms', final: true },
    ];

    simulatedHops.forEach((hop, index) => {
      setTimeout(() => {
        setHops(prev => [...prev, hop]);
        if (hop.final) setIsTracing(false);
      }, (index + 1) * 1000);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-6">
      
      {/* CABEÇALHO */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-rose-400" />
          Módulo 6: Segurança e Diagnóstico
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore as camadas ocultas da rede: como os endereços físicos são descobertos, como a criptografia funciona e como caçamos falhas.
        </p>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 w-full max-w-2xl">
        <button
          onClick={() => setActiveTab('arp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'arp' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Network size={16} /> ARP (Camada 2)
        </button>
        <button
          onClick={() => setActiveTab('tls')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'tls' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Lock size={16} /> TLS/SSL (HTTPS)
        </button>
        <button
          onClick={() => setActiveTab('traceroute')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeTab === 'traceroute' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <MapPin size={16} /> Traceroute (TTL)
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[450px]">
        
        {/* === ABA 1: ARP (Address Resolution Protocol) === */}
        {activeTab === 'arp' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">O Elo Perdido: IP vs MAC Address</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                O Roteador sabe que o pacote vai para o IP <code>192.168.1.50</code>, mas o <strong>Switch</strong> (Camada 2) só entende Endereços MAC físicos. O protocolo ARP soluciona isto "gritando" para toda a rede (Broadcast) perguntando quem tem aquele IP.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={triggerArp}
                  disabled={arpStatus !== 'idle'}
                  className="bg-amber-600/20 border border-amber-500/50 hover:bg-amber-600/40 text-amber-400 font-bold px-6 py-2 rounded-md transition-all disabled:opacity-30"
                >
                  Enviar "ARP Request"
                </button>
                {arpStatus === 'resolved' && (
                  <button onClick={resetArp} className="px-4 py-2 border border-slate-700 text-slate-300 rounded hover:bg-slate-800">Reset</button>
                )}
              </div>
            </div>

            {/* Simulador Visual ARP */}
            <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 relative flex justify-around items-end min-h-[250px] overflow-hidden">
              {/* Roteador a fazer a pergunta */}
              <div className="flex flex-col items-center z-10">
                <Router size={48} className="text-slate-300 mb-2" />
                <span className="font-bold text-xs">Gateway</span>
                {arpStatus === 'broadcasting' && (
                  <div className="absolute top-10 left-10 bg-amber-500/20 border border-amber-500 p-2 rounded-lg text-amber-400 text-xs font-mono animate-bounce">
                    "Quem tem 192.168.1.50? Diga ao 192.168.1.1"
                  </div>
                )}
              </div>

              {/* Ondas de Broadcast */}
              {arpStatus === 'broadcasting' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full flex justify-center">
                   <div className="w-96 h-96 border-4 border-amber-500/30 rounded-full animate-ping opacity-20"></div>
                </div>
              )}

              {/* Dispositivos na Rede */}
              <div className="flex gap-8 z-10">
                {/* PC 1 - Ignora */}
                <div className="flex flex-col items-center opacity-70">
                  <Laptop size={40} className="text-slate-500 mb-2" />
                  <span className="text-[10px] font-mono">192.168.1.10</span>
                  {arpStatus === 'broadcasting' && <span className="text-xs text-slate-500 mt-2 animate-in fade-in">(Ignora)</span>}
                </div>
                
                {/* PC 2 - O ALVO */}
                <div className="flex flex-col items-center relative">
                  <Laptop size={40} className={arpStatus === 'resolved' ? 'text-emerald-400' : 'text-sky-400 mb-2'} />
                  <span className="text-[10px] font-mono text-white bg-slate-800 px-2 py-1 mt-2 rounded">192.168.1.50</span>
                  <span className={`text-[10px] font-mono mt-1 ${arpStatus === 'resolved' ? 'text-emerald-400 font-bold' : 'text-slate-600'}`}>
                    MAC: AA:BB:CC:11:22
                  </span>
                  
                  {arpStatus === 'resolved' && (
                    <div className="absolute bottom-full mb-4 -ml-20 w-48 bg-emerald-500/20 border border-emerald-500 p-2 rounded-lg text-emerald-400 text-xs font-mono animate-in slide-in-from-right">
                      "Sou eu! O meu MAC é AA:BB:CC:11:22"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === ABA 2: TLS/SSL HANDSHAKE === */}
        {activeTab === 'tls' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">A Magia da Criptografia (HTTPS)</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Como enviamos uma senha de forma segura se a internet é pública? O <strong>TLS (Transport Layer Security)</strong> usa Criptografia Assimétrica (Chave Pública/Privada) apenas para o aperto de mãos. Depois de combinarem um segredo, usam Criptografia Simétrica (muito mais rápida) para transferir os dados.
              </p>
              
              <div className="flex gap-2">
                <button onClick={() => setTlsStep(Math.max(0, tlsStep - 1))} disabled={tlsStep === 0} className="px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 disabled:opacity-30">Anterior</button>
                <button onClick={() => setTlsStep(Math.min(3, tlsStep + 1))} disabled={tlsStep === 3} className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 rounded font-bold hover:bg-emerald-600/40 disabled:opacity-30 flex-1">Avançar Passo</button>
                <button onClick={() => setTlsStep(0)} className="px-4 py-2 border border-slate-700 rounded hover:bg-slate-800">Reset</button>
              </div>
            </div>

            <div className="flex-[1.5] space-y-4 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-800"></div>
              {tlsSteps.map((step, idx) => (
                <div key={idx} className={`relative z-10 flex gap-4 items-start bg-slate-950 p-4 rounded-lg border transition-all duration-500 ${tlsStep >= idx ? 'border-slate-700 opacity-100' : 'border-transparent opacity-30'}`}>
                  <div className={`p-2 rounded-full ${tlsStep >= idx ? 'bg-slate-900 shadow-lg ring-1 ring-slate-700' : 'bg-transparent'}`}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className={`font-bold ${tlsStep >= idx ? 'text-slate-200' : 'text-slate-500'}`}>{step.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === ABA 3: TRACEROUTE E TTL === */}
        {activeTab === 'traceroute' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">Caça aos Gargalos (Traceroute)</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Para evitar que pacotes fiquem num *loop infinito* na internet, eles possuem um <strong>TTL (Time to Live)</strong>. O Traceroute é uma ferramenta engenhosa que envia pacotes intencionalmente com TTL=1, depois TTL=2, forçando cada roteador no caminho a devolver um erro de "Tempo Excedido", revelando assim a sua morada.
              </p>
              <button 
                onClick={startTrace}
                disabled={isTracing}
                className="w-full bg-rose-600/20 border border-rose-500/50 hover:bg-rose-600/40 text-rose-400 font-bold px-6 py-3 rounded-md transition-all disabled:opacity-30 flex justify-center items-center gap-2"
              >
                {isTracing ? 'Mapeando Rota...' : 'Executar Traceroute para a AWS'} <Search size={18} />
              </button>
            </div>

            <div className="flex-[1.5] bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm overflow-hidden">
              <div className="text-slate-500 mb-4 border-b border-slate-800 pb-2">
                traceroute to aws.amazon.com (186.192.90.5), 30 hops max
              </div>
              <div className="space-y-2">
                {hops.map((hop, i) => (
                  <div key={i} className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in duration-300">
                    <span className="w-8 text-right text-rose-400 font-bold">{hop.ttl}</span>
                    <span className="w-16 text-slate-500">{hop.time}</span>
                    <span className="text-sky-400">{hop.ip}</span>
                    <span className="text-slate-400 hidden sm:inline">({hop.location})</span>
                  </div>
                ))}
                {isTracing && (
                  <div className="flex items-center gap-4 text-slate-600 animate-pulse">
                    <span className="w-8 text-right">{hops.length + 1}</span>
                    <span>* * *</span>
                    <span>Aguardando resposta...</span>
                  </div>
                )}
                {hops.length > 0 && hops[hops.length - 1].final && (
                  <div className="mt-4 text-emerald-400 font-bold">
                    Trace complete.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}