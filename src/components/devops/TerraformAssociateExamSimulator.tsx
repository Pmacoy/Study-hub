import { RotateCcw, Trophy, Target, CheckCircle, XCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { useQuizEngine, type Question } from '../../hooks/useQuizEngine';
import QuizRunner from '../shared/QuizRunner';
import { useState, useMemo } from 'react';

type TerraformModule = 'Conceitos IaC' | 'Workflow' | 'State' | 'Módulos' | 'HCL' | 'Providers' | 'Terraform Cloud';

// Banco de questões para o HashiCorp Certified: Terraform Associate (003).
// Cobre os objectivos oficiais do exame: IaC, workflow CLI, state, módulos,
// HCL, providers/provisioners e Terraform Cloud/registry.
export const QUESTIONS: Question<TerraformModule>[] = [
  { q: 'Qual é a principal vantagem de Infrastructure as Code (IaC) face à criação manual de infraestrutura?', opts: ['É sempre mais barato executar', 'A infraestrutura torna-se versionável, revisável e reproduzível', 'Elimina a necessidade de testes', 'Funciona sem qualquer cloud provider'], a: 1, exp: 'IaC trata a infraestrutura como código: pode ser versionada em Git, revista em pull requests, testada e aplicada de forma consistente e reproduzível em qualquer ambiente.', mod: 'Conceitos IaC', diff: 'easy' },
  { q: 'Qual é a diferença entre uma abordagem declarativa e uma imperativa em IaC?', opts: ['Declarativa define o estado final desejado; imperativa define os passos para lá chegar', 'Imperativa é sempre mais rápida', 'Declarativa só funciona em cloud pública', 'Não há diferença prática'], a: 0, exp: 'Terraform é declarativo: descreves o estado final desejado (ex: "quero 3 VMs") e a ferramenta calcula os passos necessários. Ferramentas imperativas (scripts bash) exigem que definas cada passo explicitamente.', mod: 'Conceitos IaC', diff: 'easy' },
  { q: 'Qual o propósito do comando "terraform init"?', opts: ['Aplica as mudanças de infraestrutura', 'Descarrega providers, módulos e configura o backend', 'Valida apenas a sintaxe HCL', 'Destrói os recursos existentes'], a: 1, exp: 'terraform init prepara o directório de trabalho: descarrega os providers e módulos necessários e inicializa o backend (onde o state é guardado). É sempre o primeiro comando a correr num novo projecto ou após adicionar providers/módulos.', mod: 'Workflow', diff: 'easy' },
  { q: 'O que faz "terraform plan"?', opts: ['Aplica as mudanças imediatamente', 'Gera um preview das mudanças, comparando o state com a configuração, sem alterar nada', 'Formata os ficheiros .tf', 'Apaga o ficheiro de state'], a: 1, exp: 'terraform plan compara o state actual com a configuração desejada e mostra um diff (recursos a criar, alterar ou destruir) sem fazer qualquer mudança real. É essencial rever o plan antes de aplicar.', mod: 'Workflow', diff: 'easy' },
  { q: 'Qual comando remove todos os recursos geridos por uma configuração Terraform?', opts: ['terraform remove', 'terraform delete', 'terraform destroy', 'terraform clean'], a: 2, exp: 'terraform destroy elimina todos os recursos geridos pelo state actual. Tal como o apply, pede confirmação antes de executar (a menos que se use -auto-approve).', mod: 'Workflow', diff: 'easy' },
  { q: 'Para que serve a flag "-target" no terraform apply?', opts: ['Define o provider alvo', 'Aplica mudanças apenas a um recurso ou módulo específico', 'Especifica o workspace de destino', 'Define a região da cloud'], a: 1, exp: '-target limita a operação a um recurso/módulo específico (ex: terraform apply -target=aws_instance.web). É útil em situações pontuais, mas a HashiCorp desaconselha o uso regular pois pode deixar o state inconsistente com a configuração completa.', mod: 'Workflow', diff: 'medium' },
  { q: 'O que é o Terraform state e porque é fundamental?', opts: ['Um cache temporário apagado após cada apply', 'Um ficheiro que mapeia os recursos definidos na configuração aos recursos reais na infraestrutura', 'Um log de auditoria de mudanças', 'A documentação gerada automaticamente'], a: 1, exp: 'O state (terraform.tfstate) guarda o mapeamento entre os recursos declarados em HCL e os objectos reais na infraestrutura (incluindo IDs e atributos). Sem ele, o Terraform não saberia que recursos já existem nem detectaria drift.', mod: 'State', diff: 'easy' },
  { q: 'Por que razão se recomenda usar remote state (ex: S3, Azure Storage, Terraform Cloud) em vez de state local em equipa?', opts: ['É sempre mais rápido', 'Permite colaboração segura com locking, evitando execuções concorrentes e conflitos', 'É a única forma de usar módulos', 'Reduz o número de providers necessários'], a: 1, exp: 'Remote state partilhado permite que toda a equipa trabalhe sobre o mesmo state, com locking (ex: DynamoDB no backend S3) que previne dois "apply" simultâneos e a consequente corrupção do state.', mod: 'State', diff: 'medium' },
  { q: 'O que é "state drift" e como se detecta?', opts: ['Uma migração de state entre backends', 'Divergência entre o state e a infraestrutura real, detectada via terraform plan/refresh', 'Um erro de sintaxe no HCL', 'A rotação automática de credenciais'], a: 1, exp: 'Drift ocorre quando a infraestrutura real é alterada fora do Terraform (ex: mudança manual na consola). terraform plan (que faz refresh do state) revela essas diferenças antes de qualquer apply.', mod: 'State', diff: 'medium' },
  { q: 'Qual comando importa um recurso já existente (criado fora do Terraform) para o state?', opts: ['terraform adopt', 'terraform import', 'terraform sync', 'terraform attach'], a: 1, exp: 'terraform import associa um recurso existente na infraestrutura a um bloco de recurso já definido na configuração, sem o recriar. A partir do Terraform 1.5+ também é possível usar blocos "import" declarativos no ficheiro .tf.', mod: 'State', diff: 'medium' },
  { q: 'Para que serve o "state locking"?', opts: ['Encriptar o ficheiro de state em repouso', 'Prevenir que duas execuções de terraform apply corram em simultâneo sobre o mesmo state', 'Impedir a edição manual do ficheiro .tf', 'Bloquear o acesso a variáveis sensíveis'], a: 1, exp: 'State locking previne execuções concorrentes que poderiam corromper o state. Backends como S3+DynamoDB, Azure Storage ou Terraform Cloud implementam locking nativamente durante plan/apply.', mod: 'State', diff: 'medium' },
  { q: 'Qual é o benefício principal de usar módulos Terraform?', opts: ['Tornam o código mais lento a executar', 'Permitem reutilizar e encapsular configurações comuns de forma consistente', 'São obrigatórios em qualquer projecto Terraform', 'Substituem a necessidade de providers'], a: 1, exp: 'Módulos encapsulam um conjunto de recursos relacionados (ex: "rede", "cluster") numa unidade reutilizável e parametrizável, promovendo consistência e reduzindo duplicação entre ambientes/projectos.', mod: 'Módulos', diff: 'easy' },
  { q: 'Num bloco "module", que argumento é obrigatório para especificar a origem do módulo?', opts: ['name', 'source', 'path', 'origin'], a: 1, exp: 'O argumento "source" indica de onde vem o módulo — um caminho local (./modules/vpc), um repositório Git, ou o Terraform Registry (ex: "terraform-aws-modules/vpc/aws"). É o único argumento sempre obrigatório num bloco module.', mod: 'Módulos', diff: 'easy' },
  { q: 'Como se referenciam os outputs de um módulo chamado "network" a partir da configuração raiz?', opts: ['network.output.vpc_id', 'module.network.vpc_id', '${network[vpc_id]}', 'output.network.vpc_id'], a: 1, exp: 'Os outputs de um módulo são acedidos com a sintaxe module.<nome_do_módulo>.<nome_do_output>, por exemplo module.network.vpc_id.', mod: 'Módulos', diff: 'medium' },
  { q: 'Qual bloco HCL declara um valor de entrada parametrizável numa configuração Terraform?', opts: ['output', 'variable', 'locals', 'data'], a: 1, exp: 'O bloco "variable" declara um valor de input que pode ser fornecido via .tfvars, linha de comandos, variáveis de ambiente (TF_VAR_*) ou valor default. "output" expõe valores; "locals" define valores calculados internamente.', mod: 'HCL', diff: 'easy' },
  { q: 'Para que serve o bloco "locals" em HCL?', opts: ['Definir variáveis de input do utilizador', 'Definir valores calculados/reutilizados internamente na configuração, sem serem inputs nem outputs', 'Configurar o backend local', 'Guardar segredos de forma encriptada'], a: 1, exp: 'locals define valores intermédios calculados a partir de expressões (ex: concatenar strings, combinar variáveis) que podem ser reutilizados várias vezes na configuração, sem serem parametrizáveis como as variables.', mod: 'HCL', diff: 'medium' },
  { q: 'Qual a função de "data sources" em Terraform?', opts: ['Criar novos recursos na infraestrutura', 'Consultar/ler informação sobre recursos existentes, geridos ou não pelo Terraform', 'Fazer backup do state', 'Definir variáveis sensíveis'], a: 1, exp: 'Um bloco "data" (ex: data "aws_ami" "latest") consulta informação já existente — seja gerida por outro Terraform, criada manualmente, ou fornecida pelo próprio provider (como a AMI mais recente da AWS) — sem a criar nem modificar.', mod: 'HCL', diff: 'medium' },
  { q: 'Qual a diferença entre "count" e "for_each" na criação de múltiplas instâncias de um recurso?', opts: ['São idênticos em todos os casos', 'count usa um índice numérico; for_each usa um mapa/set, evitando problemas de reordenação ao remover elementos do meio', 'for_each só funciona com módulos', 'count é a versão mais recente, substituindo for_each'], a: 1, exp: 'count itera por um número (0..n-1); se um elemento do meio de uma lista for removido, os índices seguintes deslocam-se, podendo recriar recursos indevidamente. for_each itera por um mapa ou set, associando cada recurso a uma chave estável, evitando esse problema.', mod: 'HCL', diff: 'hard' },
  { q: 'O que faz a função "terraform fmt"?', opts: ['Valida a configuração contra o provider', 'Formata os ficheiros .tf segundo o estilo canónico do Terraform', 'Gera documentação automática', 'Compacta o ficheiro de state'], a: 1, exp: 'terraform fmt reescreve os ficheiros .tf com indentação e alinhamento consistentes, seguindo o estilo canónico da linguagem — útil para manter consistência entre commits e equipas.', mod: 'HCL', diff: 'easy' },
  { q: 'O que é um "provider" em Terraform?', opts: ['Um ficheiro de configuração local', 'Um plugin que permite ao Terraform interagir com a API de uma plataforma (AWS, Azure, Kubernetes, etc.)', 'Um tipo de variável de ambiente', 'Um módulo obrigatório em qualquer projecto'], a: 1, exp: 'Um provider é um plugin (ex: hashicorp/aws, hashicorp/azurerm) que traduz os blocos "resource" e "data" da configuração em chamadas à API real da plataforma correspondente.', mod: 'Providers', diff: 'easy' },
  { q: 'Para que serve o "provisioner" num bloco de recurso?', opts: ['Definir permissões IAM', 'Executar acções (scripts, comandos) na criação ou destruição do recurso, como último recurso quando não há alternativa nativa', 'Escolher a região do provider', 'Validar variáveis de input'], a: 1, exp: 'Provisioners (local-exec, remote-exec) executam scripts durante o ciclo de vida de um recurso. A documentação oficial recomenda usá-los apenas como último recurso, preferindo ferramentas nativas de configuração (cloud-init, user_data) sempre que possível.', mod: 'Providers', diff: 'medium' },
  { q: 'Como se define uma versão mínima exigida para um provider específico?', opts: ['No bloco "variable"', 'No bloco "terraform { required_providers { ... } }"', 'No ficheiro terraform.tfvars', 'Através da flag --version no CLI'], a: 1, exp: 'O bloco required_providers dentro de "terraform {}" fixa a origem e a versão (ou intervalo de versões) de cada provider usado, garantindo builds reprodutíveis entre máquinas e pipelines.', mod: 'Providers', diff: 'medium' },
  { q: 'O que são "workspaces" no Terraform CLI (open-source)?', opts: ['Ambientes de execução na cloud da HashiCorp', 'Uma forma de gerir múltiplos states isolados a partir da mesma configuração (ex: dev/staging/prod)', 'Repositórios Git separados por módulo', 'Utilizadores com permissões diferentes'], a: 1, exp: 'Workspaces (terraform workspace new/select) permitem manter states separados para a mesma configuração — útil para variar entre ambientes sem duplicar código, embora para diferenças estruturais grandes seja preferível usar configurações/módulos separados.', mod: 'Workflow', diff: 'medium' },
  { q: 'Qual é a principal vantagem do Terraform Cloud/Terraform Registry num contexto empresarial?', opts: ['É a única forma de usar HCL', 'Oferece execução remota, state partilhado com locking, políticas (Sentinel/OPA) e um registry de módulos reutilizáveis', 'Elimina a necessidade de providers', 'Substitui o comando terraform plan'], a: 1, exp: 'O Terraform Cloud acrescenta execução remota, gestão de state partilhado com locking automático, controlo de acesso, políticas como código (Sentinel) e um registry privado/público de módulos — capacidades de colaboração que o CLI open-source sozinho não oferece.', mod: 'Terraform Cloud', diff: 'medium' },
  { q: 'O que acontece se dois recursos diferentes referenciarem o mesmo output de um data source que ainda não existe na primeira aplicação (ex: um recurso que outro vai criar)?', opts: ['O Terraform falha sempre sem alternativa', 'O Terraform Graph resolve a ordem de dependências automaticamente através de referências implícitas', 'É necessário usar "depends_on" manualmente em todos os casos', 'O plano é ignorado silenciosamente'], a: 1, exp: 'O Terraform constrói um grafo de dependências a partir das referências entre recursos (ex: um atributo de um recurso usado nos argumentos de outro) e ordena a criação automaticamente. "depends_on" só é necessário quando a dependência não é visível através de referências de atributos.', mod: 'HCL', diff: 'hard' },
];

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string; border: string }> = {
  easy: { label: 'Fácil', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  medium: { label: 'Médio', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  hard: { label: 'Difícil', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
};

type ExamMode = 'practice' | 'timed';
type ReviewMode = 'all' | 'wrong' | null;

const MODES: { id: ExamMode; label: string; desc: string; time?: number }[] = [
  { id: 'practice', label: 'Modo Prática', desc: 'Sem limite de tempo, revisa enquanto respondes', time: undefined },
  { id: 'timed', label: 'Modo Exame', desc: 'Tempo limitado — simula condições de exame real', time: 900 },
];

export default function TerraformAssociateExamSimulator() {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const examQuestions = useMemo(() => QUESTIONS, []);

  const {
    state, currentQuestion, score, percentage,
    handleStart, handleAnswer, handleNext, handleReset,
    shuffled,
  } = useQuizEngine({
    questions: examQuestions,
    autoShuffle: true,
    maxTime: mode === 'timed' ? 900 : undefined,
  });

  const diffCounts = useMemo(() => {
    const counts: Record<Difficulty, { total: number; correct: number }> = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 },
    };
    const questions = reviewMode === 'wrong'
      ? examQuestions.filter((_, i) => state.answers[i] !== null && state.answers[i] !== shuffled[i]?.a)
      : examQuestions;
    questions.forEach((q, i) => {
      const diff = (q as Question<TerraformModule>).diff;
      if (!diff) return;
      const isCorrect = state.answers[i] !== null && state.answers[i] === q.a;
      counts[diff].total++;
      if (isCorrect) counts[diff].correct++;
    });
    return counts;
  }, [state.answers, shuffled, reviewMode, examQuestions]);

  const diffTotal = Object.values(diffCounts).reduce((s, d) => s + d.total, 0);

  if (state.mode === 'menu' && !mode) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-5">
        <div className="flex justify-center mb-2"><Target size={40} className="text-violet-400" /></div>
        <h3 className="text-2xl font-bold text-white">Simulado · Terraform Associate</h3>
        <p className="text-slate-400 max-w-md mx-auto">{QUESTIONS.length} questões alinhadas com os objectivos do exame HashiCorp Certified: Terraform Associate — IaC, workflow, state, módulos, HCL e providers.</p>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[[String(QUESTIONS.length), 'Questões'], ['70%', 'Aprovação'], ['7', 'Tópicos']].map(([v, l]) => (
            <div key={l} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-black text-violet-300">{v}</div>
              <div className="text-2xs text-slate-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="pt-2 space-y-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Escolhe o modo</div>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-2xl border text-left transition-all hover:scale-102 ${
                  mode === m.id
                    ? 'border-violet-500/50 bg-violet-500/15'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {m.id === 'timed' && <Clock size={14} className="text-violet-400" />}
                  <span className={`text-sm font-bold ${mode === m.id ? 'text-violet-300' : 'text-slate-300'}`}>{m.label}</span>
                </div>
                <div className="text-2xs text-slate-500 leading-relaxed">{m.desc}</div>
                {m.time && (
                  <div className="mt-2 text-xs font-mono text-violet-400">{Math.floor(m.time / 60)} min</div>
                )}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => mode && handleStart()}
          disabled={!mode}
          className={`mt-2 px-8 py-3 rounded-2xl font-semibold text-md transition-all ${
            mode
              ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30'
              : 'bg-slate-800/50 border border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          Iniciar Simulado →
        </button>
      </div>
    );
  }

  if (state.mode === 'finished') {
    const pass = percentage >= 70;
    const wrongQuestions = examQuestions
      .map((q, i) => ({ q, idx: i }))
      .filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] !== q.a);

    return (
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-5">
        <Trophy size={40} className={pass ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
        <div>
          <div className="text-4xl font-black text-white">{percentage}%</div>
          <div className={`text-md font-semibold mt-1 ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {percentage >= 85 ? 'Excelente!' : percentage >= 70 ? 'Aprovado' : 'Precisa de mais estudo'}
          </div>
          <div className="text-slate-400 text-base mt-1">{score}/{QUESTIONS.length} respostas correctas · aprovação real ≥ 70%</div>
        </div>

        {diffTotal > 0 && (
          <div className="flex justify-center gap-6">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              const pct = diffCounts[d].total > 0
                ? Math.round((diffCounts[d].correct / diffCounts[d].total) * 100)
                : 0;
              return (
                <div key={d} className="text-center">
                  <div className={`text-lg font-black ${cfg.color}`}>{pct}%</div>
                  <div className={`text-2xs ${cfg.color}`}>{cfg.label} ({diffCounts[d].correct}/{diffCounts[d].total})</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-base hover:border-slate-600 transition-all"
          >
            <RotateCcw size={14} />Tentar de novo
          </button>
          <button
            onClick={() => { setReviewMode('wrong'); setHasStarted(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold text-base hover:bg-rose-500/20 transition-all"
          >
            <AlertCircle size={14} />Rever Erradas ({wrongQuestions.length})
          </button>
          <button
            onClick={() => { setReviewMode('all'); setHasStarted(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold text-base hover:bg-violet-500/20 transition-all"
          >
            <BarChart3 size={14} />Ver Todas
          </button>
        </div>
      </div>
    );
  }

  if (hasStarted && reviewMode) {
    const reviewQuestions = reviewMode === 'wrong'
      ? examQuestions.map((q, i) => ({ q, idx: i })).filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] !== q.a)
      : examQuestions.map((q, i) => ({ q, idx: i }));

    if (reviewQuestions.length === 0) {
      return (
        <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-4">
          <CheckCircle size={40} className="text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Nenhuma resposta errada!</h3>
          <p className="text-slate-400">Estás pronto para o exame. Bom trabalho!</p>
          <button onClick={handleReset} className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold hover:border-slate-600 transition-all">
            Voltar ao Menu
          </button>
        </div>
      );
    }

    const rq = reviewQuestions[0];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setReviewMode(null); setHasStarted(false); }}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">{reviewMode === 'wrong' ? 'Revisão de Erradas' : 'Revisão Completa'}</span>
            <span className="text-sm text-slate-500">{rq.idx + 1} / {examQuestions.length}</span>
          </div>
          {(rq.q as Question<TerraformModule>).diff && (
            <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${DIFFICULTY_CONFIG[(rq.q as Question<TerraformModule>).diff!].bg} ${DIFFICULTY_CONFIG[(rq.q as Question<TerraformModule>).diff!].color} ${DIFFICULTY_CONFIG[(rq.q as Question<TerraformModule>).diff!].border}`}>
              {DIFFICULTY_CONFIG[(rq.q as Question<TerraformModule>).diff!].label}
            </span>
          )}
        </div>

        <QuizRunner
          state={state}
          question={rq.q}
          onAnswer={(idx) => handleAnswer(rq.idx)}
          onNext={() => {}}
          score={score}
          total={reviewQuestions.length}
          percentage={percentage}
          accentColor="violet"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{state.current + 1} / {QUESTIONS.length}</span>
          {currentQuestion.diff && (
            <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${DIFFICULTY_CONFIG[currentQuestion.diff].bg} ${DIFFICULTY_CONFIG[currentQuestion.diff].color} ${DIFFICULTY_CONFIG[currentQuestion.diff].border}`}>
              {DIFFICULTY_CONFIG[currentQuestion.diff].label}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-2xs font-bold">
            {currentQuestion.mod}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {mode === 'timed' && state.timeRemaining !== undefined && (
            <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${state.timeRemaining <= 60 ? 'text-rose-400 animate-pulse' : state.timeRemaining <= 180 ? 'text-amber-400' : 'text-slate-400'}`}>
              <Clock size={14} />
              {Math.floor(state.timeRemaining / 60)}:{String(state.timeRemaining % 60).padStart(2, '0')}
            </div>
          )}
          <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${((state.current + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <QuizRunner
        state={state}
        question={currentQuestion}
        onAnswer={handleAnswer}
        onNext={handleNext}
        score={score}
        total={QUESTIONS.length}
        percentage={percentage}
        accentColor="violet"
      />
    </div>
  );
}
