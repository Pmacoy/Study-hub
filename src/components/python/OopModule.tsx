import { useState } from 'react';
import { Copy, Check, Shield } from 'lucide-react';

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
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^\s*(class|def|if|for|try|except|finally|with|return|raise|import|from|super)\b/.test(line) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
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

export default function OopModule() {
  const [section, setSection] = useState<'classes' | 'inheritance' | 'fileio' | 'exceptions'>('classes');

  const views = [
    { id: 'classes' as const, label: '🏛️ Classes & OOP' },
    { id: 'inheritance' as const, label: '👪 Herança & Dunder' },
    { id: 'fileio' as const, label: '📁 File I/O & JSON' },
    { id: 'exceptions' as const, label: '🚨 Excepções' },
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

      {section === 'classes' && (
        <div className="space-y-4">
          <Code code={`class Dog:
    """Representa um cão."""
    species = "Canis lupus"  # atributo de classe (partilhado)

    def __init__(self, name: str, age: int):
        # Atributos de instância (únicos por objecto)
        self.name = name
        self.age  = age

    def bark(self) -> str:
        return f"{self.name} says: Woof!"

    def __str__(self) -> str:     # print(dog)
        return f"Dog({self.name}, age={self.age})"

    def __repr__(self) -> str:    # debugging
        return f"Dog(name={self.name!r}, age={self.age!r})"

    @classmethod
    def from_birth_year(cls, name: str, year: int) -> "Dog":
        """Factory method — cria Dog a partir do ano de nascimento."""
        return cls(name, 2024 - year)

    @staticmethod
    def is_adult(age: int) -> bool:
        """Não precisa de self nem cls."""
        return age >= 2

rex   = Dog("Rex",   3)
buddy = Dog("Buddy", 5)
print(rex.bark())
print(buddy)
print(repr(rex))
print(Dog.species)
print(Dog.is_adult(1))    # False`}
            output={`Rex says: Woof!
Dog(Buddy, age=5)
Dog(name='Rex', age=3)
Canis lupus
False`} />

          <Code code={`# Dataclasses (Python 3.7+) — menos boilerplate
from dataclasses import dataclass, field
from typing import List

@dataclass
class ServerConfig:
    host: str
    port: int = 5432
    ssl: bool = True
    tags: List[str] = field(default_factory=list)

    def connection_string(self) -> str:
        proto = "https" if self.ssl else "http"
        return f"{proto}://{self.host}:{self.port}"

db = ServerConfig("prod.db.com", tags=["db", "prod"])
print(db)
print(db.connection_string())

# Gera automaticamente __init__, __repr__, __eq__!`}
            output={`ServerConfig(host='prod.db.com', port=5432, ssl=True, tags=['db', 'prod'])
https://prod.db.com:5432`} />
        </div>
      )}

      {section === 'inheritance' && (
        <div className="space-y-4">
          <Code code={`class Animal:
    def __init__(self, name: str, sound: str):
        self.name  = name
        self.sound = sound

    def speak(self) -> str:
        return f"{self.name} says {self.sound}"

class Dog(Animal):
    def __init__(self, name: str, breed: str):
        super().__init__(name, "Woof")  # chama parent
        self.breed = breed

    def speak(self) -> str:  # override
        return f"{self.name} ({self.breed}): {self.sound}!"

class Cat(Animal):
    def __init__(self, name: str, indoor: bool = True):
        super().__init__(name, "Meow")
        self.indoor = indoor

dog = Dog("Rex", "German Shepherd")
cat = Cat("Whiskers")
print(dog.speak())
print(cat.speak())
print(isinstance(dog, Animal))   # True — herança!
print(isinstance(dog, Cat))      # False`}
            output={`Rex (German Shepherd): Woof!!
Whiskers says Meow
True
False`} />
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-black text-amber-300 mb-2">Dunder Methods Essenciais</div>
              {[
                ['__init__', 'Construtor'],
                ['__str__', 'print(obj)'],
                ['__repr__', 'repr(obj) / debug'],
                ['__len__', 'len(obj)'],
                ['__eq__', 'obj == other'],
                ['__lt__', 'obj < other (sorted!)'],
                ['__add__', 'obj + other'],
                ['__contains__', 'x in obj'],
                ['__iter__', 'for x in obj'],
                ['__enter__/__exit__', 'with obj:'],
              ].map(([m, d]) => (
                <div key={m} className="flex gap-2 py-0.5">
                  <code className="font-mono text-[10px] text-violet-300 shrink-0 w-28">{m}</code>
                  <span className="text-[10px] text-slate-500">{d}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-[11px] font-black text-amber-300 mb-2">Princípios OOP</div>
              {[
                ['Encapsulação', 'Esconder estado interno com _private / __dunder'],
                ['Herança', 'Reutilizar código via parent class'],
                ['Polimorfismo', 'Mesma interface, comportamentos diferentes'],
                ['Abstracção', 'ABC: forçar métodos nas subclasses'],
              ].map(([p, d]) => (
                <div key={p} className="py-1 border-b border-slate-800 last:border-0">
                  <div className="text-[11px] font-semibold text-sky-300">{p}</div>
                  <div className="text-[10px] text-slate-500">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'fileio' && (
        <div className="space-y-4">
          <Code code={`# Ler ficheiro — sempre usar with (fecha automaticamente)
with open("log.txt", "r", encoding="utf-8") as f:
    content = f.read()          # todo o conteúdo
    # OU
    lines = f.readlines()       # lista de linhas
    # OU
    for line in f:              # iteração lazy (melhor para ficheiros grandes)
        print(line.strip())

# Escrever
with open("output.txt", "w") as f:
    f.write("Hello\\n")
    f.writelines(["line1\\n", "line2\\n"])

# JSON — muito usado em DevOps
import json

# Ler configuração
with open("config.json") as f:
    config = json.load(f)
print(config["database"]["host"])

# Escrever config
data = {"server": "prod", "replicas": 3, "tags": ["blue"]}
with open("deploy.json", "w") as f:
    json.dump(data, f, indent=2)

# String ↔ JSON
json_str = json.dumps(data, indent=2)  # dict → str
parsed   = json.loads(json_str)        # str → dict`}
            output={`Hello
prod`} />
          <Code code={`# pathlib — moderno e mais legível que os.path
from pathlib import Path

# Criar paths
home    = Path.home()
project = Path("/app/config")
config  = project / "settings.json"  # / para juntar

print(config.exists())
print(config.suffix)    # .json
print(config.stem)      # settings
print(config.parent)    # /app/config

# Listar ficheiros
for f in Path("/var/log").glob("*.log"):
    print(f.name, f.stat().st_size)

# Ler/escrever directamente
Path("output.txt").write_text("Hello!")
content = Path("output.txt").read_text()

# Criar directórios
Path("logs/2024").mkdir(parents=True, exist_ok=True)`}
            output={`True
.json
settings
/app/config`} />
        </div>
      )}

      {section === 'exceptions' && (
        <div className="space-y-4">
          <Code code={`# try / except / else / finally
def read_config(path: str) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Config not found: {path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Invalid JSON: {e}")
        return {}
    except Exception as e:        # catch-all (cuidado!)
        print(f"Unexpected: {e}")
        raise                     # re-raise para não engolir
    else:
        # Corre apenas se NÃO houve excepção
        print("Config loaded successfully")
    finally:
        # Corre SEMPRE — cleanup
        print("Attempt complete")`}
            output={`Config not found: missing.json
Attempt complete`} />
          <Code code={`# Excepções customizadas
class ConfigError(Exception):
    """Erro de configuração da aplicação."""
    pass

class NetworkError(Exception):
    def __init__(self, host: str, port: int, msg: str = ""):
        self.host = host
        self.port = port
        super().__init__(f"Cannot reach {host}:{port} — {msg}")

# Context manager customizado
class TempDir:
    def __init__(self, prefix="tmp"):
        self.prefix = prefix
        self.path = None

    def __enter__(self):
        import tempfile
        self.path = tempfile.mkdtemp(prefix=self.prefix)
        return self.path

    def __exit__(self, exc_type, exc_val, exc_tb):
        import shutil
        shutil.rmtree(self.path, ignore_errors=True)
        return False  # re-raise excepções

# Uso:
with TempDir("deploy-") as d:
    print(f"Working in {d}")
    # ficheiros limpos automaticamente`}
            output={`Working in /tmp/deploy-abc123`} />
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={13} className="text-rose-400" />
              <div className="text-[11px] font-black text-rose-400 uppercase">Excepções Built-in mais Comuns</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['ValueError', 'Valor inválido: int("abc")'],
                ['TypeError', 'Tipo errado: "a" + 1'],
                ['KeyError', 'Chave inexistente em dict'],
                ['IndexError', 'Índice fora do range da list'],
                ['FileNotFoundError', 'Ficheiro não existe'],
                ['AttributeError', 'Atributo não existe no objecto'],
                ['ImportError', 'Módulo não encontrado'],
                ['StopIteration', 'Iterador esgotado'],
              ].map(([e, d]) => (
                <div key={e} className="flex gap-2 text-[11px]">
                  <code className="font-mono text-rose-300 shrink-0 text-[10px]">{e}</code>
                  <span className="text-slate-500">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
