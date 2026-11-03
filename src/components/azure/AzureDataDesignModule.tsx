import React, { useState } from 'react';
import { Database, Server, HardDrive, Zap, Shield, Play } from 'lucide-react';
import GuidedScenarioPlayer from '../scenarios/GuidedScenarioPlayer';
import { az305DataStorageFocusScenario } from '../../data/scenarios/az305DataStorageFocus';

export default function AzureDataDesignModule() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="absolute inset-0 z-50 bg-[#0f111a]">
        <GuidedScenarioPlayer 
          scenario={az305DataStorageFocusScenario} 
          onExit={() => setPlaying(false)}
          onComplete={() => setPlaying(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Database className="text-sky-400" />
            Design de Soluções de Dados
          </h2>
          <p className="text-sm text-sky-100 max-w-2xl leading-relaxed">
            Em Azure, o armazenamento de dados divide-se entre bases de dados relacionais, NoSQL, data lakes e caches.
            Para o exame AZ-305, precisas de saber escolher a tecnologia certa baseando-te em: formato dos dados (estruturados vs não estruturados), throughput necessário (RU/s), latência, e capacidades de query analítica.
          </p>
        </div>
        <button 
          onClick={() => setPlaying(true)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors"
        >
          <Play size={16} fill="currentColor" />
          Iniciar Case Study
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
            <Server size={18} /> Relacional (SQL)
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Azure SQL Database:</strong> PaaS, gestão delegada, best for modern cloud apps.</li>
            <li><strong className="text-white">SQL Managed Instance:</strong> 100% compatibilidade com on-prem SQL Server (CLR, Service Broker, VNet native).</li>
            <li><strong className="text-white">PostgreSQL/MySQL:</strong> Open-source workloads.</li>
          </ul>
        </div>
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-bold mb-4">
            <Database size={18} /> NoSQL (Cosmos DB)
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Throughput:</strong> Medido em Request Units (RUs). Escala ilimitada.</li>
            <li><strong className="text-white">Global Distribution:</strong> Multi-region writes com 5 níveis de consistência.</li>
            <li><strong className="text-white">Use cases:</strong> IoT telemetry, gaming leaderboards, retail carts.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-4">
            <HardDrive size={18} /> Analytics & Storage
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Data Lake Gen2:</strong> Hierarchical namespace sobre Blob Storage. Essencial para big data.</li>
            <li><strong className="text-white">Synapse Analytics:</strong> Modern Data Warehouse (Serverless ou Dedicated Pool).</li>
            <li><strong className="text-white">Blob Storage:</strong> Archive tier, Immutability policies (WORM).</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold mb-4">
            <Zap size={18} /> Caching & Search
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-white">Redis Cache:</strong> In-memory datastore. Sub-millisecond latency. Session state, pub/sub.</li>
            <li><strong className="text-white">AI Search:</strong> Full-text search engine sobre os dados do Azure com vector search.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
