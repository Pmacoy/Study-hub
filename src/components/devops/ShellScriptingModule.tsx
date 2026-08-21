import { useState } from 'react';
import { Terminal, Copy, Check, AlertTriangle } from 'lucide-react';

type View = 'foundations' | 'structure' | 'robust' | 'pitfalls' | 'realworld';

function Code({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [c, setC] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {c ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={
            line.trim().startsWith('#') ? 'text-slate-600'
            : line.startsWith('$') ? 'text-emerald-300'
            : 'text-slate-300'
          }>{line || '\u00A0'}</div>
        ))}
      </pre>
    </div>
  );
}

const SHEBANG = `#!/bin/bash
# Shebang standard

#!/usr/bin/env bash
# Forma portável — resolve o bash a partir do PATH.
# Mais segura entre sistemas diferentes.

# Tornar executável e correr
$ chmod +x deploy.sh
$ ./deploy.sh

# Correr sem permissão de execução
$ bash deploy.sh`;

const EXEC_MODES = [
  ['Execução directa', './script.sh', 'Precisa de +x · usa o interpretador do shebang'],
  ['Interpretador explícito', 'bash script.sh', 'Ignora o shebang · corre num subshell novo'],
  ['Sourcing', 'source script.sh', 'Corre no shell actual · as variáveis persistem'],
  ['Execução por pipe', 'cat script.sh | bash', 'Lê do stdin · usado em scripts de instalação'],
];

const VARS = `# Sem espaços à volta do sinal de igual
name="Study Hub"
count=42

echo "Canal: $name"
echo "Canal: \${name}"     # chavetas evitam ambiguidade: \${name}_backup

# Atributos com declare
declare -i numero=10        # inteiro
declare -r constante="fixo" # só de leitura
declare -a lista            # array indexado
declare -A config           # array associativo
declare -x exportada=1      # equivale a export`;

const SPECIAL_VARS = [
  ['$0', 'Nome do próprio script'],
  ['$1 … $9', 'Argumentos posicionais'],
  ['$#', 'Número de argumentos'],
  ['$@', 'Todos os argumentos como palavras separadas'],
  ['$*', 'Todos os argumentos como uma só palavra'],
  ['$$', 'PID do shell actual'],
  ['$!', 'PID do último processo em segundo plano'],
  ['$?', 'Código de saída do último comando'],
];

const PARAM_EXPANSION = `# Valores por omissão
echo "\${name:-Desconhecido}"    # usa o default se não estiver definida
echo "\${name:=Convidado}"       # atribui o default se não estiver definida
echo "\${name:+Definida}"        # valor alternativo SE estiver definida
echo "\${name:?Erro: em falta}"  # falha com erro se não estiver definida

# Comprimento e substring
echo "\${#name}"                 # comprimento
echo "\${name:0:5}"              # substring: índice 0, comprimento 5
echo "\${name/Study/Learn}"      # substitui a primeira ocorrência
echo "\${name//o/0}"             # substitui todas as ocorrências

# Remoção de padrões — muito usado com caminhos
path="/var/log/nginx/access.log"
echo "\${path##*/}"              # access.log      (basename)
echo "\${path%/*}"               # /var/log/nginx  (dirname)
echo "\${path##*.}"              # log             (extensão)

#   \${var#padrão}   remove o menor match no início
#   \${var##padrão}  remove o maior match no início
#   \${var%padrão}   remove o menor match no fim
#   \${var%%padrão}  remove o maior match no fim`;

const GETOPTS = `#!/usr/bin/env bash
# Parsing de flags: ./deploy.sh -e production -v 2.1.0

while getopts "e:v:h" opt; do
  case $opt in
    e) env="$OPTARG" ;;
    v) version="$OPTARG" ;;
    h) echo "Uso: $0 -e <ambiente> -v <versão>"; exit 0 ;;
    \\?) echo "Opção inválida: -$OPTARG"; exit 1 ;;
  esac
done

echo "Ambiente: $env, Versão: $version"

# Os dois pontos depois da letra indicam que a flag
# exige um argumento. $OPTARG contém esse valor.`;

const BRACKETS = [
  ['[ … ]', 'Comando test POSIX', 'Há word-splitting — cita SEMPRE as variáveis'],
  ['[[ … ]]', 'Test estendido do Bash', 'Sem word-splitting · suporta && || e =~'],
  ['(( … ))', 'Avaliação aritmética', 'Comparações numéricas · não precisa de $ dentro'],
];

const LOOPS = `# Iterar sobre uma lista
for servico in nginx docker jenkins; do
  systemctl status "$servico"
done

# Iterar sobre ficheiros — usa globs, NUNCA \`ls\`
for ficheiro in /var/log/*.log; do
  echo "A processar $ficheiro"
done

# until — corre até a condição ser verdadeira
tentativas=0
until curl -sf https://api.exemplo.com/health; do
  echo "À espera do serviço..."
  sleep 5
  ((tentativas++))
  [ $tentativas -ge 12 ] && { echo "Timeout"; exit 1; }
done

# Ler um ficheiro linha a linha — o padrão correcto
while IFS= read -r linha; do
  echo "Linha: $linha"
done < servidores.txt`;

const FUNCTIONS = `# As funções devolvem dados por stdout, não por return.
# O \`return\` só define um código de saída (0–255).

obter_uso_disco() {
  local uso
  uso=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
  echo "$uso"          # "devolvido" por stdout
  return 0
}

resultado=$(obter_uso_disco)
echo "Uso actual: \${resultado}%"

# local isola a variável dentro da função
contador=100
actualizar() {
  local contador=5     # sombra a global
  ((contador++))
  echo "Dentro: $contador"    # 6
}
actualizar
echo "Fora: $contador"        # 100 — a global não foi tocada`;

const ARRAYS = `# Arrays indexados
servidores=("web-01" "web-02" "db-01")

echo "\${servidores[0]}"      # primeiro elemento
echo "\${servidores[@]}"      # todos os elementos
echo "\${#servidores[@]}"     # número de elementos

servidores+=("web-03")        # acrescentar
unset servidores[1]           # remover

for s in "\${servidores[@]}"; do echo "$s"; done

# Arrays associativos (mapas)
declare -A portas
portas["nginx"]=80
portas["ssh"]=22

echo "\${portas[nginx]}"       # 80
echo "\${!portas[@]}"          # todas as chaves
echo "\${portas[@]}"           # todos os valores

for chave in "\${!portas[@]}"; do
  echo "$chave -> \${portas[$chave]}"
done

# Dividir uma string num array
IFS=',' read -ra partes <<< "web-01,web-02,db-01"`;

const STRICT_MODE = `#!/usr/bin/env bash
set -euo pipefail

#   set -e           sai imediatamente se um comando falhar
#   set -u           erro ao usar variável não definida
#   set -o pipefail  o pipeline falha se QUALQUER comando falhar,
#                    não apenas o último

# Sem pipefail:
#   false | true     →  exit code 0  (esconde a falha)
# Com pipefail:
#   false | true     →  exit code 1  (a falha propaga-se)`;

const SET_E_CAVEATS = `# set -e NÃO dispara nestes casos:

# 1. Dentro de condicionais
if comando_que_falha; then ...   # não sai

# 2. Em cadeias && ou ||
comando_que_falha || true        # não sai

# 3. Em funções chamadas dentro dessas condições
if minha_funcao; then ...        # não sai, mesmo que a função falhe

# Por isso: testa os caminhos de falha explicitamente
# em vez de confiar apenas no set -e para verificações críticas.`;

const TRAP = `#!/usr/bin/env bash
# trap garante limpeza mesmo quando o script é interrompido

tmpfile=$(mktemp)

cleanup() {
  echo "A limpar..."
  rm -f "$tmpfile"
  exit
}

trap cleanup SIGINT SIGTERM EXIT

echo "A trabalhar com $tmpfile"
sleep 30

# Sem o trap, um Ctrl+C deixaria o ficheiro temporário para trás.
# Com ele, a limpeza acontece sempre — saída normal, erro ou interrupção.`;

const ERROR_HANDLING = `#!/usr/bin/env bash
set -euo pipefail

die() {
  echo "ERRO: $1" >&2
  exit "\${2:-1}"
}

# Verificar dependências antes de começar
command -v docker >/dev/null 2>&1 || die "docker não está instalado" 127

backup_db() {
  pg_dump mydb > backup.sql || die "Backup da base de dados falhou"
}

backup_db`;

const EXIT_CODES = [
  ['0', 'Sucesso'],
  ['1', 'Erro genérico'],
  ['2', 'Uso incorrecto de builtin do shell'],
  ['126', 'Comando encontrado mas não executável'],
  ['127', 'Comando não encontrado'],
  ['128+N', 'Terminado pelo sinal N (137 = SIGKILL, 130 = SIGINT)'],
];

const DEBUGGING = `# Modos de debug
$ bash -x script.sh      # imprime cada comando antes de executar
$ bash -n script.sh      # só verifica sintaxe, não executa
$ bash -v script.sh      # imprime as linhas tal como são lidas

# Activar trace dentro do próprio script
set -x
comando_suspeito
set +x

# PS4 customizado — trace com ficheiro, linha e função
export PS4='+ \${BASH_SOURCE}:\${LINENO}:\${FUNCNAME[0]:-main}(): '
set -x

# ShellCheck — o linter standard da indústria
$ shellcheck deploy.sh
# SC2086: Double quote to prevent globbing and word splitting

# Padrão de logging para scripts longos
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOGFILE"
}`;

const PITFALLS = [
  {
    title: 'Variáveis sem aspas',
    why: 'Word-splitting e globbing quebram em espaços ou wildcards',
    fix: 'Cita sempre: "$var" em vez de $var',
  },
  {
    title: 'Usar = para comparar números',
    why: 'Faz comparação de strings, não numérica',
    fix: 'Usa -eq dentro de [ ] ou == dentro de (( ))',
  },
  {
    title: 'Fazer parsing do output do ls',
    why: 'Quebra com nomes de ficheiro que tenham espaços ou newlines',
    fix: 'Usa globs: for f in *.txt — ou find',
  },
  {
    title: 'Ignorar o $?',
    why: 'Falhas silenciosas passam despercebidas',
    fix: 'Verifica códigos de saída ou usa set -e',
  },
  {
    title: 'Caminhos relativos no cron',
    why: 'O PATH do cron é diferente do shell interactivo',
    fix: 'Usa caminhos absolutos em todo o lado',
  },
  {
    title: 'Alterar variável dentro de um loop com pipe',
    why: 'O pipe corre o loop num subshell — as alterações perdem-se',
    fix: 'Usa redirecção de input: done < ficheiro',
  },
];

const CHECKLIST = [
  'Começar com #!/usr/bin/env bash e set -euo pipefail',
  'Citar todas as expansões de variáveis: "$var"',
  'Validar argumentos e variáveis de ambiente logo no início',
  'Usar funções para partir a lógica em unidades testáveis',
  'Preferir [[ ]] a [ ] em scripts só-Bash',
  'Usar local em todas as variáveis dentro de funções',
  'Registar com timestamps em scripts longos ou agendados',
  'Fazer trap de SIGINT, SIGTERM e EXIT para limpeza garantida',
  'Correr ShellCheck antes de cada commit',
  'Evitar parsing do ls — usar globs ou find',
  'Nunca escrever segredos no código — ler do ambiente ou de um gestor',
  'Testar com casos-limite: input vazio, ficheiros em falta, sem rede',
];

const DEPLOY_ROLLBACK = `#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/app"
RELEASE=$1
PREV_RELEASE_FILE="\${APP_DIR}/.previous_release"

rollback() {
  local prev
  prev=$(cat "$PREV_RELEASE_FILE")
  echo "Deployment falhou — a reverter para \${prev}"
  ln -sfn "\${APP_DIR}/releases/\${prev}" "\${APP_DIR}/current"
  systemctl restart app
  exit 1
}

trap rollback ERR

# Guardar a release actual antes de trocar
echo "$(readlink "\${APP_DIR}/current")" > "$PREV_RELEASE_FILE"

ln -sfn "\${APP_DIR}/releases/\${RELEASE}" "\${APP_DIR}/current"
systemctl restart app

sleep 5
curl -sf http://localhost/health || exit 1

echo "Deployment de \${RELEASE} concluído com sucesso"

# O trap ERR faz o rollback automático se qualquer
# comando falhar — incluindo o health check.`;

const HEALTH_CHECK = `#!/usr/bin/env bash
set -euo pipefail

DISK_THRESHOLD=85
MEM_THRESHOLD=90

check_disk() {
  local uso
  uso=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
  if (( uso >= DISK_THRESHOLD )); then
    echo "ALERTA: disco a \${uso}%"
    return 1
  fi
}

check_memory() {
  local uso
  uso=$(free | awk '/Mem/ {printf("%.0f", $3/$2 * 100)}')
  if (( uso >= MEM_THRESHOLD )); then
    echo "ALERTA: memória a \${uso}%"
    return 1
  fi
}

check_disk && echo "Disco OK"
check_memory && echo "Memória OK"`;

const LOG_PIPELINE = `# Top 5 endereços IP com erros 5xx
awk '$9 ~ /^5/ {print $1}' access.log \\
  | sort | uniq -c | sort -rn | head -5

# Cada peça faz uma coisa:
#   awk    filtra as linhas com status 5xx e extrai o IP
#   sort   agrupa IPs iguais
#   uniq -c conta as ocorrências
#   sort -rn ordena por contagem, decrescente
#   head -5  fica com os cinco primeiros`;

export default function ShellScriptingModule() {
  const [view, setView] = useState<View>('foundations');

  const tabs: { id: View; label: string }[] = [
    { id: 'foundations', label: 'Fundamentos' },
    { id: 'structure',   label: 'Estrutura' },
    { id: 'robust',      label: 'Scripts robustos' },
    { id: 'pitfalls',    label: 'Armadilhas' },
    { id: 'realworld',   label: 'Casos reais' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-5">
        <div className="flex items-center gap-3">
          <Terminal size={22} className="text-violet-400" />
          <div>
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Automação</div>
            <h2 className="text-lg font-bold text-white">Shell scripting a sério</h2>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
          O shell está presente em todos os sistemas Linux sem instalar nada. É o que liga
          <code className="text-violet-300"> kubectl</code>, <code className="text-violet-300">docker</code>,
          <code className="text-violet-300"> aws-cli</code> e <code className="text-violet-300">git</code>,
          o que corre nos entrypoints de containers e nos passos de pipelines. A diferença entre copiar
          scripts e escrevê-los está no que se segue.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Fundamentos ─────────────────────────────────────── */}
      {view === 'foundations' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Shebang e execução</h3>
            <Code code={SHEBANG} />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Quatro formas de correr um script</h3>
            <div className="space-y-1.5">
              {EXEC_MODES.map(([mode, cmd, behaviour]) => (
                <div key={mode} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-[12px] font-semibold text-slate-200 w-40 shrink-0">{mode}</span>
                    <code className="text-[11px] text-violet-300 font-mono">{cmd}</code>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{behaviour}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl bg-sky-500/5 border border-sky-500/20">
              <p className="text-[12px] text-sky-100 leading-relaxed">
                O <code className="text-sky-300">source</code> é a única forma de as variáveis exportadas
                e os <code className="text-sky-300">cd</code> persistirem depois de o script terminar —
                porque corre no shell actual em vez de num subshell.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Variáveis</h3>
            <Code code={VARS} />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Variáveis especiais</h3>
            <div className="grid md:grid-cols-2 gap-1.5">
              {SPECIAL_VARS.map(([v, meaning]) => (
                <div key={v} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <code className="shrink-0 text-[12px] font-bold text-violet-300 w-16">{v}</code>
                  <span className="text-[11px] text-slate-400">{meaning}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Parameter expansion</h3>
            <Code code={PARAM_EXPANSION} />
          </section>
        </div>
      )}

      {/* ── Estrutura ───────────────────────────────────────── */}
      {view === 'structure' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">[ ] vs [[ ]] vs (( ))</h3>
            <div className="space-y-1.5">
              {BRACKETS.map(([syntax, purpose, behaviour]) => (
                <div key={syntax} className="p-3 rounded-xl bg-slate-900">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <code className="text-[12px] font-bold text-violet-300 w-20 shrink-0">{syntax}</code>
                    <span className="text-[12px] text-slate-200">{purpose}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 pl-[5.75rem]">{behaviour}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Loops</h3>
            <Code code={LOOPS} />
          </section>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Armadilha do pipe</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Evita <code className="text-amber-300">cat ficheiro | while read linha</code> quando o loop
              precisa de alterar variáveis usadas depois. O pipe corre o loop num subshell, e as alterações
              perdem-se. Usa redirecção: <code className="text-amber-300">done &lt; ficheiro</code>.
            </p>
          </div>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Funções</h3>
            <Code code={FUNCTIONS} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Arrays e mapas</h3>
            <Code code={ARRAYS} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Parsing de flags com getopts</h3>
            <Code code={GETOPTS} />
          </section>
        </div>
      )}

      {/* ── Scripts robustos ────────────────────────────────── */}
      {view === 'robust' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Strict mode</h3>
            <Code code={STRICT_MODE} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Os limites do set -e</h3>
            <Code code={SET_E_CAVEATS} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">trap — limpeza garantida</h3>
            <Code code={TRAP} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Tratamento de erros</h3>
            <Code code={ERROR_HANDLING} />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Códigos de saída convencionais</h3>
            <div className="space-y-1.5">
              {EXIT_CODES.map(([code, meaning]) => (
                <div key={code} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <code className="shrink-0 text-[12px] font-bold text-violet-300 w-16">{code}</code>
                  <span className="text-[11px] text-slate-400">{meaning}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Debugging</h3>
            <Code code={DEBUGGING} />
          </section>
        </div>
      )}

      {/* ── Armadilhas ──────────────────────────────────────── */}
      {view === 'pitfalls' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-rose-400" />
            <h3 className="text-[14px] font-bold text-white">As seis armadilhas que apanham toda a gente</h3>
          </div>

          <div className="space-y-2">
            {PITFALLS.map(p => (
              <div key={p.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-[13px] font-semibold text-rose-300">{p.title}</div>
                <p className="text-[12px] text-slate-400 mt-1.5">{p.why}</p>
                <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-[11px] text-emerald-100/80">{p.fix}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Checklist para scripts de produção</h3>
            <div className="space-y-1.5">
              {CHECKLIST.map((item, i) => (
                <div key={item} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-[9px] font-black text-violet-300">
                    {i + 1}
                  </span>
                  <span className="text-[12px] text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── Casos reais ─────────────────────────────────────── */}
      {view === 'realworld' && (
        <div className="space-y-5">
          <section>
            <h3 className="text-[14px] font-bold text-white mb-1">Deployment com rollback automático</h3>
            <p className="text-[12px] text-slate-500 mb-2">
              O <code className="text-violet-300">trap ERR</code> transforma qualquer falha numa reversão.
            </p>
            <Code code={DEPLOY_ROLLBACK} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-2">Health check de disco e memória</h3>
            <Code code={HEALTH_CHECK} />
          </section>

          <section>
            <h3 className="text-[14px] font-bold text-white mb-1">Pipeline de análise de logs</h3>
            <p className="text-[12px] text-slate-500 mb-2">
              O verdadeiro poder do shell está em combinar ferramentas pequenas com pipes.
            </p>
            <Code code={LOG_PIPELINE} />
          </section>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Ligação ao terreno</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              Este pipeline de logs é exactamente o tipo de comando que aparece nas sessões de terminal
              do hub. Perceber cada peça — <code className="text-violet-300">awk</code> filtra,
              <code className="text-violet-300"> sort</code> agrupa, <code className="text-violet-300">uniq -c</code> conta —
              é o que permite construí-lo sob pressão em vez de o procurar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
