
import React, { useState } from 'react';
// Adicionei o ícone 'Activity' para o título do Módulo
import { Power, Unplug, Clock, ArrowRight, ArrowLeft, RefreshCcw, Activity } from 'lucide-react';

// --- TIPAGENS ---
type ScenarioType = 'handshake' | 'teardown' | 'timeout';

interface Step {
  id: number;
  title: string;
  clientState: string;
  serverState: string;
  description: string;
  message: {
    direction: 'right' | 'left' | 'drop';
    text: string;
    color: string;
  } | null;
}

// --- DADOS DOS CENÁRIOS ---
const scenarios: Record<ScenarioType, { title: string; steps: Step[] }> = {
  handshake: {
    title: "Abertura (3-Way Handshake)",
    steps: [
      {
        id: 0, title: "Estado Inicial", clientState: "CLOSED", serverState: "LISTEN",
        description: "O Servidor está rodando um serviço (ex: Porta 443 para HTTPS) e aguardando conexões. O Cliente ainda não iniciou comunicação.",
        message: null
      },
      {
        id: 1, title: "Passo 1: SYN (Synchronize)", clientState: "SYN-SENT", serverState: "LISTEN",
        description: "O Cliente quer se conectar. Ele envia um pacote com a flag SYN ativada e um Número de Sequência aleatório (ex: Seq=100) para sincronizar os relógios das máquinas.",
        message: { direction: "right", text: "SYN (Seq=100)", color: "text-sky-400 border-sky-400 bg-sky-950/30" }
      },
      {
        id: 2, title: "Passo 2: SYN-ACK", clientState: "SYN-SENT", serverState: "SYN-RCVD",
        description: "O Servidor recebe o pedido. Ele responde ativando SYN e ACK. O ACK confirma o recebimento (Ack=101) e o SYN envia sua própria sequência aleatória (Seq=300).",
        message: { direction: "left", text: "SYN-ACK (Seq=300, Ack=101)", color: "text-amber-400 border-amber-400 bg-amber-950/30" }
      },
      {
        id: 3, title: "Passo 3: ACK", clientState: "ESTABLISHED", serverState: "ESTABLISHED",
        description: "O Cliente recebe o SYN-ACK e envia um ACK final (Ack=301) confirmando a sequência do servidor. A conexão está ESTABELECIDA! O canal está aberto e bidirecional.",
        message: { direction: "right", text: "ACK (Seq=101, Ack=301)", color: "text-emerald-400 border-emerald-400 bg-emerald-950/30" }
      }
    ]
  },
  teardown: {
    title: "Encerramento (4-Way Teardown)",
    steps: [
      {
        id: 0, title: "Estado Inicial (Conectado)", clientState: "ESTABLISHED", serverState: "ESTABLISHED",
        description: "Ambos os lados estão enviando dados. De repente, o Cliente decide que terminou de baixar a página web e quer fechar a conexão educadamente.",
        message: null
      },
      {
        id: 1, title: "Passo 1: FIN", clientState: "FIN-WAIT-1", serverState: "ESTABLISHED",
        description: "O Cliente envia um pacote com a flag FIN (Finish). Isso significa: 'Não tenho mais dados para enviar, mas ainda posso receber'.",
        message: { direction: "right", text: "FIN", color: "text-rose-400 border-rose-400 bg-rose-950/30" }
      },
      {
        id: 2, title: "Passo 2: ACK", clientState: "FIN-WAIT-2", serverState: "CLOSE-WAIT",
        description: "O Servidor reconhece o pedido de encerramento enviando um ACK. Ele avisa a aplicação (ex: Nginx) que o cliente quer fechar, mas pode terminar de enviar os últimos bytes se precisar.",
        message: { direction: "left", text: "ACK", color: "text-slate-400 border-slate-400 bg-slate-900/50" }
      },
      {
        id: 3, title: "Passo 3: FIN (Servidor)", clientState: "TIME-WAIT", serverState: "LAST-ACK",
        description: "A aplicação do Servidor terminou suas tarefas. O Servidor agora envia o seu próprio FIN para o Cliente, dizendo: 'Eu também terminei de enviar'.",
        message: { direction: "left", text: "FIN", color: "text-rose-400 border-rose-400 bg-rose-950/30" }
      },
      {
        id: 4, title: "Passo 4: ACK Final", clientState: "CLOSED", serverState: "CLOSED",
        description: "O Cliente confirma o recebimento com um ACK final. O Cliente entra em TIME-WAIT por alguns segundos (para garantir que o ACK chegou) e depois fecha completamente.",
        message: { direction: "right", text: "ACK", color: "text-slate-400 border-slate-400 bg-slate-900/50" }
      }
    ]
  },
  timeout: {
    title: "Retransmissão (Packet Loss)",
    steps: [
      {
        id: 0, title: "Estado Inicial", clientState: "CLOSED", serverState: "LISTEN",
        description: "A rede está instável (ex: Wi-Fi fraco ou roteador congestionado). Vamos tentar iniciar uma conexão.",
        message: null
      },
      {
        id: 1, title: "Tentativa: SYN", clientState: "SYN-SENT", serverState: "LISTEN",
        description: "O Cliente envia o pacote SYN. Mas, devido ao congestionamento na rede, o pacote é DROPPADO no caminho e nunca chega ao Servidor.",
        message: { direction: "drop", text: "SYN (Perdido!)", color: "text-red-500 border-red-500 bg-red-950/30 line-through" }
      },
      {
        id: 2, title: "Timeout (Tempo Esgotado)", clientState: "SYN-SENT", serverState: "LISTEN",
        description: "O Cliente tem um temporizador interno (RTO - Retransmission Timeout). Como o ACK não chegou no tempo esperado, ele assume que o pacote se perdeu.",
        message: null
      },
      {
        id: 3, title: "Retransmissão: SYN", clientState: "SYN-SENT", serverState: "SYN-RCVD",
        description: "O Cliente não desiste. Ele retransmite o pacote SYN. Desta vez, a rede ajuda e o pacote chega com sucesso ao servidor!",
        message: { direction: "right", text: "SYN (Retransmitido)", color: "text-sky-400 border-sky-400 bg-sky-950/30" }
      },
      {
        id: 4, title: "Recuperação: SYN-ACK", clientState: "ESTABLISHED", serverState: "ESTABLISHED",
        description: "A partir daqui, o fluxo segue normalmente. O Servidor responde com SYN-ACK e o Handshake é concluído. É essa resiliência invisível que torna o TCP tão confiável.",
        message: { direction: "left", text: "SYN-ACK", color: "text-amber-400 border-amber-400 bg-amber-950/30" }
      }
    ]
  }
};

// --- COMPONENTE PRINCIPAL ---
export default function TcpHandshake() {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('handshake');
  const [step, setStep] = useState(0);

  const currentScenario = scenarios[activeScenario];
  const currentStep = currentScenario.steps[step];

  // Helper para trocar de cenário resetando os passos
  const changeScenario = (scenario: ScenarioType) => {
    setActiveScenario(scenario);
    setStep(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-slate-950 text-slate-50 rounded-xl shadow-2xl border border-slate-800">
      
      {/* Cabeçalho Alinhado com o restante do App */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="text-amber-400" />
          Módulo 3: Ciclo de Vida TCP
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore como o TCP garante uma comunicação infalível mesmo em redes caóticas.
        </p>
      </div>

      {/* Seletor de Cenários (Tabs) */}
      <div className="flex bg-slate-900 rounded-lg p-1.5 mb-8 border border-slate-800 w-full max-w-xl">
        <button
          onClick={() => changeScenario('handshake')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeScenario === 'handshake' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Power size={16} /> <span className="hidden sm:inline">Conexão</span> (3-Way)
        </button>
        <button
          onClick={() => changeScenario('teardown')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeScenario === 'teardown' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Unplug size={16} /> <span className="hidden sm:inline">Encerramento</span> (4-Way)
        </button>
        <button
          onClick={() => changeScenario('timeout')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-md font-bold text-xs sm:text-sm transition-all duration-300 ${
            activeScenario === 'timeout' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Clock size={16} /> <span className="hidden sm:inline">Perda de Pacote</span>
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Controles de Passo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800 pb-4 gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-200">{currentScenario.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Passo {step} de {currentScenario.steps.length - 1}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 border border-slate-700 text-slate-400 rounded-md hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-sm"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
            <button 
              onClick={() => setStep(Math.min(currentScenario.steps.length - 1, step + 1))}
              disabled={step === currentScenario.steps.length - 1}
              className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 border border-emerald-500/50 text-emerald-400 bg-emerald-950/20 rounded-md hover:bg-emerald-900/40 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-bold text-sm"
            >
              Avançar <ArrowRight size={14} />
            </button>
            <button 
              onClick={() => setStep(0)}
              title="Resetar"
              className="px-3 py-2 border border-slate-700 text-slate-500 rounded-md hover:bg-slate-800 hover:text-slate-300 transition-all ml-1"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </div>

        {/* --- ÁREA VISUAL DA TROCA DE MENSAGENS --- */}
        <div className="relative bg-slate-900/50 border border-slate-800/80 rounded-lg p-6 sm:p-10 mt-8 flex justify-between items-center min-h-[280px] overflow-hidden">
          
          {/* Dispositivo Cliente */}
          <div className="flex flex-col items-center z-10 w-24 sm:w-32">
            <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-slate-800 border-2 rounded-xl sm:rounded-2xl mb-3 flex items-center justify-center text-2xl sm:text-3xl transition-colors duration-500 ${currentStep.clientState === 'ESTABLISHED' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-600'}`}>
              💻
            </div>
            <span className="font-bold text-slate-200 text-sm">Cliente</span>
            <span className={`text-[10px] sm:text-xs mt-1.5 px-2.5 py-1 rounded-full font-mono font-semibold tracking-wider transition-colors duration-300
              ${currentStep.clientState.includes('ESTABLISHED') ? 'bg-emerald-500/20 text-emerald-400' : 
                currentStep.clientState.includes('WAIT') ? 'bg-rose-500/20 text-rose-400' :
                currentStep.clientState.includes('SENT') ? 'bg-sky-500/20 text-sky-400' : 
                'bg-slate-800 text-slate-400'}`
            }>
              {currentStep.clientState}
            </span>
          </div>

          {/* O "Cabo" de Rede (Fundo) */}
          <div className="absolute left-24 right-24 sm:left-32 sm:right-32 top-[calc(50%-1.5rem)] sm:top-[calc(50%-2rem)] -translate-y-1/2 border-t-2 border-dashed border-slate-700"></div>

          {/* O Pacote Trafegando */}
          <div className="flex-1 flex justify-center z-10 absolute left-0 right-0 top-[calc(50%-1.5rem)] sm:top-[calc(50%-2rem)] -translate-y-1/2 pointer-events-none">
            {currentStep.message ? (
              <div 
                key={`${activeScenario}-${step}`} // Força re-render da animação no React
                className={`px-4 sm:px-5 py-2 border-2 rounded-full font-bold text-xs sm:text-sm font-mono shadow-xl bg-slate-950 transition-all duration-500 
                  ${currentStep.message.color} 
                  ${currentStep.message.direction === 'right' ? 'animate-slide-right' : 
                    currentStep.message.direction === 'left' ? 'animate-slide-left' : 'animate-drop'}
                `}
                style={currentStep.message.direction === 'drop' ? { transform: 'translateY(20px) scale(0.9)', opacity: 0.8 } : {}}
              >
                {currentStep.message.direction === 'right' ? `► ${currentStep.message.text}` : 
                 currentStep.message.direction === 'left'  ? `◄ ${currentStep.message.text}` : 
                 `❌ ${currentStep.message.text}`}
              </div>
            ) : (
              <div className="text-slate-600 text-xs sm:text-sm italic bg-slate-900/80 px-4 py-1 rounded-full">Nenhum tráfego</div>
            )}
          </div>

          {/* Dispositivo Servidor */}
          <div className="flex flex-col items-center z-10 w-24 sm:w-32">
            <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-slate-800 border-2 rounded-xl sm:rounded-2xl mb-3 flex items-center justify-center text-2xl sm:text-3xl transition-colors duration-500 ${currentStep.serverState === 'ESTABLISHED' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-600'}`}>
              🖥️
            </div>
            <span className="font-bold text-slate-200 text-sm">Servidor</span>
            <span className={`text-[10px] sm:text-xs mt-1.5 px-2.5 py-1 rounded-full font-mono font-semibold tracking-wider transition-colors duration-300
              ${currentStep.serverState.includes('ESTABLISHED') ? 'bg-emerald-500/20 text-emerald-400' : 
                currentStep.serverState.includes('WAIT') || currentStep.serverState.includes('ACK') ? 'bg-rose-500/20 text-rose-400' :
                currentStep.serverState.includes('RCVD') ? 'bg-amber-500/20 text-amber-400' : 
                currentStep.serverState === 'LISTEN' ? 'bg-indigo-500/20 text-indigo-400' :
                'bg-slate-800 text-slate-400'}`
            }>
              {currentStep.serverState}
            </span>
          </div>
        </div>

        {/* --- PAINEL DE EXPLICAÇÃO --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mt-6 relative overflow-hidden group">
          <div className={`absolute top-0 left-0 w-1 h-full ${activeScenario === 'handshake' ? 'bg-sky-500' : activeScenario === 'teardown' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
          <h3 className="text-slate-200 font-bold mb-2 uppercase text-xs sm:text-sm tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
            {currentStep.title}
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
            {currentStep.description}
          </p>
        </div>

      </div>

      {/* Estilos globais injetados para animações específicas do pacote */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-right {
          0% { transform: translateX(-100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100px); opacity: 0; }
        }
        @keyframes slide-left {
          0% { transform: translateX(100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(-100px); opacity: 0; }
        }
        @keyframes drop {
          0% { transform: translate(-100px, 0); opacity: 0; }
          30% { transform: translate(-20px, 0); opacity: 1; }
          40% { transform: translate(0, 20px) scale(0.9) rotate(5deg); opacity: 0.5; }
          100% { transform: translate(0, 50px) scale(0.8) rotate(10deg); opacity: 0; }
        }
        .animate-slide-right { animation: slide-right 2.5s ease-in-out forwards; }
        .animate-slide-left { animation: slide-left 2.5s ease-in-out forwards; }
        .animate-drop { animation: drop 2s ease-in forwards; }
      `}} />
    </div>
  );
}