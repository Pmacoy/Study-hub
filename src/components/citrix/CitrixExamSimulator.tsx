import { useState } from 'react';
import { CheckCircle2, Award, BookOpen, Sparkles, AlertCircle } from 'lucide-react';

interface Question {
  q: string;
  opts: string[];
  a: number;
  exp: string;
  mod: string;
}

const QUESTIONS: Question[] = [
  {
    q: "Qual a principal diferença entre MCS (Machine Creation Services) e PVS em termos de arquitetura de armazenamento?",
    opts: [
      "O MCS utiliza streaming direto pela rede para a RAM, enquanto o PVS cria cópias completas.",
      "O MCS cria discos de diferenciação (write cache) baseados numa imagem mestre no storage do hipervisor, enquanto o PVS transmite a imagem por streaming.",
      "Não existe diferença técnica, apenas comercial.",
      "O PVS apenas funciona em AWS, enquanto o MCS é exclusivo on-premise."
    ],
    a: 1,
    exp: "O MCS cria discos de diferenciação a partir de uma master image no storage nativo (EBS/SAN), enquanto o PVS faz streaming do vDisk diretamente para a VM.",
    mod: "Citrix DaaS & MCS"
  },
  {
    q: "Após uma alteração no WEM, os logons passaram a demorar exatamente 30 segundos adicionais. Qual é a causa mais provável?",
    opts: [
      "Aumento do tamanho do perfil do utilizador.",
      "Uma External Task do WEM recém-adicionada aponta para uma share inacessível, atingindo o timeout síncrono padrão de 30 segundos.",
      "Falha de sincronização do Active Directory.",
      "Falta de espaço no disco C: da VDA."
    ],
    a: 1,
    exp: "O timeout padrão de execução síncrona para tarefas externas no WEM é de 30 segundos quando o recurso alvo está inacessível.",
    mod: "Citrix WEM"
  },
  {
    q: "O que acontece se ligar em simultâneo o Citrix UPM e o FSLogix Profile Container para gerir o mesmo perfil completo de utilizador?",
    opts: [
      "O desempenho duplica devido à redundância.",
      "Entram em conflito direto na sincronização e nos locks de ficheiro, resultando em perfis corrompidos ou falhas de logon.",
      "O FSLogix anula automaticamente o UPM sem problemas.",
      "O Windows impede o arranque da VDA."
    ],
    a: 1,
    exp: "Nunca se deve misturar duas soluções completas de perfis na mesma camada de utilizador para evitar race conditions e corrupção de dados.",
    mod: "Profile Management & FSLogix"
  },
  {
    q: "Qual é a principal vantagem de gerir um site Citrix DaaS utilizando o Terraform Provider oficial?",
    opts: [
      "Elimina a necessidade de licenças Citrix Cloud.",
      "Garante a infraestrutura como código (IaC), auditabilidade e elimina configuração manual via consola ('ClickOps').",
      "Torna os servidores VDA 50% mais rápidos.",
      "Substitui inteiramente o Active Directory."
    ],
    a: 1,
    exp: "O Terraform traz reprodutibilidade, controlo de versões (Git) e eliminação de alterações manuais não documentadas (drift).",
    mod: "Terraform Citrix"
  }
];

export default function CitrixExamSimulator() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.a) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    if (current + 1 < QUESTIONS.length) {
      setCurrent(c => c + 1);
    } else {
      setFinished(true);
    }
  };

  const resetExam = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const passed = score >= 3;
    return (
      <div className="space-y-6 text-center py-8">
        <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/40 rounded-full flex items-center justify-center mx-auto text-violet-400">
          <Award size={32} />
        </div>
        <div>
          <h3 className="text-[22px] font-bold text-white">Simulado Citrix Concluído!</h3>
          <p className="text-[14px] text-slate-400 mt-1">Acertou {score} de {QUESTIONS.length} questões ({Math.round((score/QUESTIONS.length)*100)}%).</p>
        </div>
        <div className={`p-4 rounded-xl max-w-md mx-auto border ${passed ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/20 border-rose-500/20 text-rose-300'}`}>
          {passed ? '🎉 Excelente! Demonstrou sólida compreensão prática e arquitetural de Citrix VDI como Código.' : '📚 Reveja os módulos de WEM e MCS e tente novamente.'}
        </div>
        <button
          onClick={resetExam}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[13px] font-medium transition-all shadow"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase">Simulado de Certificação / Entrevista</span>
          <h2 className="text-[18px] font-bold text-white mt-1">Citrix Platform Engineer — Q{current + 1} de {QUESTIONS.length}</h2>
        </div>
        <span className="text-[12px] text-slate-400 font-mono">Módulo: {q.mod}</span>
      </div>

      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <p className="text-[15px] font-medium text-slate-200 leading-relaxed">{q.q}</p>
        <div className="grid gap-2.5 pt-2">
          {q.opts.map((opt, idx) => {
            let style = 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-violet-500/50';
            if (selected !== null) {
              if (idx === q.a) style = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200';
              else if (idx === selected) style = 'bg-rose-950/40 border-rose-500/40 text-rose-200';
              else style = 'bg-slate-900/30 border-slate-900 text-slate-500 opacity-60';
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full text-left p-3.5 rounded-xl border text-[13px] transition-all flex items-start gap-3 ${style}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 font-mono text-[11px] text-slate-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug pt-0.5">{opt}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-violet-300">
              <BookOpen size={15} />
              <span>Explicação Técnica:</span>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed">{q.exp}</p>
            <div className="pt-3 flex justify-end">
              <button
                onClick={nextQuestion}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[13px] font-medium transition-all shadow"
              >
                {current + 1 < QUESTIONS.length ? 'Seguinte →' : 'Ver Resultados'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
