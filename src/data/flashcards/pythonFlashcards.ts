import type { Flashcard } from '../../types/flashcard';

const raw: Omit<Flashcard, 'id' | 'domain'>[] = [
  // Fundamentos
  { category: 'Fundamentos', front: 'Python: Interpretada vs Compilada', back: 'Python é interpretada — corre linha a linha sem compilação prévia. Mais lento em CPU-bound, mas deployment instantâneo e REPL interactivo.' },
  { category: 'Fundamentos', front: 'Tipagem dinâmica em Python', back: 'Os tipos são inferidos em runtime, não declarados. x = 42 é int; x = "hello" é str. Usa type hints para clareza e análise estática.' },
  { category: 'Fundamentos', front: 'f-string (Python 3.6+)', back: 'f"{variavel:.2f}" — interpolação directa de expressões Python. Mais rápido que .format() e legível. Usa {val = } para debug.' },
  { category: 'Fundamentos', front: 'Walrus operator :=', back: 'if m := re.search(r"\\d+", s): — avalia e atribui numa expressão. Evita chamar a função duas vezes.' },

  // Tipos de dados
  { category: 'Tipos', front: 'list vs tuple', back: 'list é mutável, tuple é imutável. Tuples são mais rápidas para acesso e podem ser chaves de dict. Usa tuple para dados que não devem mudar.' },
  { category: 'Tipos', front: 'set — complexidade de lookup', back: 'O(1) médio — hash map internamente. Muito mais rápido que list para "x in collection". Ideal para memberships e remoção de duplicados.' },
  { category: 'Tipos', front: 'dict — ordered desde quando?', back: 'Desde Python 3.7, dicts mantêm a ordem de inserção. Antes disso, a ordem era indefinida.' },
  { category: 'Tipos', front: 'List comprehension vs loop', back: '[x**2 for x in range(10)] é mais rápido que append em loop e mais legível. Prefere comprehension para transformações simples.' },

  // Funções
  { category: 'Funções', front: '*args e **kwargs', back: '*args captura posicionais extra como tuple. **kwargs captura keyword extras como dict. def f(*args, **kwargs) aceita qualquer combinação.' },
  { category: 'Funções', front: 'Decorador — para que serve?', back: 'Envolve uma função para adicionar comportamento (logging, retry, timer, auth) sem alterar o código original. @functools.wraps preserva o __name__.' },
  { category: 'Funções', front: 'Lambda vs def', back: 'Lambda: função anónima de uma expressão. def: função nomeada com corpo completo. Usa lambda com sorted/map/filter; def para tudo o resto.' },
  { category: 'Funções', front: 'LEGB — scope lookup order', back: 'Local → Enclosing → Global → Built-in. Python procura o nome nesta ordem. global e nonlocal permitem modificar scopes exteriores.' },

  // OOP
  { category: 'OOP', front: '@classmethod vs @staticmethod', back: '@classmethod recebe cls (pode criar instâncias). @staticmethod não recebe self nem cls — é apenas uma função namespaced na classe.' },
  { category: 'OOP', front: '__str__ vs __repr__', back: '__str__: legível para humanos (usado em print). __repr__: desambíguo para debugging (idealmente código que recria o objecto).' },
  { category: 'OOP', front: '@dataclass', back: 'Python 3.7+: gera __init__, __repr__, __eq__ automaticamente a partir de anotações de tipo. Reduz boilerplate em classes de dados.' },
  { category: 'OOP', front: 'Context manager — __enter__/__exit__', back: 'Protocolo para "with" statement. __enter__ retorna o recurso, __exit__ faz o cleanup mesmo que haja excepção.' },

  { category: 'Ficheiros', front: 'Porque usar "with open()" ?', back: 'with garante que o ficheiro é fechado automaticamente mesmo se ocorrer uma excepção — equivalente a try/finally com f.close().' },
  { category: 'Ficheiros', front: 'json.load() vs json.loads()', back: 'json.load(f) lê de um file object. json.loads(s) parse de uma string. Análogo: json.dump(data, f) vs json.dumps(data).' },
  { category: 'Ficheiros', front: 'pathlib.Path vs os.path', back: 'pathlib é mais legível e orientado a objectos. Path("/app") / "config.json" funciona em qualquer OS. Prefere pathlib em código novo.' },

  { category: 'Avançado', front: 'Generator vs lista — memória', back: 'Generator (yield) computa cada valor a pedido — usa ~200 bytes mesmo para 10M elementos. Lista materializa tudo em memória (~80MB para 10M ints).' },
  { category: 'Avançado', front: 'async/await — quando usar?', back: 'I/O bound concurrente: múltiplas chamadas HTTP, BD, ficheiros em paralelo. Não ajuda em CPU-bound (usar multiprocessing em vez disso).' },
  { category: 'Avançado', front: 'Type hint: Optional[str]', back: 'Equivale a str | None (Python 3.10+). Indica que o valor pode ser None. Ferramentas como mypy detectam erros de tipo estáticamente.' },

  { category: 'DevOps', front: 'requests.raise_for_status()', back: 'Lança HTTPError automaticamente para respostas 4xx/5xx. Evita verificar manualmente response.status_code.' },
  { category: 'DevOps', front: 'subprocess.run() — check=True', back: 'Lança CalledProcessError se o comando retornar código de saída != 0. Essencial em scripts de deploy para detectar falhas.' },
  { category: 'DevOps', front: 'argparse vs sys.argv', back: 'argparse gera --help automático, valida tipos, suporta choices e defaults. sys.argv é apenas a lista raw de strings. Usa sempre argparse em CLIs.' },
  { category: 'DevOps', front: 'pytest — @pytest.fixture', back: 'Setup/teardown reutilizável injectado por nome nos testes. yield divide setup (antes) de teardown (depois). Scope: function/class/module/session.' },
  { category: 'DevOps', front: 'unittest.mock.patch', back: 'Substitui um objecto por um MagicMock durante o teste — ideal para mockar boto3, requests, subprocess sem chamar serviços reais.' },
];

export const pythonFlashcards: Flashcard[] = raw.map((c, i) => ({
  ...c,
  id: `python-${i}`,
  domain: 'python' as const,
}));
