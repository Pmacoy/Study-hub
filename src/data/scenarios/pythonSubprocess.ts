import type { Scenario } from '../../types/scenario';

export const pythonSubprocessScenario: Scenario = {
  id: 'python-subprocess-hang',
  domain: 'python',
  format: 'guided',
  title: 'Script Python de deploy fica pendurado sem output',
  hook: 'O teu script `deploy.py` corre um `kubectl apply` e fica pendurado para sempre em produção. No teu Mac corre em 3 segundos. Alguém já cortou o pipeline duas vezes achando que está partido. Suspeito nº1: ambiente. Suspeito nº2: código. Vamos ver.',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['python', 'subprocess', 'devops', 'pipes'],

  contextArtifacts: [
    {
      id: 'context-code',
      label: 'deploy.py (função relevante)',
      language: 'python',
      content: `import subprocess

def apply_manifest(path: str) -> None:
    """Apply a kubectl manifest and log the output."""
    result = subprocess.run(
        ["kubectl", "apply", "-f", path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    print(result.stdout)
    if result.returncode != 0:
        raise RuntimeError(f"kubectl failed: {result.stderr}")`,
    },
    {
      id: 'context-env',
      label: 'Onde corre',
      language: 'text',
      content: `Ambiente local (teu Mac):  ✓ funciona em 3 segundos
GitHub Actions runner:      ✗ hangs para sempre
Ambiente prod-runner:       ✗ hangs para sempre

Comando dentro do script:  kubectl apply -f k8s/prod.yaml
                            (aplica ~4000 linhas de YAML, muitos objectos)`,
    },
  ],

  progressiveArtifacts: [
    {
      id: 'strace-output',
      label: '$ strace -p <pid do python> — no runner CI',
      language: 'bash',
      content: `# strace anexado ao processo pendurado
read(4, ...

# fica só neste read para sempre.
# fd 4 é o pipe do stdout do kubectl.

$ ls -la /proc/<kubectl_pid>/fd/
lr-x------ ... 1 -> pipe:[123456]     ← stdout
lr-x------ ... 2 -> pipe:[123457]     ← stderr`,
    },
    {
      id: 'kubectl-manifest-size',
      label: 'Tamanho real do output do kubectl neste manifest',
      language: 'bash',
      content: `$ kubectl apply -f prod.yaml | wc -c
82437

$ cat /proc/sys/fs/pipe-max-size
1048576                              # 1 MB max por pipe

# O pipe padrão do Linux é 64 KB (16 páginas de 4 KB).
# Se kubectl escreve mais que 64 KB e nada lê o pipe, o write() bloqueia.
# Pipe cheio = kubectl fica pendurado a escrever = Python fica pendurado a esperar.

$ echo | python3 -c "import fcntl, os; r,w=os.pipe(); print(fcntl.fcntl(r, 1032))"
65536                                # 64 KB — o tamanho default do pipe`,
    },
    {
      id: 'fix-attempts',
      label: 'O que outros tentaram',
      language: 'python',
      content: `# Tentativa 1: usar shell=True
subprocess.run("kubectl apply -f prod.yaml", shell=True, ...)
# Resultado: mesmo hang. shell=True não muda o problema do pipe.

# Tentativa 2: adicionar timeout=60
subprocess.run([...], timeout=60)
# Resultado: kill após 60s, mas o deploy fica a meio. Pior que antes.

# Tentativa 3: check_output em vez de run
subprocess.check_output([...])
# Resultado: mesmo comportamento. check_output também usa PIPE.`,
    },
  ],

  steps: [
    {
      id: 'step-1',
      prompt: 'Corre local, hangs em CI. O que fazes primeiro para reduzir o espaço de busca?',
      options: [
        {
          id: 'a',
          label: 'Correr o mesmo `kubectl apply` directamente no runner CI (sem Python)',
          correct: true,
          feedback: 'Boa. Se o kubectl standalone funciona, o problema é como o Python o chama. Se o kubectl também hangs, o problema é kubectl/rede/permissões.',
        },
        {
          id: 'b',
          label: 'Adicionar `print("debug")` em todos os pontos do script',
          correct: false,
          feedback: 'Print debugging é útil, mas já sabes que o hang é depois do subprocess.run — não precisas de mais prints para saber isso.',
        },
        {
          id: 'c',
          label: 'Fazer downgrade da versão do Python no runner',
          correct: false,
          feedback: 'Suposição sem evidência. O `subprocess` não mudou entre versões modernas do Python.',
        },
      ],
    },
    {
      id: 'step-2',
      prompt: 'kubectl standalone funciona. É o subprocess. Como investigas o hang em produção?',
      options: [
        {
          id: 'a',
          label: 'strace -p <pid> ao processo Python pendurado',
          correct: true,
          feedback: 'Exacto. strace mostra em que syscall está bloqueado. Se vires "read(4, ..." então está bloqueado a ler de um FD (pipe).',
          revealArtifacts: ['strace-output'],
        },
        {
          id: 'b',
          label: 'Adicionar logging.DEBUG e reproduzir',
          correct: false,
          feedback: 'DEBUG do logger não te mostra onde o subprocess está pendurado — mostra-te apenas o teu código Python.',
        },
        {
          id: 'c',
          label: 'Fazer profile com cProfile',
          correct: false,
          feedback: 'cProfile mede CPU. Um processo pendurado num syscall não gasta CPU — não vai aparecer no profile.',
        },
      ],
    },
    {
      id: 'step-3',
      prompt: 'strace mostra o Python bloqueado em `read()` de um pipe. O kubectl escreveu ~82 KB de output. Um pipe Linux default tem 64 KB. Qual a causa?',
      revealArtifacts: ['kubectl-manifest-size'],
      options: [
        {
          id: 'a',
          label: 'kubectl bloqueou no write() porque o pipe está cheio; Python nunca lê porque só faz .read() depois do processo terminar; deadlock clássico do subprocess.',
          correct: true,
          feedback: 'Exacto! Este é o "deadlock do subprocess.PIPE". O código faz `subprocess.run` que só lê os pipes depois do processo terminar. Kubectl quer terminar mas está preso no write. Nenhum dos dois avança.',
        },
        {
          id: 'b',
          label: 'kubectl está com bug — devia lidar com pipes cheios',
          correct: false,
          feedback: 'Não é bug do kubectl. Comportamento normal: se ninguém lê o pipe, write() bloqueia. É como POSIX funciona há 40 anos.',
        },
        {
          id: 'c',
          label: 'O runner CI tem menos memória e o pipe é mais pequeno',
          correct: false,
          feedback: 'O tamanho do pipe é 64 KB em qualquer Linux moderno, independentemente da memória. Não é isso.',
        },
      ],
      teachingNote: 'A doc do Python avisa: "The child process will block if it generates enough output to a pipe to fill up the OS pipe buffer, as the pipes are not being read from." A solução é usar `.communicate()` ou ler os pipes em streaming.',
    },
    {
      id: 'step-4',
      prompt: 'Diagnóstico correcto. Qual é o fix?',
      revealArtifacts: ['fix-attempts'],
      options: [
        {
          id: 'a',
          label: 'Deixar de capturar stdout/stderr (removeu PIPE) — o output vai directo para os logs do CI',
          correct: true,
          feedback: 'Correcto se não precisas do output em variável. Sem PIPE não há pipe para encher. E os logs do kubectl aparecem no runner CI naturalmente — que é o que queres.',
        },
        {
          id: 'b',
          label: 'Manter PIPE mas ler stdout/stderr em streams separadas com threads',
          correct: false,
          feedback: 'Funciona, mas é código complexo para um deploy simples. Se não precisas do output em variável, é over-engineering.',
        },
        {
          id: 'c',
          label: 'Aumentar o pipe-max-size do kernel para 10 MB',
          correct: false,
          feedback: 'Requer privilégios root e ainda estás um kubectl grande de crashar. Trata o sintoma, não a causa.',
        },
      ],
    },
    {
      id: 'step-5',
      prompt: 'Precisas mesmo do stdout numa variável (para parsear que objectos foram criados). Qual é o método certo?',
      options: [
        {
          id: 'a',
          label: 'subprocess.run(..., capture_output=True) OU usar Popen + .communicate()',
          correct: true,
          feedback: 'Sim. `.communicate()` lê stdout e stderr em paralelo através de threads internas — evita o deadlock. `capture_output=True` faz o mesmo por baixo (equivale a `stdout=PIPE, stderr=PIPE` mas usando comunicação non-blocking).',
        },
        {
          id: 'b',
          label: 'os.popen(cmd).read()',
          correct: false,
          feedback: 'os.popen é a API antiga e tem o mesmo problema de deadlock com stderr. Está deprecated há anos.',
        },
        {
          id: 'c',
          label: 'os.system(cmd) e depois ler /tmp/output.log',
          correct: false,
          feedback: 'os.system não te dá acesso ao stdout — só retorna o exit code. Terias de redireccionar para ficheiro tu próprio, que é um passo para trás.',
        },
      ],
    },
  ],

  resolution: {
    rootCause: 'O código usa `subprocess.run` com `stdout=PIPE, stderr=PIPE` mas só acede a `result.stdout` DEPOIS do processo terminar. `subprocess.run` faz `.communicate()` por baixo... nas versões modernas do Python. No código em causa, faltava `capture_output=True` OU o padrão explícito `Popen + communicate()`. Localmente o manifest era pequeno (~10KB) e cabia no pipe. Em produção o manifest cresceu para 82KB, encheu o pipe de 64KB, e kubectl ficou bloqueado no write enquanto Python esperava pelo exit — deadlock clássico.',
    fix: 'Trocar `stdout=subprocess.PIPE, stderr=subprocess.PIPE` por `capture_output=True`. `subprocess.run` internamente usa `.communicate()` que lê os pipes em background enquanto o processo corre — sem bloquear.',
    preventions: [
      'Regra de código: nunca usar `stdout=PIPE` sem `capture_output=True` ou `.communicate()`',
      'Ruff/Pylint rule custom que sinaliza `subprocess.run(stdout=PIPE)` sem communicate',
      'Test de integração no CI que faz um kubectl apply de manifest grande (>200KB)',
      'Documentar no runbook de scripts DevOps: "se um subprocess hangs sem output, procura pipe deadlock primeiro"',
      'Considerar migrar de subprocess para SDK oficial (`kubernetes` Python client) que evita todo o problema',
    ],
  },
};
