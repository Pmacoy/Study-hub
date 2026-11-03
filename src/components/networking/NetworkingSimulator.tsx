import React, { useState } from 'react';
import type { NetworkingStudyTab } from '../../types/networking';
import IpCalculator from './IpCalculator';
import PacketViewer from './PacketViewer';
import TcpHandshake from './TcpHandshake';
import Module4Addressing from './IpAddressing';
import Module5Application from './Module5Application';
import RoutingSimulator from './RoutingSimulator';
import Module6SecurityDiagnostics from './Module6SecurityDiagnostics';
import BgpVpnSimulator from './BgpVpnSimulator';
import { BookOpen, Layers, Shield, Globe, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  tab: NetworkingStudyTab;
}

export default function NetworkingSimulator({ tab }: Props) {
  const [activeTab, setActiveTab] = useState<NetworkingStudyTab>(tab);

  const tiers = [
    {
      level: 'Nível 1 · Iniciante & Fundamentos',
      desc: 'Compreensão do Modelo OSI, arquitetura de redes e cálculo de sub-redes (CIDR/VLSM).',
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
      items: [
        { id: 'ip-calc' as NetworkingStudyTab, title: 'Endereçamento IP & CIDR', desc: 'CIDR, máscara e divisão de sub-redes', icon: BookOpen },
        { id: 'ip-addressing' as NetworkingStudyTab, title: 'Classes, NAT & IPv6', desc: 'IPs privados, públicos, NAT e transição IPv6', icon: Globe },
      ]
    },
    {
      level: 'Nível 2 · Intermédio · Protocolos',
      desc: 'Anatomia de pacotes, protocolos de transporte (TCP/UDP), handshake e Camada de Aplicação (DNS/HTTP).',
      accent: 'text-sky-400 border-sky-500/30 bg-sky-500/5',
      items: [
        { id: 'transport' as NetworkingStudyTab, title: 'Anatomia de Pacotes & TCP', desc: 'Campos TCP/UDP e 3-Way Handshake', icon: Layers },
        { id: 'application' as NetworkingStudyTab, title: 'Camada de Aplicação & DNS', desc: 'Resolução DNS, registros e verbos HTTP/REST', icon: Globe },
      ]
    },
    {
      level: 'Nível 3 · Avançado · Enterprise & Cloud',
      desc: 'Roteamento L3, segurança de rede, diagnósticos (ARP/TLS/Traceroute) e conectividade híbrida em nuvem (BGP/VPN).',
      accent: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
      items: [
        { id: 'routing' as NetworkingStudyTab, title: 'Roteamento L3 & Tabelas', desc: 'Longest Prefix Match e rotas estáticas/dinâmicas', icon: Layers },
        { id: 'security-net' as NetworkingStudyTab, title: 'Segurança & Diagnóstico', desc: 'ARP spoofing, TLS Handshake e Traceroute TTL', icon: Shield },
        { id: 'bgp-cloud' as NetworkingStudyTab, title: 'BGP & Cloud Hybrid', desc: 'Anúncios BGP, túneis IPsec IKEv2 e DirectConnect', icon: Globe },
      ]
    }
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'ip-calc':
        return <IpCalculator />;
      case 'transport':
        return <TransportModule />;
      case 'ip-addressing':
        return <Module4Addressing />;
      case 'application':
        return <Module5Application />;
      case 'routing':
        return <RoutingSimulator />;
      case 'security-net':
        return <Module6SecurityDiagnostics />;
      case 'bgp-cloud':
        return <BgpVpnSimulator />;
      default:
        return <IpCalculator />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Curriculum Navigator Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Currículo Estruturado · Redes</span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">Trilha de Conhecimento: Iniciante ao Avançado</h3>
            <p className="text-xs text-slate-400 mt-1">Selecione um módulo abaixo para navegar na trilha de estudo interativa.</p>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`border rounded-lg p-4 space-y-3 ${tier.accent}`}>
              <div className="text-xs font-bold uppercase tracking-wider">{tier.level}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{tier.desc}</p>
              <div className="space-y-1.5 pt-2">
                {tier.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded text-left transition-all text-xs font-medium ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-600 shadow-md font-bold'
                          : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <ChevronRight size={14} className={isActive ? 'text-emerald-400' : 'text-slate-600'} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Module Container */}
      <div className="pt-2">
        {renderActiveModule()}
      </div>
    </div>
  );
}

import { useState as useReactState } from 'react';

function TransportModule() {
  const [view, setView] = useReactState<'packets' | 'handshake'>('packets');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setView('packets')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'packets' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300'}`}>
          📦 Anatomia do Pacote
        </button>
        <button onClick={() => setView('handshake')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'handshake' ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300' : 'border border-slate-800 text-slate-400 hover:text-slate-300'}`}>
          🤝 TCP Handshake
        </button>
      </div>
      {view === 'packets' ? <PacketViewer /> : <TcpHandshake />}
    </div>
  );
}
