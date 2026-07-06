import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

function Code({ code, output }: { code: string; output?: string }) {
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-[11px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-500">python</span>
        <div className="flex gap-2">
          {output && (
            <button onClick={() => setShowOutput(s => !s)}
              className="text-amber-400 text-[10px] hover:text-amber-300 font-semibold">
              {showOutput ? '▼ output' : '▶ run'}
            </button>
          )}
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        </div>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => {
          const isComment = line.trim().startsWith('#');
          const isKeyword = /^(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|lambda|yield|pass|break|continue|raise|and|or|not|in|is)\b/.test(line.trim());
          return (
            <div key={i} className={isComment ? 'text-slate-600' : isKeyword ? 'text-violet-400' : 'text-slate-300'}>
              {line}
            </div>
          );
        })}
      </pre>
      {output && showOutput && (
        <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <div className="text-[9px] text-amber-500 font-bold uppercase mb-1">Output:</div>
          <pre className="font-mono text-amber-300 text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}

const DATA_TYPES = [
  { type: 'int', example: '42, -7, 0', note: 'Inteiro, precisão arbitrária', color: 'sky' },
  { type: 'float', example: '3.14, -0.5, 2.0e8', note: 'Ponto flutuante 64-bit', color: 'violet' },
  { type: 'str', example: '"hello", \'world\'', note: 'Texto Unicode imutável', color: 'emerald' },
  { type: 'bool', example: 'True, False', note: 'Subclasse de int (True=1, False=0)', color: 'amber' },
  { type: 'NoneType', example: 'None', note: 'Ausência de valor (null do Python)', color: 'rose' },
  { type: 'list', example: '[1, "a", True]', note: 'Sequência mutável ordenada', color: 'teal' },
  { type: 'tuple', example: '(1, 2, 3)', note: 'Sequência imutável ordenada', color: 'sky' },
  { type: 'dict', example: '{"k": "v"}', note: 'Pares chave→valor (hash map)', color: 'violet' },
  { type: 'set', example: '{1, 2, 3}', note: 'Elementos únicos não ordenados', color: 'emerald' },
];

const OPERATORS = [
  { cat: 'Aritméticos', ops: ['+  soma', '-  subtracção', '*  multiplicação', '/  divisão (float)', '//  divisão inteira', '%  módulo (resto)', '**  potência'] },
  { cat: 'Comparação', ops: ['==  igual', '!=  diferente', '<  menor', '>  maior', '<=  menor ou igual', '>=  maior ou igual'] },
  { cat: 'Lógicos', ops: ['and  E lógico', 'or  OU lógico', 'not  negação'] },
  { cat: 'Atribuição', ops: ['=  atribuir', '+=  somar e atribuir', '-=  subtrair e atribuir', '*=  multiplicar', '//=  divisão inteira', '**=  potência'] },
];

export default function BasicsModule() {
  const [section, setSection] = useState<'intro' | 'types' | 'operators' | 'strings'>('intro');
  const [openOp, setOpenOp] = useState<string | null>('Aritméticos');

  const views = [
    { id: 'intro' as const, label: '🐍 Intro & Instalação' },
    { id: 'types' as const, label: '📦 Tipos de Dados' },
    { id: 'operators' as const, label: '⚙️ Operadores' },
    { id: 'strings' as const, label: '📝 Strings & f-strings' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setSection(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${section === v.id ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {section === 'intro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { t: 'Interpretada', d: 'Corre linha a linha, sem compilação prévia', e: '🔄' },
              { t: 'Dinamicamente Tipada', d: 'Tipos inferidos em runtime — sem declarar int/str', e: '🏷️' },
              { t: 'Garbage Collected', d: 'Memória gerida automaticamente', e: '🗑️' },
              { t: 'Cross-Platform', d: 'Mesmo código em Windows, macOS, Linux', e: '💻' },
              { t: 'Batteries Included', d: 'Biblioteca padrão cobre redes, I/O, datas, etc.', e: '🔋' },
              { t: 'Ecossistema Gigante', d: 'PyPI: +500.000 packages', e: '📦' },
            ].map(f => (
              <div key={f.t} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl mb-1">{f.e}</div>
                <div className="text-[12px] font-bold text-amber-300">{f.t}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{f.d}</div>
              </div>
            ))}
          </div>
          <Code code={`# Primeiro programa Python
name = "DevOps Shack"
year = 2024
print(f"Created by {name} in {year}")

# Python 2 vs 3 — usar sempre Python 3
python --version   # 3.12.x
python3 --version  # macOS / Linux`}
            output={`Created by DevOps Shack in 2024`} />
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest mb-2">Onde Python é usado em DevOps</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Automação', 'Ansible, scripts de CI/CD, deploy tools'],
                ['Cloud SDK', 'Boto3 (AWS), azure-sdk, google-cloud'],
                ['Infraestrutura', 'Pulumi IaC, inventários dinâmicos'],
                ['Monitoring', 'Exporters Prometheus, scripts de alertas'],
                ['Data Science', 'Pandas, NumPy para análise de logs'],
                ['Testing', 'pytest para infrastructure tests'],
              ].map(([k, v]) => (
                <div key={k} className="text-[11px]">
                  <span className="text-amber-300 font-bold">{k}:</span>
                  <span className="text-slate-400 ml-1">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'types' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {DATA_TYPES.map(d => (
              <div key={d.type} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <code className={`font-mono text-[13px] font-black w-20 shrink-0 ${d.color === 'sky' ? 'text-sky-300' : d.color === 'violet' ? 'text-violet-300' : d.color === 'emerald' ? 'text-emerald-300' : d.color === 'amber' ? 'text-amber-300' : d.color === 'teal' ? 'text-teal-300' : 'text-rose-300'}`}>{d.type}</code>
                <code className="font-mono text-[11px] text-slate-400 flex-1">{d.example}</code>
                <span className="text-[10px] text-slate-600 text-right shrink-0 max-w-[180px]">{d.note}</span>
              </div>
            ))}
          </div>
          <Code code={`# Type checking
x = 42
print(type(x))         # <class 'int'>
print(isinstance(x, int))  # True

# Type conversion
n = int("123")         # str → int
f = float("3.14")      # str → float
s = str(42)            # int → str
b = bool(0)            # int → bool (False)

# Multiple assignment
a, b, c = 1, 2, 3
x = y = z = 0          # all assigned 0

# f-strings (Python 3.6+)
name, age = "Alice", 30
print(f"{name} has {age} years")  # Alice has 30 years
print(f"{age * 2 = }")            # age * 2 = 60 (debug)`}
            output={`<class 'int'>
True
Alice has 30 years
age * 2 = 60`} />
        </div>
      )}

      {section === 'operators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {OPERATORS.map(g => (
            <div key={g.cat} className="rounded-2xl border border-slate-800 overflow-hidden">
              <button onClick={() => setOpenOp(openOp === g.cat ? null : g.cat)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 hover:bg-slate-800 transition-colors text-left">
                <span className="text-[13px] font-bold text-amber-300">{g.cat}</span>
                {openOp === g.cat ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
              </button>
              {openOp === g.cat && (
                <div className="p-3 bg-slate-950 space-y-1">
                  {g.ops.map(op => {
                    const [sym, ...rest] = op.split('  ');
                    return (
                      <div key={op} className="flex items-center gap-3">
                        <code className="font-mono text-[12px] font-bold text-amber-300 w-12 shrink-0">{sym}</code>
                        <span className="text-[11px] text-slate-400">{rest.join(' ')}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <Code code={`# Exemplos práticos
print(10 // 3)     # 3  (divisão inteira)
print(10 % 3)      # 1  (módulo/resto)
print(2 ** 10)     # 1024 (potência)
print(5 / 2)       # 2.5 (sempre float)

# Comparações encadeadas (Python permite!)
x = 5
print(1 < x < 10)  # True
print(1 < x < 4)   # False

# Walrus operator := (Python 3.8+)
import re
if m := re.search(r'\\d+', 'port 8080'):
    print(f"Port found: {m.group()}")`}
              output={`3
1
1024
2.5
True
False
Port found: 8080`} />
          </div>
        </div>
      )}

      {section === 'strings' && (
        <div className="space-y-3">
          <Code code={`# Strings são imutáveis
s = "Hello, Python!"
print(s.upper())          # HELLO, PYTHON!
print(s.lower())          # hello, python!
print(s.replace("Python", "World"))
print(s.split(", "))      # ['Hello', 'Python!']
print(s.strip())          # remove whitespace
print(s.startswith("Hi")) # False
print(len(s))             # 14
print(s[0:5])             # Hello
print(s[-7:])             # Python!

# f-strings são o padrão moderno
name, port, host = "nginx", 80, "localhost"
print(f"{name} on {host}:{port}")
print(f"Pi = {3.14159:.2f}")        # 2 decimais
print(f"Hex: {255:#x}")            # 0xff
print(f"{'padded':>10}")           # right-align

# Multiline strings
sql = """
    SELECT *
    FROM users
    WHERE active = True
"""

# Raw strings para regex e paths
path = r"C:\\Users\\admin\\Desktop"
pattern = r"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"`}
            output={`HELLO, PYTHON!
hello, python!
Hello, World!
['Hello', 'Python!']
Hello, Python!
False
14
Hello
Python!
nginx on localhost:80
Pi = 3.14
Hex: 0xff
    padded`} />
        </div>
      )}
    </div>
  );
}
