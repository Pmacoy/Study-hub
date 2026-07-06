import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const QUESTIONS = [
  { q: 'Qual a diferença entre uma lista e uma tuple em Python?', opts: ['Não há diferença, são sinónimos', 'Lista é mutável; tuple é imutável', 'Tuple é mutável; lista é imutável', 'Lista só guarda números; tuple guarda qualquer tipo'], a: 1, exp: 'Listas podem ser modificadas após criação (append, remove, etc.). Tuples são imutáveis — uma vez criadas, não podem mudar. Por isso tuples podem ser chaves de dict.', mod: 'Data Structures' },
  { q: 'O que faz o operador // em Python?', opts: ['Comentário de linha', 'Divisão float', 'Divisão inteira (floor division)', 'Potenciação'], a: 2, exp: '// é a divisão inteira — descarta a parte decimal. 10 // 3 = 3. Para divisão normal usa-se /, que retorna sempre float.', mod: 'Fundamentos' },
  { q: 'Qual a vantagem principal de um generator sobre uma lista para um conjunto de 10 milhões de elementos?', opts: ['Generators são sempre mais rápidos a processar', 'Generators usam muito menos memória — computam valores lazy, um de cada vez', 'Generators suportam mais operações que listas', 'Não há vantagem real'], a: 1, exp: 'Generators computam cada valor sob demanda (yield), sem armazenar tudo em memória. Uma lista de 10M quadrados usa ~80MB; um generator equivalente usa ~200 bytes.', mod: 'Avançado' },
  { q: 'O que faz o decorador @functools.wraps(func) num wrapper?', opts: ['Acelera a execução da função', 'Preserva o __name__ e __doc__ da função original', 'Converte a função em assíncrona', 'Adiciona logging automático'], a: 1, exp: 'Sem @functools.wraps, o wrapper substitui os metadados (nome, docstring) da função original, dificultando debugging e introspecção.', mod: 'Control Flow' },
  { q: 'Qual o resultado de list(range(2, 10, 3))?', opts: ['[2, 5, 8]', '[2, 3, 4, 5, 6, 7, 8, 9]', '[2, 5, 8, 11]', '[3, 6, 9]'], a: 0, exp: 'range(start, stop, step) começa em 2, incrementa 3, e pára antes de chegar a 10: resulta em [2, 5, 8].', mod: 'Control Flow' },
  { q: 'Em Python, qual a regra de scope LEGB?', opts: ['Local → Enclosing → Global → Built-in, ordem de procura de variáveis', 'Apenas se aplica a classes', 'Define a ordem de execução de loops', 'É um padrão de logging'], a: 0, exp: 'LEGB é a ordem em que o Python procura por uma variável: primeiro no escopo Local, depois Enclosing (funções externas), depois Global (módulo), e por fim Built-in (print, len, etc.).', mod: 'Control Flow' },
  { q: 'O que acontece quando fazes super().__init__(...) numa subclasse?', opts: ['Cria uma nova instância da classe pai', 'Chama o construtor da classe pai para inicializar atributos herdados', 'Remove os atributos da classe pai', 'É opcional e nunca necessário'], a: 1, exp: 'super().__init__() invoca o construtor da classe pai, garantindo que os atributos definidos lá (ex: self.name) também sejam inicializados na subclasse.', mod: 'OOP' },
  { q: 'Qual a diferença entre __str__ e __repr__ numa classe?', opts: ['São idênticos, apenas convenção de nome diferente', '__str__ é para o utilizador final (print); __repr__ é para debugging/desenvolvedores', '__repr__ só funciona em listas', '__str__ é obsoleto no Python 3'], a: 1, exp: '__str__ define a representação "amigável" (usada por print/str()). __repr__ define a representação não-ambígua, útil para debugging (usada por repr() e no REPL).', mod: 'OOP' },
  { q: 'Para que serve o context manager "with open(...) as f:"?', opts: ['Acelera a leitura de ficheiros grandes', 'Garante que o ficheiro é fechado automaticamente, mesmo se ocorrer uma excepção', 'Converte o ficheiro para JSON automaticamente', 'Só funciona com ficheiros binários'], a: 1, exp: 'O context manager "with" garante que o método __exit__ (que fecha o ficheiro) é sempre chamado, mesmo que uma excepção ocorra dentro do bloco — evita file handles soltos.', mod: 'OOP & File I/O' },
  { q: 'Qual excepção é lançada ao aceder a uma chave inexistente num dict?', opts: ['IndexError', 'AttributeError', 'KeyError', 'ValueError'], a: 2, exp: 'KeyError é lançado quando se tenta aceder a dict["chave_inexistente"]. Para evitar, usa-se dict.get("chave", default).', mod: 'OOP & File I/O' },
  { q: 'O que faz *args numa definição de função?', opts: ['Limita a função a um único argumento', 'Recebe um número variável de argumentos posicionais como tuple', 'É sintaxe inválida em Python', 'Só funciona com strings'], a: 1, exp: '*args recolhe argumentos posicionais extra numa tuple. def add(*numbers): permite chamar add(1,2,3,4) — numbers será (1,2,3,4).', mod: 'Control Flow' },
  { q: 'O que faz **kwargs numa definição de função?', opts: ['É equivalente a *args', 'Recebe argumentos nomeados extra como dicionário', 'Só aceita 2 argumentos', 'Lança uma excepção se usado incorrectamente'], a: 1, exp: '**kwargs recolhe argumentos keyword extra num dict. def f(**info): permite chamar f(name="Alice", age=30) — info será {"name": "Alice", "age": 30}.', mod: 'Control Flow' },
  { q: 'Qual a diferença entre um set e uma list em Python?', opts: ['Set não existe em Python', 'Set não permite duplicados e não é ordenado; list permite duplicados e é ordenada', 'List não permite duplicados', 'São intercambiáveis em qualquer contexto'], a: 1, exp: 'Set armazena elementos únicos sem ordem garantida, com lookup O(1). List mantém ordem de inserção e permite duplicados, com lookup O(n).', mod: 'Data Structures' },
  { q: 'O que é uma list comprehension?', opts: ['Uma função built-in para comprimir listas', 'Uma forma concisa de criar listas a partir de um iterável, opcionalmente filtrando', 'Um tipo de generator obrigatório', 'Um método exclusivo de tuples'], a: 1, exp: '[x**2 for x in range(10) if x % 2 == 0] cria uma lista dos quadrados dos números pares — mais pythónico e legível que um loop equivalente.', mod: 'Data Structures' },
  { q: 'Para que serve o pytest.mark.parametrize?', opts: ['Marca testes como obsoletos', 'Permite correr o mesmo teste com múltiplos conjuntos de inputs/outputs', 'Só funciona com unittest, não com pytest', 'Desactiva um teste'], a: 1, exp: '@pytest.mark.parametrize("a,b,expected", [(2,3,5), (0,0,0)]) corre o teste uma vez para cada tuple de valores, evitando duplicação de código de teste.', mod: 'Python DevOps' },
  { q: 'Qual o propósito de response.raise_for_status() na biblioteca requests?', opts: ['Imprime o status code no terminal', 'Lança uma excepção HTTPError se a resposta for 4xx ou 5xx', 'Converte a resposta para JSON', 'É obrigatório em todos os pedidos GET'], a: 1, exp: 'raise_for_status() verifica o status code da resposta e lança requests.exceptions.HTTPError automaticamente se for um erro de cliente (4xx) ou servidor (5xx).', mod: 'Python DevOps' },
  { q: 'O que faz argparse.add_argument("--dry-run", action="store_true")?', opts: ['Define um argumento obrigatório com valor string', 'Cria uma flag booleana — True se presente na linha de comandos, False caso contrário', 'Faz parsing de ficheiros JSON', 'Só funciona com Python 2'], a: 1, exp: 'action="store_true" cria uma flag que não precisa de valor — se o utilizador escrever --dry-run, args.dry_run será True; se omitir, será False.', mod: 'Python DevOps' },
  { q: 'Em logging, qual a ordem correcta de severidade (do menos ao mais grave)?', opts: ['CRITICAL < ERROR < WARNING < INFO < DEBUG', 'DEBUG < INFO < WARNING < ERROR < CRITICAL', 'INFO < DEBUG < ERROR < WARNING < CRITICAL', 'Todos têm a mesma prioridade'], a: 1, exp: 'A ordem é DEBUG < INFO < WARNING < ERROR < CRITICAL. Se o logger está configurado para nível INFO, mensagens DEBUG não aparecem, mas WARNING/ERROR/CRITICAL sim.', mod: 'Avançado' },
  { q: 'Qual a vantagem de usar pathlib em vez de os.path?', opts: ['pathlib é mais lento mas mais seguro', 'API orientada a objectos, mais legível, com o operador / para juntar paths', 'os.path está deprecado e não funciona', 'Não há vantagem real'], a: 1, exp: 'pathlib.Path oferece uma API orientada a objectos: Path("/app") / "config.json" é mais legível que os.path.join("/app", "config.json"), além de métodos como .exists(), .glob(), .read_text().', mod: 'OOP & File I/O' },
  { q: 'O que faz o type hint Optional[dict] no retorno de uma função?', opts: ['A função deve sempre retornar um dict vazio', 'Indica que a função pode retornar um dict ou None', 'Torna o parâmetro opcional na chamada da função', 'É sintaxe inválida'], a: 1, exp: 'Optional[dict] é equivalente a Union[dict, None] — comunica que a função pode retornar um dicionário ou None, ajudando ferramentas como mypy a detectar erros.', mod: 'Avançado' },
];

export default function PythonExamSimulator() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [showExp, setShowExp] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[current];
  const answered = answers[current] !== null;
  const correct = answers[current] === q.a;
  const score = answers.filter((a, i) => a === QUESTIONS[i].a).length;
  const pct = Math.round((score / QUESTIONS.length) * 100);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    const newAnswers = [...answers];
    newAnswers[current] = idx;
    setAnswers(newAnswers);
    setShowExp(true);
  }, [answered, answers, current]);

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) { setCurrent(c => c + 1); setShowExp(false); }
    else setFinished(true);
  };

  const handleReset = () => {
    setStarted(false); setCurrent(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setShowExp(false); setFinished(false);
  };

  if (!started) return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center space-y-4">
      <div className="text-4xl">🐍</div>
      <h3 className="text-2xl font-bold text-white">Simulado Python</h3>
      <p className="text-slate-400 max-w-md mx-auto">{QUESTIONS.length} questões cobrindo Fundamentos, Control Flow, Data Structures, OOP, Avançado e Python DevOps.</p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
        {[['20', 'Questões'], ['60%', 'Aprovação'], ['6', 'Módulos']].map(([v, l]) => (
          <div key={l} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xl font-black text-amber-300">{v}</div>
            <div className="text-[10px] text-slate-500">{l}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setStarted(true)} className="mt-2 px-8 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[14px] hover:bg-amber-500/30 transition-all">
        Iniciar Simulado →
      </button>
    </div>
  );

  if (finished) return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center space-y-5">
      <Trophy size={40} className={pct >= 60 ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
      <div>
        <div className="text-4xl font-black text-white">{pct}%</div>
        <div className={`text-[14px] font-semibold mt-1 ${pct >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {pct >= 80 ? '🎉 Excelente!' : pct >= 60 ? '✓ Aprovado' : '✗ Precisa de mais estudo'}
        </div>
        <div className="text-slate-500 text-[13px] mt-1">{score}/{QUESTIONS.length} respostas correctas</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left max-w-lg mx-auto">
        {QUESTIONS.map((q, i) => (
          <div key={i} className={`flex items-start gap-2 p-2 rounded-lg text-[11px] ${answers[i] === q.a ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
            {answers[i] === q.a ? <CheckCircle2 size={12} className="shrink-0 mt-0.5" /> : <XCircle size={12} className="shrink-0 mt-0.5" />}
            <span className="truncate">{q.mod}: {q.q.substring(0, 50)}...</span>
          </div>
        ))}
      </div>
      <button onClick={handleReset} className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-[13px] hover:border-slate-600 transition-all">
        <RotateCcw size={14} />Tentar de novo
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-slate-500">{current + 1} / {QUESTIONS.length}</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold">{q.mod}</span>
        </div>
        <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
        <p className="text-[15px] font-semibold text-white leading-relaxed mb-5">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => {
            let style = 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700';
            if (answered) {
              if (i === q.a) style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              else if (i === answers[current]) style = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
              else style = 'border-slate-800 bg-slate-900/30 text-slate-600';
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)}
                className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-all text-[13px] ${style} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
                <span className="shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold">
                  {answered && i === q.a ? '✓' : answered && i === answers[current] && i !== q.a ? '✗' : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {showExp && (
        <div className={`p-4 rounded-2xl border ${correct ? 'border-emerald-500/30 bg-emerald-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
          <div className={`text-[11px] font-black uppercase mb-1 ${correct ? 'text-emerald-400' : 'text-rose-400'}`}>
            {correct ? '✓ Correcto!' : '✗ Incorreto'}
          </div>
          <p className="text-[12px] text-slate-300 leading-relaxed">{q.exp}</p>
          <button onClick={handleNext} className="mt-3 px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-[12px] hover:bg-amber-500/30 transition-all">
            {current < QUESTIONS.length - 1 ? 'Próxima questão →' : 'Ver resultados →'}
          </button>
        </div>
      )}
    </div>
  );
}
