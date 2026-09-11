import { RotateCcw, Trophy, Target, CheckCircle, XCircle, Clock, AlertCircle, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { useQuizEngine, type Question } from '../../hooks/useQuizEngine';
import QuizRunner from '../shared/QuizRunner';
import { useState, useMemo } from 'react';

type DevOpsModule = 'DevOps Intro' | 'Git' | 'DevSecOps' | 'Docker' | 'Kubernetes' | 'Terraform' | 'CI/CD' | 'Monitoring' | 'Linux';

export const QUESTIONS: Question<DevOpsModule>[] = [
  { q: 'Qual é a diferença entre Continuous Delivery e Continuous Deployment?', opts: ['São a mesma coisa, apenas nomes diferentes', 'Continuous Delivery faz deploy automático; Deployment requer aprovação', 'Continuous Delivery requer aprovação manual para produção; Deployment faz deploy automático', 'Continuous Deployment é para staging; Delivery é para produção'], a: 2, exp: 'Continuous Delivery garante que o código está sempre em estado deployável, mas o deploy para produção é manual. Continuous Deployment vai um passo além e faz deploy automático em cada commit aprovado.', mod: 'DevOps Intro', diff: 'easy' },
  { q: 'No Git, qual o comando para re-aplicar commits de uma branch sobre outra sem criar merge commits?', opts: ['git merge --no-ff', 'git rebase', 'git cherry-pick', 'git reset --hard'], a: 1, exp: 'git rebase re-aplica os commits da branch actual sobre a branch de destino, criando um histórico linear sem merge commits. Nunca fazer rebase em branches partilhadas com outros developers.', mod: 'Git', diff: 'medium' },
  { q: 'O que significa o princípio "shift-left" em DevSecOps?', opts: ['Mover a equipa de operações para a esquerda no organograma', 'Integrar controlos de segurança no início do SDLC, não só no final', 'Usar Git flow em vez de trunk-based development', 'Deslocar os servidores para datacenters mais à esquerda geograficamente'], a: 1, exp: 'Shift-left significa antecipar os controlos de segurança para as fases iniciais do ciclo de vida (planeamento, código, build) em vez de os deixar apenas para o final. Encontrar vulnerabilidades mais cedo é muito mais barato.', mod: 'DevSecOps', diff: 'easy' },
  { q: 'Num Dockerfile multi-stage build, qual é o principal benefício?', opts: ['Acelera o tempo de build significativamente', 'A imagem final contém apenas o necessário para executar, sem ferramentas de build', 'Permite usar múltiplas linguagens de programação', 'Melhora a segurança de rede do container'], a: 1, exp: 'Multi-stage builds permitem usar uma imagem com ferramentas de build (node, maven, gcc) num stage, e copiar apenas os artefactos gerados para uma imagem base mínima. Resultado: imagens menores e mais seguras.', mod: 'Docker', diff: 'medium' },
  { q: 'O que é um PersistentVolumeClaim (PVC) no Kubernetes?', opts: ['Um backup automático de volumes', 'Um pedido de armazenamento por parte de um Pod', 'Uma classe de armazenamento para SSDs', 'Um tipo de Service para storage'], a: 1, exp: 'O PVC é um pedido de armazenamento feito por um utilizador/Pod. Separa o "o que quero" (PVC) do "como é implementado" (PV). O StorageClass pode provisionar PVs dinamicamente em resposta a PVCs.', mod: 'Kubernetes', diff: 'easy' },
  { q: 'Qual dos seguintes tipos de Service do Kubernetes expõe a aplicação externamente via um load balancer da cloud?', opts: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'], a: 2, exp: 'LoadBalancer provisiona automaticamente um load balancer externo do cloud provider (Azure LB, AWS ELB, GCP LB). ClusterIP é só interno. NodePort expõe via porta do nó. ExternalName mapeia para um DNS externo.', mod: 'Kubernetes', diff: 'easy' },
  { q: 'No Terraform, o que acontece quando executas "terraform plan"?', opts: ['Aplica as mudanças de infra imediatamente', 'Gera um diff entre o estado actual e a configuração desejada, sem fazer mudanças', 'Valida apenas a sintaxe HCL', 'Inicializa os providers e o backend'], a: 1, exp: 'terraform plan compara o estado actual (tfstate) com a configuração HCL desejada e apresenta um diff de recursos a criar/modificar/destruir. Não faz nenhuma mudança real. É essencial rever o plan antes de aplicar.', mod: 'Terraform', diff: 'medium' },
  { q: 'Qual ferramenta é usada para fazer SAST (análise estática de segurança) do código?', opts: ['Trivy', 'OWASP ZAP', 'SonarQube', 'Prometheus'], a: 2, exp: 'SonarQube analisa o código fonte estaticamente (sem executar) para encontrar bugs, code smells e vulnerabilidades de segurança. Trivy faz scan de containers/dependências. OWASP ZAP é DAST (dinâmico). Prometheus é monitorização.', mod: 'DevSecOps', diff: 'medium' },
  { q: 'O que é o "Error Budget" no contexto de SRE/SLO?', opts: ['O orçamento financeiro para corrigir erros em produção', 'A quantidade de falhas permitidas antes de quebrar o SLO', 'O número máximo de bugs por sprint', 'O custo de cada incidente de produção'], a: 1, exp: 'Error Budget = 100% - SLO. Se o SLO é 99.9% availability, o error budget é 0.1% de tempo de falha permitido. Quando o budget é consumido, a equipa deve parar features e focar em reliability. É a base do modelo SRE.', mod: 'Monitoring', diff: 'hard' },
  { q: 'Qual é a diferença entre ENTRYPOINT e CMD no Dockerfile?', opts: ['São equivalentes, mas ENTRYPOINT é preferido', 'ENTRYPOINT define o executável principal (não sobreponível facilmente); CMD define argumentos default (sobreponíveis)', 'CMD define o executável principal; ENTRYPOINT são os argumentos', 'ENTRYPOINT é para produção; CMD é para desenvolvimento'], a: 1, exp: 'ENTRYPOINT define o executável que corre sempre (ex: ["node"]). CMD fornece argumentos default ao ENTRYPOINT (ex: ["server.js"]) e pode ser sobreponível em docker run. Juntos: ENTRYPOINT ["node"] + CMD ["server.js"] → executa "node server.js".', mod: 'Docker', diff: 'medium' },
  { q: 'No Kubernetes RBAC, qual a diferença entre Role e ClusterRole?', opts: ['Role é para admins; ClusterRole é para developers', 'Role aplica permissões num namespace específico; ClusterRole aplica em todo o cluster', 'São equivalentes mas com nomes históricos diferentes', 'ClusterRole é deprecado nas versões recentes'], a: 1, exp: 'Role define permissões scoped a um namespace específico (ex: pod reader em "prod"). ClusterRole aplica permissões em todos os namespaces ou a recursos cluster-level (nodes, PV). RoleBinding e ClusterRoleBinding associam roles a sujeitos.', mod: 'Kubernetes', diff: 'medium' },
  { q: 'O que é OIDC no contexto de CI/CD e por que é preferível a service account keys?', opts: ['É um protocolo de autenticação que usa tokens efémeros em vez de credenciais estáticas', 'É uma forma de encriptação de secrets no pipeline', 'É um standard para gerir roles no Kubernetes', 'É um tipo de certificado TLS para pipelines'], a: 0, exp: 'OIDC (OpenID Connect) permite que GitHub Actions (e outros CI/CD) obtenha um token temporário do cloud provider via federated identity. Não há secrets estáticas a gerir, tokens expiram em ~15 minutos, e é auditável. Suportado em AWS, Azure e GCP.', mod: 'CI/CD', diff: 'hard' },
  { q: 'Qual estratégia de deploy distribui uma percentagem pequena do tráfego para a nova versão antes de fazer rollout completo?', opts: ['Blue-Green', 'Rolling', 'Canary', 'Recreate'], a: 2, exp: 'Canary deployment envia uma fracção do tráfego (ex: 5-10%) para a nova versão enquanto o resto permanece na versão estável. As métricas são monitorizadas antes de fazer rollout completo. Permite validar em produção com risco mínimo.', mod: 'DevOps Intro', diff: 'easy' },
  { q: 'No Prometheus, o que é uma "Recording Rule"?', opts: ['Uma rule que grava o histórico completo de alertas', 'Uma expressão PromQL pré-calculada e guardada como nova série temporal', 'Uma configuração para gravar métricas em disco', 'Um tipo de alerta com gravidade recording'], a: 1, exp: 'Recording rules pré-calculam expressões PromQL complexas e guardam o resultado como uma nova série temporal. Melhora a performance de queries lentas em dashboards. Ex: job:request_rate5m:rate = rate(requests_total[5m]).', mod: 'Monitoring', diff: 'hard' },
  { q: 'O que é "Infrastructure Drift" no contexto de IaC?', opts: ['A tendência natural das clouds de aumentar os preços ao longo do tempo', 'Divergência entre o estado definido em código e o estado real da infraestrutura', 'A latência crescente em sistemas de infra antiga', 'Migração gradual de on-premises para cloud'], a: 1, exp: 'Infrastructure Drift ocorre quando a infra real difere do que está definido no código IaC, geralmente por mudanças manuais no portal/CLI. O Terraform detecta drift com "terraform plan". A solução é nunca fazer mudanças manuais — tudo via código.', mod: 'Terraform', diff: 'medium' },
  { q: 'Qual é a função do "liveness probe" num Pod Kubernetes?', opts: ['Verificar se o container está pronto para receber tráfego', 'Determinar se o container deve ser reiniciado por estar num estado não-recuperável', 'Monitorizar a performance do container', 'Verificar se a imagem está actualizada'], a: 1, exp: 'Liveness probe determina se o container está "vivo". Se falhar, o kubelet reinicia o container. Readiness probe (diferente!) determina se o container está pronto para receber tráfego — se falhar, remove-o do Service endpoints sem o reiniciar.', mod: 'Kubernetes', diff: 'medium' },
  { q: 'Em Git, o comando "git commit --amend" serve para:', opts: ['Criar um commit em modo silencioso', 'Modificar o último commit (mensagem ou conteúdo)', 'Reverter o último commit', 'Aplicar um commit de outra branch'], a: 1, exp: 'git commit --amend modifica o último commit, permitindo alterar a mensagem ou adicionar ficheiros esquecidos. ATENÇÃO: re-escreve o histórico — nunca usar em commits já pushed para branches partilhadas!', mod: 'Git', diff: 'easy' },
  { q: 'O que é um "Quality Gate" no SonarQube?', opts: ['Um filtro de qualidade no código fonte', 'Um conjunto de critérios que o código deve cumprir para continuar no pipeline', 'A interface gráfica do SonarQube', 'Uma regra de routing no load balancer'], a: 1, exp: 'Quality Gate é um conjunto de condições que o código deve cumprir para "passar" (ex: cobertura ≥ 80%, zero bugs críticos, vulnerabilidades = 0). Se falhar, o pipeline é bloqueado. É o principal mecanismo de enforcement de qualidade e segurança.', mod: 'DevSecOps', diff: 'easy' },
  { q: 'No Linux, o que representa a permissão "755" num ficheiro?', opts: ['Dono: leitura; Grupo: escrita; Outros: execução', 'Dono: tudo; Grupo: leitura+execução; Outros: leitura+execução', 'Dono: leitura+escrita; Grupo: tudo; Outros: execução', 'Todos têm permissão total'], a: 1, exp: '755 = Dono(7=rwx) + Grupo(5=r-x) + Outros(5=r-x). É a permissão padrão para scripts executáveis: o dono pode ler/escrever/executar, grupo e outros podem ler e executar. 644 é para ficheiros de config (rw-r--r--).', mod: 'Linux', diff: 'easy' },
  { q: 'O que é "Trunk-Based Development" e qual o principal requisito?', opts: ['Desenvolver sempre numa branch chamada "trunk" sem merges', 'Todos os developers commitam directamente ou via branches de curta duração para main, requerendo feature flags', 'Uma estratégia só usada em empresas com mais de 100 developers', 'Usar apenas commits em main, proibindo branches'], a: 1, exp: 'TBD é uma estratégia onde todos commitam frequentemente para main (trunk), usando feature flags para código inacabado. Requer: CI muito rápido, testes sólidos e feature flags. Maximiza velocidade e minimiza merge conflicts. Usado por Google, Facebook, Netflix.', mod: 'Git', diff: 'hard' },
  { q: 'O que faz o comando "docker ps --filter "status=exited""?', opts: ['Mostra containers em execução', 'Mostra containers que pararam (exit code diferente de 0)', 'Mostra todos os containers including os parados', 'Mostra containers com erro de rede'], a: 1, exp: 'docker ps --filter "status=exited" mostra containers que pararam de correr. O flag --filter permite filtrar por status: running, exited, created, dead. Container exited com code 0 é normal; code diferente indica erro.', mod: 'Docker', diff: 'easy' },
  { q: 'Num pipeline CI/CD GitLab, o que é um "runner tag"?', opts: ['Uma forma de etiquetar commits', 'Uma标签 que permite selecionar runners específicos para jobs', 'Um tipo de branch protection rule', 'Uma métrica de performance do pipeline'], a: 1, exp: 'Runner tags permitem asociar runners com capabilities específicas a jobs específicos. Ex: job com tags ["docker", "linux"] só corre em runners que têm essas tags. Isto permite dividir carga de trabalho entre runners especializados.', mod: 'CI/CD', diff: 'medium' },
  { q: 'Qual é o propósito do arquivo .dockerignore?', opts: ['Ignorar erros no Dockerfile', 'Excluir ficheiros/directorias da contexto de build do Docker', 'Desactivar certas instruções Docker', 'Ignorar volumes durante o build'], a: 1, exp: '.dockerignore funciona como .gitignore mas para o contexto de build do Docker. Exclui ficheiros grandes (node_modules, .git) que não pertencem à imagem final, reduzindo tempo de build e tamanho da imagem.', mod: 'Docker', diff: 'easy' },
  { q: 'O que é "kubectl rollout undo"?', opts: ['Apaga o deployment', 'Reverte o deployment para a revisão anterior', 'Reinicia todos os pods', 'Mostra o histórico de rollouts'], a: 1, exp: 'kubectl rollout undo deploy/<nome> reverte para a revisão anterior. Cada aplicação de um deployment cria uma nova revisão. O Kubernetes guarda histórico suficiente para fazer rollback. Útil quando um deploy quebra produção.', mod: 'Kubernetes', diff: 'medium' },
  { q: 'Num cenário Terraform, o que é o "state lock"?', opts: ['Um backup do tfstate', 'Um mecanismo que previne execução concorrente de terraform apply', 'Uma encriptação do tfstate', 'Um tipo de resource provider'], a: 1, exp: 'Terraform locking previne que duas instâncias façam apply simultaneamente no mesmo estado, evitando corrupção. Em AWS usa DynamoDB; em Azure usa Storage Account lease; em GCS usa locking nativo do bucket.', mod: 'Terraform', diff: 'medium' },
  { q: 'Qual é a diferença entre um alert e a recording rule no Prometheus?', opts: ['Não há diferença', 'Alerts geram notificações; recording rules pré-calculam métricas para dashboards', 'Recording rules são para logs; alerts para métricas', 'Alerts são manuais; recording rules automáticas'], a: 1, exp: 'Recording rules pré-calculam expressões PromQL complexas e guardam o resultado como série temporal (performance). Alert rules definem condições que disparam alerts quando true por tempo suficiente (notificações). São complementares: recording melhora dashboards, alert dispara notificações.', mod: 'Monitoring', diff: 'hard' },
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
  { id: 'timed', label: 'Modo Exame', desc: 'Tempo limitado — simula condições de exame real', time: 600 },
];

export default function ExamSimulator() {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>(null);
  const [showWrongOnly, setShowWrongOnly] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const timedQuestions = useMemo(() => QUESTIONS, []);

  const {
    state, currentQuestion, score, percentage,
    handleStart, handleAnswer, handleNext, handleReset,
    shuffled, weakPoints,
  } = useQuizEngine({
    questions: timedQuestions,
    autoShuffle: true,
    maxTime: mode === 'timed' ? 600 : undefined,
  });

  const diffCounts = useMemo(() => {
    const counts: Record<Difficulty, { total: number; correct: number }> = {
      easy: { total: 0, correct: 0 },
      medium: { total: 0, correct: 0 },
      hard: { total: 0, correct: 0 },
    };
    const questions = reviewMode === 'wrong'
      ? timedQuestions.filter((_, i) => state.answers[i] !== null && state.answers[i] !== shuffled[i]?.a)
      : timedQuestions;
    questions.forEach((q, i) => {
      const diff = (q as Question<DevOpsModule>).diff;
      if (!diff) return;
      const isCorrect = state.answers[i] !== null && state.answers[i] === q.a;
      counts[diff].total++;
      if (isCorrect) counts[diff].correct++;
    });
    return counts;
  }, [state.answers, shuffled, reviewMode, timedQuestions]);

  const diffTotal = Object.values(diffCounts).reduce((s, d) => s + d.total, 0);
  const diffCorrect = Object.values(diffCounts).reduce((s, d) => s + d.correct, 0);

  // Menu inicial
  if (state.mode === 'menu' && !mode) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-5">
        <div className="flex justify-center mb-2"><Target size={40} className="text-violet-400" /></div>
        <h3 className="text-2xl font-bold text-white">Simulado DevOps</h3>
        <p className="text-slate-400 max-w-md mx-auto">{QUESTIONS.length} questões cobrindo os módulos: DevOps, Git, Docker, Kubernetes, Terraform, CI/CD, Monitoring e Security.</p>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[['26', 'Questões'], ['60%', 'Aprovação'], ['9', 'Módulos']].map(([v, l]) => (
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

  // Resultado final
  if (state.mode === 'finished') {
    const pass = percentage >= 60;
    const wrongQuestions = timedQuestions
      .map((q, i) => ({ q, idx: i }))
      .filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] !== q.a);
    const correctQuestions = timedQuestions
      .map((q, i) => ({ q, idx: i }))
      .filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] === q.a);

    return (
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-5">
        <Trophy size={40} className={pass ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
        <div>
          <div className="text-4xl font-black text-white">{percentage}%</div>
          <div className={`text-md font-semibold mt-1 ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {percentage >= 80 ? 'Excelente!' : percentage >= 60 ? 'Aprovado' : 'Precisa de mais estudo'}
          </div>
          <div className="text-slate-400 text-base mt-1">{score}/{QUESTIONS.length} respostas correctas</div>
        </div>

        {/* Difficulty breakdown */}
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

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-base hover:border-slate-600 transition-all"
          >
            <RotateCcw size={14} />Tentar de novo
          </button>
          <button
            onClick={() => { setReviewMode('wrong'); setShowWrongOnly(true); setHasStarted(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold text-base hover:bg-rose-500/20 transition-all"
          >
            <AlertCircle size={14} />Rever Erradas ({wrongQuestions.length})
          </button>
          <button
            onClick={() => { setReviewMode('all'); setShowWrongOnly(false); setHasStarted(true); }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold text-base hover:bg-violet-500/20 transition-all"
          >
            <BarChart3 size={14} />Ver Todas
          </button>
        </div>
      </div>
    );
  }

  // Review mode — show all wrong answers
  if (hasStarted && reviewMode) {
    const reviewQuestions = reviewMode === 'wrong'
      ? timedQuestions.map((q, i) => ({ q, idx: i })).filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] !== q.a)
      : timedQuestions.map((q, i) => ({ q, idx: i }));

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
    const answered = state.answers[rq.idx] !== null;
    const answeredIndex = state.answers[rq.idx];
    const isCorrect = answeredIndex === rq.q.a;

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
            <span className="text-sm text-slate-500">{rq.idx + 1} / {timedQuestions.length}</span>
          </div>
          {(rq.q as Question<DevOpsModule>).diff && (
            <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${DIFFICULTY_CONFIG[(rq.q as Question<DevOpsModule>).diff!].bg} ${DIFFICULTY_CONFIG[(rq.q as Question<DevOpsModule>).diff!].color} ${DIFFICULTY_CONFIG[(rq.q as Question<DevOpsModule>).diff!].border}`}>
              {DIFFICULTY_CONFIG[(rq.q as Question<DevOpsModule>).diff!].label}
            </span>
          )}
        </div>

        <QuizRunner
          state={state}
          question={rq.q}
          onAnswer={(idx) => handleAnswer(rq.idx)}
          onNext={() => {
            const currentIdx = reviewMode === 'wrong'
              ? reviewQuestions.findIndex((r) => r.idx === rq.idx)
              : rq.idx;
            const next = reviewMode === 'wrong'
              ? reviewQuestions[currentIdx + 1]
              : timedQuestions[currentIdx + 1];
            if (next) {
              // We need to manually navigate — for now, just reset and let user pick again
            }
          }}
          score={score}
          total={reviewQuestions.length}
          percentage={percentage}
          accentColor="violet"
        />
      </div>
    );
  }

  // Quiz em progresso
  return (
    <div className="space-y-4">
      {/* Header com timer, módulo e progresso */}
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
