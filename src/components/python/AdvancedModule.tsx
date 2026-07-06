import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function Code({ code, output }: { code: string; output?: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-[11px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-500">python</span>
        <div className="flex gap-2">
          {output && <button onClick={() => setShow(s => !s)} className="text-amber-400 text-[10px] hover:text-amber-300 font-semibold">{show ? '▼ hide' : '▶ run'}</button>}
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        </div>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^\s*(async |await |def |class |import |from |yield |return |for |if |while |with )\b/.test(line) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
      {output && show && (
        <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <pre className="font-mono text-amber-300 text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default function AdvancedModule() {
  const [section, setSection] = useState<'generators' | 'modules' | 'async' | 'typing'>('generators');

  const views = [
    { id: 'generators' as const, label: '⚡ Generators & Iterators' },
    { id: 'modules' as const, label: '📦 Módulos & Packages' },
    { id: 'async' as const, label: '🔄 async/await' },
    { id: 'typing' as const, label: '🏷️ Type Hints' },
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

      {section === 'generators' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
              <div className="text-[10px] font-black text-rose-400 uppercase mb-1">Lista (Memória toda)</div>
              <code className="text-[11px] font-mono text-slate-300">squares_list(10_000_000)</code>
              <div className="text-[11px] text-rose-300 mt-1 font-bold">≈ 80 MB de RAM</div>
            </div>
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">Generator (Lazy)</div>
              <code className="text-[11px] font-mono text-slate-300">squares_gen(10_000_000)</code>
              <div className="text-[11px] text-emerald-300 mt-1 font-bold">≈ 200 bytes de RAM</div>
            </div>
          </div>
          <Code code={`# Generator function — yield pausa e retorna
def squares_gen(n):
    for x in range(n):
        yield x ** 2   # pausa aqui, retoma depois

# Uso idêntico a uma lista
for sq in squares_gen(5):
    print(sq, end=" ")   # 0 1 4 9 16

# Generator expression (parênteses em vez de [])
gen = (x**2 for x in range(1_000_000))
print(next(gen))   # 0 — só calcula este valor
print(next(gen))   # 1
print(next(gen))   # 4

# Pipeline de generators — cada stage processa 1 linha
def read_logs(filename):
    with open(filename) as f:
        for line in f:
            yield line.strip()

def filter_errors(lines):
    for line in lines:
        if "ERROR" in line:
            yield line

def parse(lines):
    for line in lines:
        parts = line.split("|")
        yield {"ts": parts[0], "msg": parts[1]}

# Nenhum stage materializa tudo em memória!
# errors = parse(filter_errors(read_logs("app.log")))`}
            output={`0 1 4 9 16
0
1
4`} />
          <Code code={`# Classe Iterator customizada
class CountDown:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

for n in CountDown(5):
    print(n, end=" ")   # 5 4 3 2 1

# itertools — ferramentas de iteração eficientes
from itertools import islice, chain, cycle, product

# Tomar só os primeiros N de um generator
first5 = list(islice(squares_gen(1000), 5))
print(first5)    # [0, 1, 4, 9, 16]`}
            output={`5 4 3 2 1
[0, 1, 4, 9, 16]`} />
        </div>
      )}

      {section === 'modules' && (
        <div className="space-y-4">
          <Code code={`# Módulos da stdlib mais usados em DevOps
import os           # sistema operativo, env vars
import sys          # argv, path, versão
import subprocess   # executar comandos shell
import json         # parse/gera JSON
import re           # expressões regulares
import logging      # logs estruturados
import argparse     # CLI tools
import datetime     # datas e tempos
import time         # sleep, timestamps
import requests     # HTTP (pip install)
import boto3        # AWS SDK (pip install)

# Variáveis de ambiente
db_host = os.environ.get("DB_HOST", "localhost")
db_port = int(os.getenv("DB_PORT", "5432"))

# Executar comandos
result = subprocess.run(
    ["kubectl", "get", "pods", "-n", "prod"],
    capture_output=True,
    text=True,
    check=True  # raises on non-zero exit
)
print(result.stdout)`}
            output={`NAME                    READY   STATUS
app-deployment-xyz123   1/1     Running`} />
          <Code code={`# Logging — muito melhor que print()
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    handlers=[
        logging.StreamHandler(),         # console
        logging.FileHandler("app.log"),  # ficheiro
    ]
)

logger = logging.getLogger(__name__)

logger.debug("Não aparece em INFO")
logger.info("Servidor iniciado na porta 8080")
logger.warning("Disco a 80% de capacidade")
logger.error("Falha ao conectar ao DB")
logger.critical("Sistema em estado inválido!")`}
            output={`2024-01-15 10:30:01 INFO __main__ — Servidor iniciado na porta 8080
2024-01-15 10:30:01 WARNING __main__ — Disco a 80% de capacidade`} />
        </div>
      )}

      {section === 'async' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400 leading-relaxed">
            <span className="text-amber-300 font-bold">async/await</span> permite executar operações I/O (HTTP, BD, ficheiros) em paralelo sem bloqueio. Ideal para microserviços, scrapers, e clients de API.
            <br /><br />
            <span className="text-sky-300 font-bold">Threading</span> — melhor para I/O bound (múltiplas requests simultâneas) · <span className="text-violet-300 font-bold">Multiprocessing</span> — melhor para CPU bound (cálculos pesados)
          </div>
          <Code code={`import asyncio
import aiohttp   # pip install aiohttp

# Coroutine — função async retorna coroutine object
async def fetch_url(session, url: str) -> dict:
    async with session.get(url, timeout=10) as resp:
        return {"url": url, "status": resp.status}

# Executar múltiplas requests em paralelo
async def check_services(urls: list[str]):
    async with aiohttp.ClientSession() as session:
        # asyncio.gather executa todas em paralelo!
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

urls = [
    "https://api.github.com",
    "https://api.docker.com",
    "https://kubernetes.io",
]

# Vs. requests síncrono: 3 requests × 0.5s = 1.5s
# Com async: todas em paralelo      ≈ 0.5s
results = asyncio.run(check_services(urls))
for r in results:
    print(f"  {r['status']} — {r['url']}")`}
            output={`200 — https://api.github.com
200 — https://api.docker.com
200 — https://kubernetes.io`} />
        </div>
      )}

      {section === 'typing' && (
        <div className="space-y-4">
          <Code code={`# Type hints — documentação + ferramentas (mypy)
from typing import Optional, Union, List, Dict, Any

# Básico
def greet(name: str, times: int = 1) -> str:
    return (name + "\\n") * times

# Optional — pode ser None
def find_user(user_id: int) -> Optional[dict]:
    pass

# Union (Python 3.10+: usar X | Y)
def process(value: int | str) -> str:
    return str(value)

# Colecções
def get_ips(env: str) -> List[str]:
    return ["10.0.0.1", "10.0.0.2"]

# TypedDict — dict com tipos definidos
from typing import TypedDict

class ServerConfig(TypedDict):
    host: str
    port: int
    ssl: bool

# Callable
from typing import Callable
def apply_twice(f: Callable[[int], int], x: int) -> int:
    return f(f(x))

print(apply_twice(lambda n: n * 2, 3))  # 12`}
            output={`12`} />
          <div className="grid grid-cols-2 gap-3">
            {[
              { t: 'Vantagens', c: 'emerald', items: ['IDEs mostram erros em tempo real', 'mypy valida tipos antes de executar', 'Documentação automática (FastAPI)', 'Refactoring mais seguro'] },
              { t: 'Ferramentas', c: 'sky', items: ['mypy — verificador de tipos estático', 'pyright — Microsoft (usado no Pylance)', 'beartype — verificação em runtime', 'pydantic — validação com type hints'] },
            ].map(g => (
              <div key={g.t} className={`p-4 rounded-2xl border ${g.c === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-sky-500/20 bg-sky-500/5'}`}>
                <div className={`text-[11px] font-black uppercase tracking-widest mb-2 ${g.c === 'emerald' ? 'text-emerald-400' : 'text-sky-400'}`}>{g.t}</div>
                {g.items.map(i => <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400 py-0.5"><span className={`${g.c === 'emerald' ? 'text-emerald-400' : 'text-sky-400'} shrink-0`}>·</span>{i}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
