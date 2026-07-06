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
          {output && <button onClick={() => setShowOut(s => !s)} className="text-amber-400 text-[10px] hover:text-amber-300 font-semibold">{showOut ? '▼ hide' : '▶ run'}</button>}
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        </div>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^\s*(def|for|if|while|return|class|import)\b/.test(line) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
      {output && showOut && (
        <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <pre className="font-mono text-amber-300 text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}

const STRUCTURES = [
  { name: 'list', icon: '📋', mutable: true, ordered: true, duplicates: true, color: 'sky', use: 'Sequências ordenadas que mudam com frequência' },
  { name: 'tuple', icon: '🔒', mutable: false, ordered: true, duplicates: true, color: 'violet', use: 'Dados imutáveis, retorno múltiplo, dict keys' },
  { name: 'set', icon: '🎯', mutable: true, ordered: false, duplicates: false, color: 'emerald', use: 'Elementos únicos, operações de conjunto' },
  { name: 'dict', icon: '🗺️', mutable: true, ordered: true, duplicates: false, color: 'amber', use: 'Mapeamento chave→valor (hash map)' },
];

export default function DataStructuresModule() {
  const [ds, setDs] = useState<'list' | 'tuple' | 'set' | 'dict' | 'comprehensions'>('list');

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-5 bg-slate-900 text-[10px] font-black uppercase text-slate-500 divide-x divide-slate-800">
          {['Tipo', 'Mutável', 'Ordenado', 'Duplicados', 'Quando usar'].map(h => (
            <div key={h} className="px-3 py-2">{h}</div>
          ))}
        </div>
        {STRUCTURES.map(s => (
          <button key={s.name} onClick={() => setDs(s.name as any)}
            className={`w-full grid grid-cols-5 divide-x divide-slate-800/50 border-t border-slate-800/50 text-[11px] text-left transition-all hover:bg-slate-900 ${ds === s.name ? 'bg-slate-900' : ''}`}>
            <div className={`px-3 py-2 font-mono font-black ${s.color === 'sky' ? 'text-sky-300' : s.color === 'violet' ? 'text-violet-300' : s.color === 'emerald' ? 'text-emerald-300' : 'text-amber-300'}`}>
              {s.icon} {s.name}
            </div>
            <div className={`px-3 py-2 ${s.mutable ? 'text-emerald-400' : 'text-rose-400'}`}>{s.mutable ? '✓ sim' : '✗ não'}</div>
            <div className={`px-3 py-2 ${s.ordered ? 'text-emerald-400' : 'text-slate-500'}`}>{s.ordered ? '✓ sim' : '✗ não'}</div>
            <div className={`px-3 py-2 ${s.duplicates ? 'text-emerald-400' : 'text-rose-400'}`}>{s.duplicates ? '✓ sim' : '✗ não'}</div>
            <div className="px-3 py-2 text-slate-400">{s.use}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {[...STRUCTURES.map(s => ({ id: s.name, label: `${s.icon} ${s.name}` })),
          { id: 'comprehensions', label: '⚡ Comprehensions' }
        ].map(v => (
          <button key={v.id} onClick={() => setDs(v.id as any)}
            className={`px-3 py-1.5 rounded-2xl text-[12px] font-semibold transition-all ${ds === v.id ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {ds === 'list' && (
        <Code code={`# Criar e aceder
nums = [1, 2, 3, 4, 5]
print(nums[0])      # 1  (primeiro)
print(nums[-1])     # 5  (último)
print(nums[1:4])    # [2, 3, 4] (slice)
print(nums[::2])    # [1, 3, 5] (cada 2)
print(nums[::-1])   # [5, 4, 3, 2, 1] (reverso)

# Métodos essenciais
lst = [3, 1, 4, 1, 5, 9]
lst.append(7)          # adiciona ao fim
lst.insert(0, 0)       # insere na posição
lst.extend([8, 9])     # adiciona múltiplos
lst.remove(1)          # remove 1ª ocorrência
popped = lst.pop()     # remove e retorna último
lst.sort()             # ordena in-place
lst.sort(reverse=True) # ordena decrescente
lst2 = lst.copy()      # cópia superficial
lst.clear()            # limpa a lista

# Built-ins úteis
nums = [4, 2, 9, 1, 7]
print(len(nums))       # 5
print(sum(nums))       # 23
print(min(nums))       # 1
print(max(nums))       # 9
print(sorted(nums))    # novo lista ordenada`}
          output={`1
5
[2, 3, 4]
[1, 3, 5]
[5, 4, 3, 2, 1]
5
23
1
9
[1, 2, 4, 7, 9]`} />
      )}

      {ds === 'tuple' && (
        <Code code={`# Tuples são imutáveis — mais rápidas para acesso
point = (10, 20)
x, y = point     # unpacking
print(f"x={x}, y={y}")

# Tuple com 1 elemento — precisa de vírgula!
single = (42,)   # é tuple
not_tuple = (42) # é int!

# Named tuples (legibilidade sem classe)
from collections import namedtuple
Point3D = namedtuple("Point3D", ["x", "y", "z"])
p = Point3D(1, 2, 3)
print(p.x, p.y, p.z)
print(p._asdict())

# Retorno múltiplo de funções usa tuple
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([5, 3, 8, 1, 9])
print(f"min={lo}, max={hi}")

# Tuples como chaves de dict
cache = {}
cache[(0, 0)] = "origem"
cache[(1, 2)] = "ponto A"
print(cache[(0, 0)])`}
          output={`x=10, y=20
1 2 3
{'x': 1, 'y': 2, 'z': 3}
min=1, max=9
origem`} />
      )}

      {ds === 'set' && (
        <Code code={`# Sets — elementos únicos, sem ordem
primes = {2, 3, 5, 7, 11}
odds   = {1, 3, 5, 7, 9}

# Operações de conjunto
print(primes | odds)   # união (|)
print(primes & odds)   # intersecção (&)
print(primes - odds)   # diferença (-)
print(primes ^ odds)   # diferença simétrica

# Remover duplicados de uma lista
ips_with_dups = ["1.2.3.4", "5.6.7.8", "1.2.3.4"]
unique_ips = list(set(ips_with_dups))
print(unique_ips)

# Verificar pertença O(1) — muito mais rápido que list!
allowed = {"admin", "deployer", "monitor"}
user = "admin"
if user in allowed:
    print(f"{user} has access")

# frozenset — imutável (pode ser chave de dict)
immutable = frozenset(["a", "b", "c"])`}
          output={`{1, 2, 3, 5, 7, 9, 11}
{3, 5, 7}
{2, 11}
{1, 2, 9, 11}
['5.6.7.8', '1.2.3.4']
admin has access`} />
      )}

      {ds === 'dict' && (
        <Code code={`# Dicionários — hash maps O(1)
config = {
    "host": "localhost",
    "port": 5432,
    "ssl": True,
    "tags": ["db", "prod"]
}

# Acesso
print(config["host"])
print(config.get("timeout", 30))  # default se não existir

# Modificação
config["password"] = "secret"
config.update({"port": 3306, "charset": "utf8"})

# Iteração
for key, value in config.items():
    print(f"  {key}: {value}")

# Dict comprehension
squares = {n: n**2 for n in range(1, 6)}
print(squares)

# defaultdict — sem KeyError
from collections import defaultdict
word_count = defaultdict(int)
for word in "to be or not to be".split():
    word_count[word] += 1
print(dict(word_count))

# Merge dicts (Python 3.9+)
defaults = {"timeout": 30, "retries": 3}
overrides = {"timeout": 60}
merged = defaults | overrides
print(merged)`}
          output={`localhost
30
{'timeout': 60, 'retries': 3, 'charset': 'utf8', ...}
{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
{'to': 2, 'be': 2, 'or': 1, 'not': 1}
{'timeout': 60, 'retries': 3}`} />
      )}

      {ds === 'comprehensions' && (
        <div className="space-y-3">
          <Code code={`# List Comprehension — mais pythónico que loops
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
upper   = [s.upper() for s in ["hello", "world"]]

# Nested comprehension — flatmap
matrix = [[1,2,3],[4,5,6],[7,8,9]]
flat = [n for row in matrix for n in row]
print(flat)

# Dict Comprehension
inv = {"a": 1, "b": 2, "c": 3}
rev = {v: k for k, v in inv.items()}
print(rev)

# Set Comprehension
words = ["hello", "world", "hello", "python"]
unique_lens = {len(w) for w in words}
print(unique_lens)

# Generator Expression — lazy, usa memória mínima
gen = (x**2 for x in range(1_000_000))
print(next(gen))   # 0 — só calcula este
print(next(gen))   # 1
print(sum(x for x in range(101)))  # 5050`}
            output={`[1, 2, 3, 4, 5, 6, 7, 8, 9]
{1: 'a', 2: 'b', 3: 'c'}
{5, 6}
0
1
5050`} />
        </div>
      )}
    </div>
  );
}
