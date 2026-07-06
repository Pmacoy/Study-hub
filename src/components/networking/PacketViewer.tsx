
import React, { useState } from 'react';
import { 
  Globe, Terminal, MessageCircle, Video, Gamepad2, PhoneCall, 
  ShieldCheck, Zap, Server 
} from 'lucide-react';

type Protocol = 'tcp' | 'udp';

// --- DICIONÁRIOS DE DADOS ---

// 1. Explicações dos campos do pacote (Seu código original)
const explicacoesPck: Record<string, string> = {
  "Source Port": "Porta de Origem: Identifica qual aplicação no dispositivo remetente enviou o pacote. Ex: Porta 54321 do seu navegador.",
  "Destination Port": "Porta de Destino: Identifica qual aplicação no dispositivo receptor deve receber o pacote. Ex: Porta 443 para HTTPS (sites seguros).",
  "Sequence Number": "Número de Sequência: No TCP, garante que os pacotes sejam montados na ordem correta no destino, mesmo que cheguem bagunçados pela rede.",
  "Acknowledgment Number": "Número de Confirmação (ACK): Confirma para o remetente que os dados anteriores foram recebidos com sucesso e avisa qual é o próximo pacote esperado.",
  "Offset": "Data Offset (Tamanho do Cabeçalho): Indica onde os dados reais começam dentro do pacote. Como o campo de Opções é variável, isso diz o tamanho exato do cabeçalho.",
  "Res.": "Reservado: São 3 bits guardados para uso futuro em novas versões do protocolo. Atualmente, devem ser sempre preenchidos com zeros.",
  "Flags": "Flags de Controle: São 'interruptores' que controlam o estado da conexão. Ex: SYN (sincronizar/iniciar), ACK (confirmar), FIN (finalizar), RST (resetar).",
  "Window Size": "Tamanho da Janela: Faz o controle de fluxo. Diz ao remetente quanto espaço livre (em bytes) o receptor tem no buffer para receber novos dados sem engasgar.",
  "Checksum": "Checksum (Soma de Verificação): É uma validação matemática. O receptor refaz o cálculo para checar se o pacote foi corrompido ou alterado durante a viagem.",
  "Urgent Pointer": "Ponteiro Urgente: Trabalha junto com a flag URG. Indica exatamente onde terminam os dados urgentes que precisam ser processados imediatamente pelo sistema.",
  "Options / Padding": "Opções e Preenchimento: Configurações extras (como tamanho máximo de segmento). O Padding (zeros) é adicionado para garantir que o cabeçalho termine num múltiplo exato de 32 bits.",
  "Length": "Comprimento: Usado no UDP. Indica o tamanho total do datagrama (Cabeçalho + Dados) em bytes.",
  "Data (Payload)": "Dados / Payload: A carga útil! É aqui que vai a sua informação real: a mensagem do WhatsApp, o pedaço do vídeo do YouTube ou a foto do site."
};

// 2. Casos de Uso no Mundo Real (A camada de negócios)
const casosDeUso = {
  tcp: {
    title: "Garantia de Entrega > Velocidade",
    icon: <ShieldCheck className="text-emerald-400" size={24} />,
    theme: "emerald",
    items: [
      { name: "Navegação Web (HTTP/HTTPS)", desc: "Sites não podem carregar faltando pedaços de HTML ou CSS.", icon: <Globe size={20} /> },
      { name: "Acesso Remoto (SSH)", desc: "Cada comando digitado precisa ser executado exatamente na ordem.", icon: <Terminal size={20} /> },
      { name: "Mensagens (WhatsApp)", desc: "Uma mensagem de texto não pode chegar com letras embaralhadas.", icon: <MessageCircle size={20} /> },
    ]
  },
  udp: {
    title: "Velocidade > Garantia de Entrega",
    icon: <Zap className="text-sky-400" size={24} />,
    theme: "sky",
    items: [
      { name: "Streaming (YouTube/Netflix)", desc: "É melhor perder um frame de vídeo do que travar a tela inteira esperando.", icon: <Video size={20} /> },
      { name: "Jogos Online (Multiplayer)", desc: "A posição atual do inimigo é o que importa, não a de 2 segundos atrás.", icon: <Gamepad2 size={20} /> },
      { name: "Chamadas de Voz (VoIP)", desc: "Pequenos 'picotes' na voz são preferíveis a um atraso (lag) gigante.", icon: <PhoneCall size={20} /> },
    ]
  }
};

// --- COMPONENTE PRINCIPAL ---
export default function PacketViewer() {
  const [protocol, setProtocol] = useState<Protocol>('tcp');
  const [campoSelecionado, setCampoSelecionado] = useState<string | null>(null);

  const handleProtocolChange = (p: Protocol) => {
    setProtocol(p);
    setCampoSelecionado(null);
  };

  const businessData = casosDeUso[protocol];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800 space-y-8 animate-in fade-in duration-300">
      
      {/* CABEÇALHO E TOGGLE */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
          <Server className="text-slate-400" />
          Módulo 2: Anatomia do Pacote & Casos de Uso
        </h2>
        
        <div className="flex bg-slate-900 rounded-lg p-1.5 border border-slate-800 w-full max-w-md">
          <button
            onClick={() => handleProtocolChange('tcp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-bold text-sm transition-all duration-300 ${
              protocol === 'tcp' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md border' : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <ShieldCheck size={18} /> TCP
          </button>
          <button
            onClick={() => handleProtocolChange('udp')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-bold text-sm transition-all duration-300 ${
              protocol === 'udp' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400 shadow-md border' : 'text-slate-500 hover:text-slate-300 border border-transparent'
            }`}
          >
            <Zap size={18} /> UDP
          </button>
        </div>
      </div>

      {/* ÁREA DE INSPEÇÃO DO PACOTE (SEU CÓDIGO MELHORADO) */}
      <div>
        <div className="text-xs text-slate-500 uppercase font-bold mb-3">
          Estrutura do Cabeçalho {protocol.toUpperCase()} (Clique nos blocos)
        </div>

        <div 
          className="grid gap-1 bg-slate-900/50 p-4 sm:p-5 rounded-t-lg border border-slate-800 relative overflow-x-auto min-w-[600px]"
          style={{ gridTemplateColumns: 'repeat(32, minmax(0, 1fr))' }}
        >
          {/* Escala de Bits */}
          <div className="col-span-full flex justify-between text-[10px] text-slate-500 mb-2 px-1 font-mono">
            <span>0</span><span>4</span><span>8</span><span>16</span><span>24</span><span>31</span>
          </div>

          {/* --- ESTRUTURA TCP --- */}
          {protocol === 'tcp' && (
            <>
              <PacketField label="Source Port" bits="16 bits" span={16} isSelected={campoSelecionado === 'Source Port'} onClick={() => setCampoSelecionado('Source Port')} />
              <PacketField label="Destination Port" bits="16 bits" span={16} isSelected={campoSelecionado === 'Destination Port'} onClick={() => setCampoSelecionado('Destination Port')} />
              
              <PacketField label="Sequence Number" bits="32 bits" span={32} isSelected={campoSelecionado === 'Sequence Number'} onClick={() => setCampoSelecionado('Sequence Number')} />
              
              <PacketField label="Acknowledgment Number" bits="32 bits" span={32} isSelected={campoSelecionado === 'Acknowledgment Number'} onClick={() => setCampoSelecionado('Acknowledgment Number')} />
              
              <PacketField label="Offset" bits="4 bits" span={4} isSelected={campoSelecionado === 'Offset'} onClick={() => setCampoSelecionado('Offset')} />
              <PacketField label="Res." bits="3 bits" span={3} isSelected={campoSelecionado === 'Res.'} onClick={() => setCampoSelecionado('Res.')} />
              <PacketField label="Flags" displayLabel="Flags (NS, CWR... SYN, FIN)" bits="9 bits" span={9} highlight="border-amber-500/50 text-amber-400" isSelected={campoSelecionado === 'Flags'} onClick={() => setCampoSelecionado('Flags')} />
              <PacketField label="Window Size" bits="16 bits" span={16} isSelected={campoSelecionado === 'Window Size'} onClick={() => setCampoSelecionado('Window Size')} />
              
              <PacketField label="Checksum" bits="16 bits" span={16} isSelected={campoSelecionado === 'Checksum'} onClick={() => setCampoSelecionado('Checksum')} />
              <PacketField label="Urgent Pointer" bits="16 bits" span={16} isSelected={campoSelecionado === 'Urgent Pointer'} onClick={() => setCampoSelecionado('Urgent Pointer')} />
              
              <PacketField label="Options / Padding" bits="Variável" span={32} isVariable isSelected={campoSelecionado === 'Options / Padding'} onClick={() => setCampoSelecionado('Options / Padding')} />
              <PacketField label="Data (Payload)" bits="Camada de Aplicação" span={32} highlight="bg-emerald-950/30 border-emerald-500/50 text-emerald-400" isVariable isSelected={campoSelecionado === 'Data (Payload)'} onClick={() => setCampoSelecionado('Data (Payload)')} />
            </>
          )}

          {/* --- ESTRUTURA UDP --- */}
          {protocol === 'udp' && (
            <>
              <PacketField label="Source Port" bits="16 bits" span={16} isSelected={campoSelecionado === 'Source Port'} onClick={() => setCampoSelecionado('Source Port')} />
              <PacketField label="Destination Port" bits="16 bits" span={16} isSelected={campoSelecionado === 'Destination Port'} onClick={() => setCampoSelecionado('Destination Port')} />
              
              <PacketField label="Length" bits="16 bits" span={16} isSelected={campoSelecionado === 'Length'} onClick={() => setCampoSelecionado('Length')} />
              <PacketField label="Checksum" bits="16 bits" span={16} isSelected={campoSelecionado === 'Checksum'} onClick={() => setCampoSelecionado('Checksum')} />
              
              <PacketField label="Data (Payload)" bits="Camada de Aplicação" span={32} highlight="bg-sky-950/30 border-sky-500/50 text-sky-400" isVariable isSelected={campoSelecionado === 'Data (Payload)'} onClick={() => setCampoSelecionado('Data (Payload)')} />
            </>
          )}
        </div>

        {/* Painel de Explicação Didática */}
        <div className="bg-slate-900 border border-t-0 border-slate-800 rounded-b-lg p-5 min-h-[100px] flex items-center shadow-inner relative overflow-hidden">
          {campoSelecionado ? (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <span className={`${protocol === 'tcp' ? 'text-emerald-400' : 'text-sky-400'} font-bold text-sm uppercase mr-2`}>
                {campoSelecionado}:
              </span>
              <span className="text-slate-300 text-sm leading-relaxed">
                {explicacoesPck[campoSelecionado] || "Explicação não encontrada."}
              </span>
            </div>
          ) : (
            <div className="text-slate-500 text-sm w-full flex items-center justify-center gap-2">
              <span className="animate-bounce">👆</span> Clique em qualquer campo do pacote acima para inspecionar.
            </div>
          )}
        </div>
      </div>

      {/* A NOVA CAMADA DE NEGÓCIOS (Casos de Uso) */}
      <div className="pt-4 animate-in fade-in zoom-in-95 duration-500 key={protocol}">
        <div className="flex items-center gap-3 mb-4">
          {businessData.icon}
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              {protocol} no Mundo Real
            </h3>
            <p className={`text-xs font-bold uppercase tracking-widest ${businessData.theme === 'emerald' ? 'text-emerald-400' : 'text-sky-400'}`}>
              Filosofia: {businessData.title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {businessData.items.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex flex-col gap-3 hover:border-slate-600 transition-colors">
              <div className={`p-2 rounded-md inline-flex w-fit bg-slate-950 border ${businessData.theme === 'emerald' ? 'border-emerald-500/30 text-emerald-400' : 'border-sky-500/30 text-sky-400'}`}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm mb-1">{item.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// --- SUB-COMPONENTE DO GRID ---
function PacketField({ 
  label, 
  displayLabel,
  bits, 
  span, 
  highlight = 'border-slate-700 text-slate-200',
  isVariable = false,
  isSelected = false,
  onClick
}: { 
  label: string; 
  displayLabel?: string;
  bits: string; 
  span: number; 
  highlight?: string;
  isVariable?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      style={{ gridColumn: `span ${span} / span ${span}` }}
      className={`p-2 sm:p-3 text-center flex flex-col justify-center rounded-sm transition-all border outline-none cursor-pointer
        ${highlight} 
        ${isVariable ? 'border-dashed bg-slate-950/50' : 'bg-slate-800'}
        ${isSelected ? 'ring-2 ring-white border-transparent scale-[1.02] z-10 shadow-lg bg-slate-700' : 'hover:bg-slate-700 hover:scale-[1.01]'}
      `}
    >
      <span className="font-bold text-[10px] sm:text-xs truncate w-full">{displayLabel || label}</span>
      <span className="text-[9px] sm:text-[10px] opacity-70 mt-1">{bits}</span>
    </button>
  );
}