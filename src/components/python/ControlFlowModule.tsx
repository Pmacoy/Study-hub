import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function Code({ code, output }: { code: string; output?: string }) {
  const [copied, setCopied] = useState(false);
  const [showOut, setShowOut] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-[11px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-500">python</span>
        <div className="flex gap-2">
          {output && <button onClick={() => setShowOut(s => !s)} className="text-amber-400 text-[10px] hover:text-amber-300 font-semibold">{showOut ? '▼ output' : '▶ run'}</button>}
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        </div>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => {
          const kw = /^\s*(def|class|if|elif|else|for|while|try|except|finally|with|return|yield|import|from|lambda|pass|break|continue|raise|and|or|not)\b/.test(line);
          const comment = line.trim().startsWith('#');
          return <div key={i} className={comment ? 'text-slate-600' : kw ? 'text-violet-400' : 'text-slate-300'}>{line}</div>;
        })}
      </pre>
      {output && showOut && (
        <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <div className="text-[9px] text-amber-500 font-bold uppercase mb-1">Output:</div>
          <pre className="font-mono text-amber-300 text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}

function Challenge({ q, opts, answer, explanation }: { q: string; opts: string[]; answer: number; explanation: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
      <div className="text-[12px] font-bold text-amber-300">🧩 {q}</div>
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o, i) => {
          let cls = 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700';
          if (selected !== null) {
            if (i === answer) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
            else if (i === selected) cls = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
          }
          return (
            <button key={i} onClick={() => setSelected(i)} disabled={selected !== null}
              className={`p-2 rounded-xl border text-[11px] font-mono text-left transition-all ${cls}`}>{o}</button>
          );
        })}
      </div>
      {selected !== null && <p className="text-[11px] text-slate-400">{explanation}</p>}
    </div>
  );
}

export default function ControlFlowModule() {
  const [section, setSection] = useState<'control' | 'functions' | 'decorators' | 'scope'>('control');

  const views = [
    { id: 'control' as const, label: '🔀 if/for/while' },
    { id: 'functions' as const, label: '🔧 Funções & Lambda' },
    { id: 'decorators' as const, label: '🎨 Decoradores' },
    { id: 'scope' as const, label: '🔭 Scope LEGB' },
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

      {section === 'control' && (
        <div className="space-y-4">
          <Code code={`# if / elif / else
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print(f"Grade: {grade}")   # Grade: B

# Ternary (expressão condicional)
status = "pass" if score >= 60 else "fail"

# for com range
for i in range(5):          # 0, 1, 2, 3, 4
    print(i, end=" ")

# for com enumerate
fruits = ["apple", "banana", "cherry"]
for idx, fruit in enumerate(fruits):
    print(f"{idx}: {fruit}")

# for com zip
names = ["Alice", "Bob"]
scores = [95, 87]
for name, s in zip(names, scores):
    print(f"{name}: {s}")`}
            output={`Grade: B
0 1 2 3 4
0: apple
1: banana
2: cherry
Alice: 95
Bob: 87`} />
          <Code code={`# while + break/continue
count = 0
while count < 10:
    count += 1
    if count % 2 == 0:
        continue        # skip even
    if count > 7:
        break           # stop loop
    print(count, end=" ")
# Output: 1 3 5 7

# match / case (Python 3.10+)
status_code = 404
match status_code:
    case 200: print("OK")
    case 404: print("Not Found")
    case 500: print("Server Error")
    case _:   print("Unknown")`}
            output={`1 3 5 7
Not Found`} />
          <Challenge
            q='O que imprime range(2, 10, 3)?'
            opts={['[2, 5, 8]', '[2, 3, 4, 5, 6, 7, 8, 9]', '[2, 5, 8, 11]', '[3, 6, 9]']}
            answer={0}
            explanation='range(start, stop, step) → começa em 2, incrementa 3, para antes de 10: 2, 5, 8.' />
        </div>
      )}

      {section === 'functions' && (
        <div className="space-y-4">
          <Code code={`# 1. Básico
def greet(name):
    """Retorna saudação."""  # docstring
    return f"Hello, {name}!"

# 2. Valores default
def connect(host, port=5432, ssl=True):
    return f"{host}:{port} (ssl={ssl})"

# 3. *args — tuple de posicionais extras
def add(*numbers):
    return sum(numbers)
print(add(1, 2, 3, 4))       # 10

# 4. **kwargs — dict de keyword extras
def build_url(**params):
    return "&".join(f"{k}={v}" for k, v in params.items())
print(build_url(host="db", port=5432))

# 5. Type hints (Python 3.5+)
def multiply(a: int, b: int) -> int:
    return a * b`}
            output={`10
host=db&port=5432`} />
          <Code code={`# Lambda — função anónima de uma expressão
square   = lambda x: x ** 2
add      = lambda x, y: x + y
is_even  = lambda n: n % 2 == 0

print(square(5))          # 25
print(add(3, 4))          # 7

# Usar com sorted, map, filter
nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(nums))
print(sorted(nums, reverse=True))

# sorted por comprimento de string
words = ["banana", "kiwi", "apple", "fig"]
print(sorted(words, key=lambda w: len(w)))

# filter — retorna iterador com True
evens = list(filter(lambda n: n % 2 == 0, nums))
print(evens)

# map — aplica função a cada elemento
squares = list(map(lambda n: n**2, nums[:4]))
print(squares)`}
            output={`25
7
[1, 1, 2, 3, 4, 5, 6, 9]
[9, 6, 5, 4, 3, 2, 1, 1]
['fig', 'kiwi', 'apple', 'banana']
[4, 2, 6]
[9, 1, 16, 1]`} />
        </div>
      )}

      {section === 'decorators' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 leading-relaxed">
            Decoradores são funções que <span className="text-amber-300 font-bold">envolvem outra função</span> para adicionar comportamento sem modificar o código original. São fundamentais em frameworks como Flask, FastAPI e em testes.
          </div>
          <Code code={`import time
import functools

# Decorador básico
def timer(func):
    @functools.wraps(func)   # preserva __name__ e __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    time.sleep(0.1)
    return a + b

print(slow_add(2, 3))

# Decorador com parâmetros
def retry(max_attempts=3, delay=1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempt} failed: {e}")
                    if attempt < max_attempts:
                        time.sleep(delay)
            raise RuntimeError("All attempts failed")
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unstable_api_call():
    raise ConnectionError("Timeout")`}
            output={`slow_add took 0.1012s
5`} />
          <Challenge
            q='Qual o propósito de @functools.wraps(func)?'
            opts={['Acelerar a função', 'Preservar o nome e docstring da função original', 'Tornar a função assíncrona', 'Adicionar type hints']}
            answer={1}
            explanation='Sem @functools.wraps, o wrapper substituiria __name__, __doc__ etc. da função original, dificultando debugging.' />
        </div>
      )}

      {section === 'scope' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'L — Local', d: 'Dentro da função actual', c: 'violet' },
              { l: 'E — Enclosing', d: 'Funções externas (closures)', c: 'sky' },
              { l: 'G — Global', d: 'Nível do módulo', c: 'amber' },
              { l: 'B — Built-in', d: 'print, len, range…', c: 'emerald' },
            ].map(s => (
              <div key={s.l} className={`p-3 rounded-xl border text-center ${s.c === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : s.c === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : s.c === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : 'border-emerald-500/30 bg-emerald-500/8'}`}>
                <div className={`text-[11px] font-black ${s.c === 'violet' ? 'text-violet-300' : s.c === 'sky' ? 'text-sky-300' : s.c === 'amber' ? 'text-amber-300' : 'text-emerald-300'}`}>{s.l}</div>
                <div className="text-[10px] text-slate-500 mt-1">{s.d}</div>
              </div>
            ))}
          </div>
          <Code code={`x = "global"              # G — Global

def outer():
    x = "enclosing"       # E — Enclosing

    def inner():
        x = "local"       # L — Local
        print(x)          # local

    inner()
    print(x)              # enclosing

outer()
print(x)                  # global

# global keyword
counter = 0
def increment():
    global counter
    counter += 1

increment()
increment()
print(counter)            # 2

# Closure — captura o enclosing scope
def make_multiplier(factor):
    def multiply(n):
        return n * factor   # factor é "closed over"
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5))   # 10
print(triple(5))   # 15`}
            output={`local
enclosing
global
2
10
15`} />
        </div>
      )}
    </div>
  );
}
