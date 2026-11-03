import React, { useState } from 'react';
import { Network, Shield, Globe, Cpu, CheckCircle2, RefreshCw, ArrowRight, Server, Lock } from 'lucide-react';

export default function BgpVpnSimulator() {
  const [activeTab, setActiveTab] = useState<'bgp' | 'vpn'>('bgp');

  // BGP simulation state
  const [asnPath, AsnPath] = useState<string[]>(['AS65001 (On-Prem)', 'AS15169 (Google ISP)', 'AS16509 (AWS Backbone)', 'AS64512 (Cloud VPC)']);
  const [metric, setMetric] = useState<number>(20);
  const [routeStatus, setRouteStatus] = useState<'converged' | 'propagating'>('converged');

  const simulateBgpUpdate = () => {
    setRouteStatus('propagating');
    setTimeout(() => {
      setRouteStatus('converged');
    }, 1200);
  };

  // VPN / DirectConnect simulation state
  const [tunnelState, setTunnelState] = useState<'disconnected' | 'ikev2' | 'ipsec' | 'established'>('disconnected');
  const [encryption, setEncryption] = useState<string>('AES-256 / SHA-256');

  const startVpnHandshake = () => {
    setTunnelState('ikev2');
    setTimeout(() => {
      setTunnelState('ipsec');
      setTimeout(() => {
        setTunnelState('established');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-[#181926] text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe className="text-cyan-400" />
          Módulo Avançado: BGP & Cloud Hybrid Networking (VPN / DirectConnect)
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore o protocolo que governa a Internet (BGP) e como túneis IPsec/DirectConnect conectam data centers corporativos à nuvem com alta resiliência.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 w-full max-w-md">
        <button
          onClick={() => setActiveTab('bgp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'bgp' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Network size={16} /> BGP Routing
        </button>
        <button
          onClick={() => setActiveTab('vpn')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'vpn' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Shield size={16} /> Cloud VPN & IPsec
        </button>
      </div>

      {/* BGP Section */}
      {activeTab === 'bgp' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="text-cyan-400" size={18} /> Propagação de Rotas BGP (Autonomous System Number - ASN)
              </h3>
              <button
                onClick={simulateBgpUpdate}
                disabled={routeStatus === 'propagating'}
                className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 px-3 py-1.5 rounded text-xs font-semibold transition-all"
              >
                <RefreshCw size={14} className={routeStatus === 'propagating' ? 'animate-spin' : ''} />
                Simular Anúncio BGP
              </button>
            </div>

            <p className="text-sm text-slate-300">
              O BGP (Border Gateway Protocol) troca informações de alcance entre Sistemas Autónomos (AS). Quando anuncias uma rota na nuvem, ela propaga-se globalmente pelo AS-PATH.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {asnPath.map((as, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded border border-slate-800 relative">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-1">Hop #{idx + 1}</div>
                  <div className="text-sm font-semibold text-white">{as}</div>
                  {idx < asnPath.length - 1 && (
                    <ArrowRight size={16} className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600 z-10" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
              <div>Status: <span className={routeStatus === 'converged' ? 'text-emerald-400' : 'text-amber-400'}>{routeStatus === 'converged' ? '🟢 BGP Converged (Stable)' : '🟡 Propagating Route Updates...'}</span></div>
              <div>Atributo AS-PATH Length: {asnPath.length} ASNs</div>
            </div>
          </div>
        </div>
      )}

      {/* VPN & IPsec Section */}
      {activeTab === 'vpn' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="text-emerald-400" size={18} /> Túnel VPN IPsec (IKEv2 / Encrypted Hybrid Cloud)
              </h3>
              <button
                onClick={startVpnHandshake}
                disabled={tunnelState !== 'disconnected' && tunnelState !== 'established'}
                className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded text-xs font-semibold transition-all"
              >
                <RefreshCw size={14} className={tunnelState !== 'disconnected' && tunnelState !== 'established' ? 'animate-spin' : ''} />
                Estabelecer Túnel VPN
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="bg-slate-950 p-4 rounded border border-slate-800 text-center space-y-2">
                <Server className="mx-auto text-sky-400" size={24} />
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">On-Premises Gateway</div>
                <div className="text-sm font-mono text-white">192.168.100.1</div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-xs font-mono text-emerald-400">
                  {tunnelState === 'disconnected' && '❌ Tunnel Down'}
                  {tunnelState === 'ikev2' && '🔄 Phase 1: IKEv2 SA'}
                  {tunnelState === 'ipsec' && '🔄 Phase 2: IPsec SA'}
                  {tunnelState === 'established' && '🟢 Encrypted IPSec Tunnel'}
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      tunnelState === 'established' ? 'w-full bg-emerald-500' :
                      tunnelState === 'ipsec' ? 'w-2/3 bg-amber-500' :
                      tunnelState === 'ikev2' ? 'w-1/3 bg-sky-500' : 'w-0'
                    }`}
                  />
                </div>
                <div className="text-2xs font-mono text-slate-500">Criptografia: {encryption}</div>
              </div>

              <div className="bg-slate-950 p-4 rounded border border-slate-800 text-center space-y-2">
                <Cloud className="mx-auto text-purple-400" size={24} />
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Cloud VPN Gateway</div>
                <div className="text-sm font-mono text-white">AWS / Azure VNet</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Cloud(props: any) {
  return <Server {...props} />;
}
