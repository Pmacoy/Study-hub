import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy } from 'lucide-react';

const QUESTIONS = [
  { q: 'Qual é a diferença entre Continuous Delivery e Continuous Deployment?', opts: ['São a mesma coisa, apenas nomes diferentes', 'Continuous Delivery faz deploy automático; Deployment requer aprovação', 'Continuous Delivery requer aprovação manual para produção; Deployment faz deploy automático', 'Continuous Deployment é para staging; Delivery é para produção'], a: 2, exp: 'Continuous Delivery garante que o código está sempre em estado deployável, mas o deploy para produção é manual. Continuous Deployment vai um passo além e faz deploy automático em cada commit aprovado.', mod: 'DevOps Intro' },
  { q: 'No Git, qual o comando para re-aplicar commits de uma branch sobre outra sem criar merge commits?', opts: ['git merge --no-ff', 'git rebase', 'git cherry-pick', 'git reset --hard'], a: 1, exp: 'git rebase re-aplica os commits da branch actual sobre a branch de destino, criando um histórico linear sem merge commits. Nunca fazer rebase em branches partilhadas com outros developers.', mod: 'Git' },
  { q: 'O que significa o princípio "shift-left" em DevSecOps?', opts: ['Mover a equipa de operações para a esquerda no organograma', 'Integrar controlos de segurança no início do SDLC, não só no final', 'Usar Git flow em vez de trunk-based development', 'Deslocar os servidores para datacenters mais à esquerda geograficamente'], a: 1, exp: 'Shift-left significa antecipar os controlos de segurança para as fases iniciais do ciclo de vida (planeamento, código, build) em vez de os deixar apenas para o final. Encontrar vulnerabilidades mais cedo é muito mais barato.', mod: 'DevSecOps' },
  { q: 'Num Dockerfile multi-stage build, qual é o principal benefício?', opts: ['Acelera o tempo de build significativamente', 'A imagem final contém apenas o necessário para executar, sem ferramentas de build', 'Permite usar múltiplas linguagens de programação', 'Melhora a segurança de rede do container'], a: 1, exp: 'Multi-stage builds permitem usar uma imagem com ferramentas de build (node, maven, gcc) num stage, e copiar apenas os artefactos gerados para uma imagem base mínima. Resultado: imagens menores e mais seguras.', mod: 'Docker' },
  { q: 'O que é um PersistentVolumeClaim (PVC) no Kubernetes?', opts: ['Um backup automático de volumes', 'Um pedido de armazenamento por parte de um Pod', 'Uma classe de armazenamento para SSDs', 'Um tipo de Service para storage'], a: 1, exp: 'O PVC é um pedido de armazenamento feito por um utilizador/Pod. Separa o "o que quero" (PVC) do "como é implementado" (PV). O StorageClass pode provisionar PVs dinamicamente em resposta a PVCs.', mod: 'Kubernetes' },
  { q: 'Qual dos seguintes tipos de Service do Kubernetes expõe a aplicação externamente via um load balancer da cloud?', opts: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'], a: 2, exp: 'LoadBalancer provisiona automaticamente um load balancer externo do cloud provider (Azure LB, AWS ELB, GCP LB). ClusterIP é só interno. NodePort expõe via porta do nó. ExternalName mapeia para um DNS externo.', mod: 'Kubernetes' },
  { q: 'No Terraform, o que acontece quando executas "terraform plan"?', opts: ['Aplica as mudanças de infra imediatamente', 'Gera um diff entre o estado actual e a configuração desejada, sem fazer mudanças', 'Valida apenas a sintaxe HCL', 'Inicializa os providers e o backend'], a: 1, exp: 'terraform plan compara o estado actual (tfstate) com a configuração HCL desejada e apresenta um diff de recursos a criar/modificar/destruir. Não faz nenhuma mudança real. É essencial rever o plan antes de aplicar.', mod: 'Terraform' },
  { q: 'Qual ferramenta é usada para fazer SAST (análise estática de segurança) do código?', opts: ['Trivy', 'OWASP ZAP', 'SonarQube', 'Prometheus'], a: 2, exp: 'SonarQube analisa o código fonte estaticamente (sem executar) para encontrar bugs, code smells e vulnerabilidades de segurança. Trivy faz scan de containers/dependências. OWASP ZAP é DAST (dinâmico). Prometheus é monitorização.', mod: 'DevSecOps' },
  { q: 'O que é o "Error Budget" no contexto de SRE/SLO?', opts: ['O orçamento financeiro para corrigir erros em produção', 'A quantidade de falhas permitidas antes de quebrar o SLO', 'O número máximo de bugs por sprint', 'O custo de cada incidente de produção'], a: 1, exp: 'Error Budget = 100% - SLO. Se o SLO é 99.9% availability, o error budget é 0.1% de tempo de falha permitido. Quando o budget é consumido, a equipa deve parar features e focar em reliability. É a base do modelo SRE.', mod: 'Monitoring' },
  { q: 'Qual é a diferença entre ENTRYPOINT e CMD no Dockerfile?', opts: ['São equivalentes, mas ENTRYPOINT é preferido', 'ENTRYPOINT define o executável principal (não sobreponível facilmente); CMD define argumentos default (sobreponíveis)', 'CMD define o executável principal; ENTRYPOINT são os argumentos', 'ENTRYPOINT é para produção; CMD é para desenvolvimento'], a: 1, exp: 'ENTRYPOINT define o executável que corre sempre (ex: ["node"]). CMD fornece argumentos default ao ENTRYPOINT (ex: ["server.js"]) e pode ser sobreponível em docker run. Juntos: ENTRYPOINT ["node"] + CMD ["server.js"] → executa "node server.js".', mod: 'Docker' },
  { q: 'No Kubernetes RBAC, qual a diferença entre Role e ClusterRole?', opts: ['Role é para admins; ClusterRole é para developers', 'Role aplica permissões num namespace específico; ClusterRole aplica em todo o cluster', 'São equivalentes mas com nomes históricos diferentes', 'ClusterRole é deprecado nas versões recentes'], a: 1, exp: 'Role define permissões scoped a um namespace específico (ex: pod reader em "prod"). ClusterRole aplica permissões em todos os namespaces ou a recursos cluster-level (nodes, PV). RoleBinding e ClusterRoleBinding associam roles a sujeitos.', mod: 'Kubernetes' },
  { q: 'O que é OIDC no contexto de CI/CD e por que é preferível a service account keys?', opts: ['É um protocolo de autenticação que usa tokens efémeros em vez de credenciais estáticas', 'É uma forma de encriptação de secrets no pipeline', 'É um standard para gerir roles no Kubernetes', 'É um tipo de certificado TLS para pipelines'], a: 0, exp: 'OIDC (OpenID Connect) permite que GitHub Actions (e outros CI/CD) obtenha um token temporário do cloud provider via federated identity. Não há secrets estáticos a gerir, tokens expiram em ~15 minutos, e é auditável. Suportado em AWS, Azure e GCP.', mod: 'CI/CD' },
  { q: 'Qual estratégia de deploy distribui uma percentagem pequena do tráfego para a nova versão antes de fazer rollout completo?', opts: ['Blue-Green', 'Rolling', 'Canary', 'Recreate'], a: 2, exp: 'Canary deployment envia uma fracção do tráfego (ex: 5-10%) para a nova versão enquanto o resto permanece na versão estável. As métricas são monitorizadas antes de fazer rollout completo. Permite validar em produção com risco mínimo.', mod: 'DevOps Intro' },
  { q: 'No Prometheus, o que é uma "Recording Rule"?', opts: ['Uma rule que grava o histórico completo de alertas', 'Uma expressão PromQL pré-calculada e guardada como nova série temporal', 'Uma configuração para gravar métricas em disco', 'Um tipo de alerta com gravidade recording'], a: 1, exp: 'Recording rules pré-calculam expressões PromQL complexas e guardam o resultado como uma nova série temporal. Melhora a performance de queries lentas em dashboards. Ex: job:request_rate5m:rate = rate(requests_total[5m]).', mod: 'Monitoring' },
  { q: 'O que é "Infrastructure Drift" no contexto de IaC?', opts: ['A tendência natural das clouds de aumentar os preços ao longo do tempo', 'Divergência entre o estado definido em código e o estado real da infraestrutura', 'A latência crescente em sistemas de infra antiga', 'Migração gradual de on-premises para cloud'], a: 1, exp: 'Infrastructure Drift ocorre quando a infra real difere do que está definido no código IaC, geralmente por mudanças manuais no portal/CLI. O Terraform detecta drift com "terraform plan". A solução é nunca fazer mudanças manuais — tudo via código.', mod: 'Terraform' },
  { q: 'Qual é a função do "liveness probe" num Pod Kubernetes?', opts: ['Verificar se o container está pronto para receber tráfego', 'Determinar se o container deve ser reiniciado por estar num estado não-recuperável', 'Monitorizar a performance do container', 'Verificar se a imagem está actualizada'], a: 1, exp: 'Liveness probe determina se o container está "vivo". Se falhar, o kubelet reinicia o container. Readiness probe (diferente!) determina se o container está pronto para receber tráfego — se falhar, remove-o do Service endpoints sem o reiniciar.', mod: 'Kubernetes' },
  { q: 'Em Git, o comando "git commit --amend" serve para:', opts: ['Criar um commit em modo silencioso', 'Modificar o último commit (mensagem ou conteúdo)', 'Reverter o último commit', 'Aplicar um commit de outra branch'], a: 1, exp: 'git commit --amend modifica o último commit, permitindo alterar a mensagem ou adicionar ficheiros esquecidos. ATENÇÃO: re-escreve o histórico — nunca usar em commits já pushed para branches partilhadas!', mod: 'Git' },
  { q: 'O que é um "Quality Gate" no SonarQube?', opts: ['Um filtro de qualidade no código fonte', 'Um conjunto de critérios que o código deve cumprir para continuar no pipeline', 'A interface gráfica do SonarQube', 'Uma regra de routing no load balancer'], a: 1, exp: 'Quality Gate é um conjunto de condições que o código deve cumprir para "passar" (ex: cobertura ≥ 80%, zero bugs críticos, vulnerabilidades = 0). Se falhar, o pipeline é bloqueado. É o principal mecanismo de enforcement de qualidade e segurança.', mod: 'DevSecOps' },
  { q: 'No Linux, o que representa a permissão "755" num ficheiro?', opts: ['Dono: leitura; Grupo: escrita; Outros: execução', 'Dono: tudo; Grupo: leitura+execução; Outros: leitura+execução', 'Dono: leitura+escrita; Grupo: tudo; Outros: execução', 'Todos têm permissão total'], a: 1, exp: '755 = Dono(7=rwx) + Grupo(5=r-x) + Outros(5=r-x). É a permissão padrão para scripts executáveis: o dono pode ler/escrever/executar, grupo e outros podem ler e executar. 644 é para ficheiros de config (rw-r--r--).' , mod: 'Linux' },
  { q: 'O que é "Trunk-Based Development" e qual o principal requisito?', opts: ['Desenvolver sempre numa branch chamada "trunk" sem merges', 'Todos os developers commitam directamente ou via branches de curta duração para main, requerendo feature flags', 'Uma estratégia só usada em empresas com mais de 100 developers', 'Usar apenas commits em main, proibindo branches'], a: 1, exp: 'TBD é uma estratégia onde todos commitam frequentemente para main (trunk), usando feature flags para código inacabado. Requer: CI muito rápido, testes sólidos e feature flags. Maximiza velocidade e minimiza merge conflicts. Usado por Google, Facebook, Netflix.', mod: 'Git' },
];

export default function ExamSimulator() {
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
      <div className="text-4xl">🎯</div>
      <h3 className="text-2xl font-bold text-white">Simulado DevOps</h3>
      <p className="text-slate-400 max-w-md mx-auto">{QUESTIONS.length} questões cobrindo os módulos: DevOps, Git, Docker, Kubernetes, Terraform, CI/CD, Monitoring e Security.</p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
        {[['20', 'Questões'], ['60%', 'Aprovação'], ['18', 'Módulos'], ].map(([v, l]) => (
          <div key={l} className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xl font-black text-violet-300">{v}</div>
            <div className="text-[10px] text-slate-500">{l}</div>
          </div>
        ))}
      </div>
      <button onClick={() => setStarted(true)} className="mt-2 px-8 py-3 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-semibold text-[14px] hover:bg-violet-500/30 transition-all">
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
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-[10px] font-bold">{q.mod}</span>
        </div>
        <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }} />
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
          <button onClick={handleNext} className="mt-3 px-5 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-semibold text-[12px] hover:bg-violet-500/30 transition-all">
            {current < QUESTIONS.length - 1 ? 'Próxima questão →' : 'Ver resultados →'}
          </button>
        </div>
      )}
    </div>
  );
}
