import { useState } from 'react';
import { Calculator, HardDrive, Zap, Gauge } from 'lucide-react';

const CALCULATORS = [
  {
    id: 'storage',
    name: 'Storage Estimation',
    icon: HardDrive,
    description: 'Quanta storage precisa para N usuários com M GB cada, durante T dias?',
    fields: [
      { key: 'users', label: 'Nº de usuários', default: '1000000' },
      { key: 'gbPerUser', label: 'GB por usuário', default: '2' },
      { key: 'days', label: 'Período (dias)', default: '365' },
      { key: 'replication', label: 'Replicação', default: '3' },
    ],
    formula: (v: Record<string, string>) => {
      const users = parseFloat(v.users) || 0;
      const gb = parseFloat(v.gbPerUser) || 0;
      const days = parseFloat(v.days) || 0;
      const repl = parseFloat(v.replication) || 1;
      const totalTB = (users * gb * days / 365 * repl) / 1000;
      return { totalTB: totalTB.toFixed(1), raw: `${users} × ${gb}GB × ${repl} reps ÷ 1000 = ${totalTB.toFixed(1)} TB/ano` };
    },
  },
  {
    id: 'throughput',
    name: 'Throughput Estimate',
    icon: Zap,
    description: 'Quantos requests/segundo o sistema precisa suportar?',
    fields: [
      { key: 'dailyRequests', label: 'Requests/dia', default: '100000000' },
      { key: 'peakPct', label: '% no pico (24h window)', default: '5' },
      { key: 'windowMin', label: 'Janela de pico (minutos)', default: '60' },
    ],
    formula: (v: Record<string, string>) => {
      const daily = parseFloat(v.dailyRequests) || 0;
      const pct = parseFloat(v.peakPct) || 0;
      const min = parseFloat(v.windowMin) || 60;
      const peakRps = (daily * (pct / 100)) / (min * 60);
      return { totalTB: peakRps.toFixed(0), raw: `${daily} req/dia × ${pct}% ÷ (${min}min × 60s) = ${peakRps.toFixed(0)} req/s no pico` };
    },
  },
  {
    id: 'bandwidth',
    name: 'Bandwidth Estimate',
    icon: Gauge,
    description: 'Largura de banda necessária para N requests com payload médio?',
    fields: [
      { key: 'rps', label: 'Requests/segundo', default: '5000' },
      { key: 'payloadKB', label: 'Payload médio (KB)', default: '50' },
      { key: 'hours', label: 'Horas de tráfego sustentado', default: '24' },
    ],
    formula: (v: Record<string, string>) => {
      const rps = parseFloat(v.rps) || 0;
      const kb = parseFloat(v.payloadKB) || 0;
      const hours = parseFloat(v.hours) || 24;
      const mbps = (rps * kb * 8) / 1000; // Mbps
      const dailyTB = (rps * kb * 3600 * hours / 1000 / 1000 / 1000).toFixed(3);
      return { totalTB: `${mbps.toFixed(1)} Mbps sustain / ${dailyTB} TB/dia`, raw: `${rps} req/s × ${kb}KB × 8bits ÷ 1000 = ${mbps.toFixed(1)} Mbps` };
    },
  },
];

export default function BackOfEnvelope() {
  const [activeCalc, setActiveCalc] = useState(0);
  const [inputs, setInputs] = useState<Record<number, Record<string, string>>>({});
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const calc = CALCULATORS[activeCalc];
  const CalcIcon = calc.icon;

  const getInputs = () => inputs[activeCalc] || Object.fromEntries(calc.fields.map(f => [f.key, f.default]));
  const setInputsForCalc = (next: Record<string, string>) => {
    setInputs(prev => ({ ...prev, [activeCalc]: next }));
  };

  const result = calc.formula(getInputs());

  return (
    <div className="space-y-6">
      <div className="border card-glass card-glass-hover p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30">
            <Calculator size={18} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">Back-of-Envelope Calculations</h2>
            <p className="text-xs text-slate-400">Estime capacidade sem spreadsheet — aproximações que ajudam a decidir</p>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 mb-5">
          <p className="text-sm text-rose-200/80 leading-relaxed">
            <strong className="text-rose-300">Porquê?</strong> Antes de escolher entre 1 servidor grande ou 10 pequenos, fazer cálculos rápidos evita over-provisioning (custo) e under-provisioning (incidentes).
          </p>
        </div>

        {/* Calculator tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {CALCULATORS.map((c, i) => {
            const CIcon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCalc(i)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  activeCalc === i
                    ? 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                    : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:border-slate-700'
                }`}
              >
                <CIcon size={18} className={activeCalc === i ? 'text-rose-400' : 'text-slate-600'} />
                <span className="text-xs font-semibold text-center">{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active calculator */}
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalcIcon size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-rose-300">{calc.name}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">{calc.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {calc.fields.map((field) => (
              <div key={field.key}>
                <label className="text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{field.label}</label>
                <input
                  type="number"
                  value={getInputs()[field.key]}
                  onChange={(e) => setInputsForCalc({ ...getInputs(), [field.key]: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-slate-900/60 border border-slate-800 p-4">
            <span className="text-2xs font-black uppercase tracking-widest text-rose-400 font-mono">Resultado</span>
            <div className="mt-2 text-2xl font-black text-white font-mono">{result.totalTB}</div>
            <div className="mt-1 text-xs text-slate-500 font-mono">{result.raw}</div>
          </div>
        </div>
      </div>

      {/* Rules of thumb */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 font-mono mb-4">Regras de ouro</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { rule: '1 req/s ≈ 86K req/dia', note: 'Bom benchmark para estimar carga diária a partir de pico' },
            { rule: 'API REST: ~10-100 req/s por instância', note: 'Depende de complexity — DB-heavy vs cache-heavy' },
            { rule: 'DB write: ~1K-10K ops/s por shard', note: 'PostgreSQL single-writer; throughput escala com sharding' },
            { rule: 'Redis: ~100K ops/s por instância', note: 'Ops simples (GET/SET); pipelines melhoram throughput' },
            { rule: 'Redundância 2N ≠ 2× custo', note: 'Hardware mais barato por unit em scale — N+1 é mais económico que 2N dedicado' },
            { rule: 'Headroom de 3× para picos', note: 'Tráfego real tem spikes 3-10× média; preveja para pico, não para média' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
              <span className="text-sm font-bold text-rose-300 font-mono">{item.rule}</span>
              <p className="text-2xs text-slate-500 mt-1">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="border card-glass card-glass-hover p-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 font-mono mb-4">Testa o teu conhecimento</h3>
        <div className="space-y-4">
          {[
            {
              q: 'Um service recebe 10M requests/dia. Qual a ordem de grandeza do pico em req/s (assumindo 5% no pico numa hora)?',
              choices: ['~10 req/s', '~200 req/s', '~2000 req/s', '~20000 req/s'],
              correct: 1,
              explanation: '10M × 5% = 500K req num período de 1 hora = 3600s. 500000 ÷ 3600 ≈ 139 req/s. A resposta mais próxima é ~200 req/s.',
            },
            {
              q: 'Porquê que headroom de 3× é recomendado?',
              choices: [
                'Porque servidores falham aleatoriamente',
                'Tráfego real tem spikes imprevisíveis; média não reflete pico',
                'Porque 3× é o padrão da AWS',
                'Não é recomendado — use 1×',
              ],
              correct: 1,
              explanation: 'Eventos como Black Friday, lançamentos de produto, ou viralização criam picos 10-100× a média. Provisionar só para média = incidentes nesses momentos.',
            },
          ].map((item, qi) => (
            <div key={qi} className="space-y-2">
              <p className="text-sm text-white font-medium">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.choices.map((choice, ci) => {
                  let cls = 'border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700';
                  if (quizAnswer === qi) {
                    if (ci === item.correct) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else cls = 'border-slate-800 bg-slate-900/30 text-slate-600';
                  }
                  return (
                    <button
                      key={ci}
                      onClick={() => setQuizAnswer(quizAnswer === qi ? null : qi)}
                      className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${cls}`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {quizAnswer === qi && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-200/80">
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
          {quizAnswer !== null && (
            <button onClick={() => setQuizAnswer(null)} className="text-xs text-slate-500 hover:text-slate-300 underline">
              Reiniciar quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
