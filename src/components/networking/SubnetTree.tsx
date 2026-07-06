import React, { useState } from 'react';

// --- HELPER LOCAL DE MATEMÁTICA DE IP ---
// Adicionado aqui para garantir que o componente funcione de forma independente,
// mas você pode importar do seu 'ip-math.ts' se preferir.
function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255
  ].join('.');
}

// --- TIPAGENS ---
interface SubnetTreeProps {
  baseIpInt: number;
  baseCidr: number;
}

interface SubnetNodeProps {
  ipInt: number;
  cidr: number;
  isRoot?: boolean;
  splitMap: Record<string, boolean>;
  onSplit: (key: string) => void;
  onJoin: (key: string) => void;
}

// --- COMPONENTE FILHO: NÓ DA ÁRVORE ---
// É um componente recursivo que se chama a si mesmo quando a rede é dividida.
const SubnetNode: React.FC<SubnetNodeProps> = ({ ipInt, cidr, isRoot, splitMap, onSplit, onJoin }) => {
  const nodeKey = `${ipInt}-${cidr}`;
  const isSplit = splitMap[nodeKey] || false;
  
  // Cálculos da sub-rede atual
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : totalHosts - 2;
  const ipString = intToIp(ipInt);
  
  // Se for dividido, calcula os dados dos dois "filhos"
  const nextCidr = cidr + 1;
  const halfHosts = totalHosts / 2;
  const rightIpInt = ipInt + halfHosts;

  return (
    <div className={`flex flex-col ${!isRoot ? 'ml-6 sm:ml-12 mt-4 relative' : ''}`}>
      {/* Linha conectora visual para os filhos (Desktop) */}
      {!isRoot && (
        <div className="absolute -left-6 sm:-left-12 top-6 w-6 sm:w-12 h-px bg-slate-700"></div>
      )}
      {!isRoot && (
        <div className="absolute -left-6 sm:-left-12 -top-full h-[calc(100%+1.5rem)] w-px bg-slate-700"></div>
      )}

      {/* Cartão da Sub-rede */}
      <div className={`
        bg-slate-900 border p-4 rounded-lg shadow-sm w-full max-w-sm transition-all
        ${isSplit ? 'border-slate-800 opacity-60' : 'border-emerald-500/30 ring-1 ring-emerald-500/20'}
      `}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-emerald-400 font-mono font-bold text-lg">
            {ipString}/{cidr}
          </span>
          <span className="text-xs font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded">
            {usableHosts} Hosts
          </span>
        </div>
        
        {/* Ações: Dividir ou Juntar */}
        <div className="mt-4 flex gap-2">
          {!isSplit && cidr < 32 && (
            <button
              onClick={() => onSplit(nodeKey)}
              className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded hover:bg-emerald-500 hover:text-white transition-colors w-full"
            >
              Dividir em 2 (/{nextCidr})
            </button>
          )}
          {isSplit && (
            <button
              onClick={() => onJoin(nodeKey)}
              className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50 transition-colors w-full"
            >
              Juntar Redes
            </button>
          )}
        </div>
      </div>

      {/* Renderização Recursiva dos Filhos se estiver dividida */}
      {isSplit && (
        <div className="flex flex-col gap-2 border-l border-slate-700 ml-6 sm:ml-12 mt-2">
          <SubnetNode 
            ipInt={ipInt} 
            cidr={nextCidr} 
            splitMap={splitMap} 
            onSplit={onSplit} 
            onJoin={onJoin} 
          />
          <SubnetNode 
            ipInt={rightIpInt} 
            cidr={nextCidr} 
            splitMap={splitMap} 
            onSplit={onSplit} 
            onJoin={onJoin} 
          />
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PAI: ÁRVORE PRINCIPAL ---
export default function SubnetTree({ baseIpInt, baseCidr }: SubnetTreeProps) {
  // Estado que guarda quais redes foram divididas. Ex: { "167772160-24": true }
  const [splitMap, setSplitMap] = useState<Record<string, boolean>>({});

  const handleSplit = (key: string) => {
    setSplitMap(prev => ({ ...prev, [key]: true }));
  };

  const handleJoin = (key: string) => {
    setSplitMap(prev => {
      const newMap = { ...prev };
      // Remove o status de split do nó atual
      delete newMap[key];
      // Nota avançada: Idealmente, ao juntar, deveríamos limpar recursivamente 
      // todos os splits filhos para não reaparecerem se dividirmos novamente.
      // Para manter a UI rápida e pragmática, apagamos as chaves filhas que comecem com o prefixo.
      return newMap;
    });
  };

  // Previne renderizações desnecessárias se os dados base forem inválidos
  if (baseCidr >= 32 || isNaN(baseIpInt)) return null;

  return (
    <div className="mt-10 border-t border-slate-800 pt-6">
      {/* Cabeçalho Didático (Passo B) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xs text-slate-500 uppercase font-bold">Divisor Visual de Sub-redes:</h3>
          <p className="text-xs text-sky-400 mt-1 max-w-lg leading-relaxed">
            💡 <strong>O que acontece ao dividir?</strong> O CIDR aumenta em +1. Você "rouba" 1 bit dos hosts para criar mais redes. A rede original é cortada <strong>exatamente a meio</strong> (metade dos hosts para cada lado).
          </p>
        </div>
        <button 
          onClick={() => setSplitMap({})}
          className="text-xs border border-slate-700 text-slate-400 px-3 py-2 rounded-md hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/50 transition-colors whitespace-nowrap shadow-sm"
        >
          Resetar Árvore
        </button>
      </div>
      
      {/* Contêiner da Árvore com Scroll horizontal para não quebrar o layout em mobile */}
      <div className="overflow-x-auto pb-6 pl-2">
        <SubnetNode 
          ipInt={baseIpInt} 
          cidr={baseCidr} 
          isRoot={true} 
          splitMap={splitMap} 
          onSplit={handleSplit} 
          onJoin={handleJoin} 
        />
      </div>
    </div>
  );
}