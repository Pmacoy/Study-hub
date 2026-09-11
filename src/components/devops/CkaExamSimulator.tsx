import { RotateCcw, Trophy, Target, CheckCircle, XCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { useQuizEngine, type Question } from '../../hooks/useQuizEngine';
import QuizRunner from '../shared/QuizRunner';
import { useState, useMemo } from 'react';

export type CkaModule =
  | 'Arquitectura & kubeadm'
  | 'Workloads & Scheduling'
  | 'Serviços & Rede'
  | 'Armazenamento'
  | 'Troubleshooting';

// Banco de questões para o Certified Kubernetes Administrator (CKA).
// Cobre os domínios oficiais do exame: arquitectura de cluster & kubeadm,
// workloads & scheduling, serviços & rede, armazenamento e troubleshooting.
export const QUESTIONS: Question<CkaModule>[] = [
  { q: 'Qual comando inicializa o control plane de um cluster Kubernetes com kubeadm?', opts: ['kubeadm init', 'kubeadm start', 'kubectl init cluster', 'kube-init --control-plane'], a: 0, exp: '`kubeadm init` inicializa o control plane (API server, etcd, controller-manager, scheduler) e imprime o comando `kubeadm join` para os nós worker.', mod: 'Arquitectura & kubeadm', diff: 'easy' },
  { q: 'Onde é armazenado o estado do cluster (objectos, configuração) num cluster Kubernetes padrão?', opts: ['No kubelet de cada nó', 'No etcd', 'No API server (em memória)', 'No ficheiro kubeconfig'], a: 1, exp: 'O etcd é a base de dados chave-valor distribuída que armazena todo o estado do cluster. É o único componente com estado persistente no control plane.', mod: 'Arquitectura & kubeadm', diff: 'easy' },
  { q: 'Qual componente do control plane é responsável por decidir em que nó um novo Pod deve correr?', opts: ['kube-controller-manager', 'kube-scheduler', 'kubelet', 'kube-proxy'], a: 1, exp: 'O kube-scheduler observa Pods sem nó atribuído e escolhe o nó mais adequado com base em requisitos de recursos, afinidade, taints/tolerations, etc.', mod: 'Arquitectura & kubeadm', diff: 'medium' },
  { q: 'Como se gera o comando de "join" para adicionar um novo nó worker, caso o token original tenha expirado?', opts: ['kubeadm token create --print-join-command', 'kubectl get join-command', 'kubeadm init --renew-token', 'Não é possível, é preciso reinstalar o cluster'], a: 0, exp: 'Os tokens de bootstrap do kubeadm expiram (24h por defeito). `kubeadm token create --print-join-command` gera um novo token válido e imprime o comando `kubeadm join` completo.', mod: 'Arquitectura & kubeadm', diff: 'medium' },
  { q: 'Qual é a função do kubelet em cada nó?', opts: ['Encaminhar tráfego de rede entre Pods', 'Garantir que os containers descritos nos PodSpecs estão a correr e saudáveis', 'Agendar Pods nos nós', 'Armazenar o estado do cluster'], a: 1, exp: 'O kubelet é o agente que corre em cada nó e garante que os containers especificados nos PodSpecs estão em execução e saudáveis, reportando o estado de volta ao API server.', mod: 'Arquitectura & kubeadm', diff: 'easy' },
  { q: 'Que ficheiro contém as credenciais e o endereço do cluster usados pelo kubectl?', opts: ['/etc/kubernetes/admin.conf ou ~/.kube/config', '/var/lib/kubelet/config.yaml', '/etc/kubernetes/manifests/kube-apiserver.yaml', 'service-account-token'], a: 0, exp: 'O kubeconfig (tipicamente copiado de /etc/kubernetes/admin.conf para ~/.kube/config) define clusters, utilizadores e contextos que o kubectl usa para se ligar ao API server.', mod: 'Arquitectura & kubeadm', diff: 'easy' },
  { q: 'Os manifests estáticos dos componentes do control plane (kubeadm) ficam tipicamente em que directório de cada nó de control plane?', opts: ['/etc/kubernetes/manifests/', '/var/lib/kubelet/', '/etc/systemd/system/', '/opt/kubernetes/'], a: 0, exp: 'kubeadm gere API server, controller-manager, scheduler e (opcionalmente) etcd como Pods estáticos, cujos manifests YAML residem em /etc/kubernetes/manifests/ e são lidos directamente pelo kubelet.', mod: 'Arquitectura & kubeadm', diff: 'hard' },
  { q: 'Qual a diferença principal entre um Deployment e um StatefulSet?', opts: ['Deployments não suportam rolling updates', 'StatefulSets garantem identidade de rede estável e ordem de criação/eliminação para os Pods; Deployments não', 'StatefulSets não usam ReplicaSets', 'Não há diferença funcional'], a: 1, exp: 'StatefulSets atribuem nomes e armazenamento persistente estáveis a cada réplica (ex: pod-0, pod-1) e controlam a ordem de criação/eliminação — essencial para bases de dados e sistemas distribuídos com estado.', mod: 'Workloads & Scheduling', diff: 'medium' },
  { q: 'Como se garante que um Pod específico corre em todos os nós do cluster (ex: um agente de logging)?', opts: ['Usando um Deployment com replicas=N', 'Usando um DaemonSet', 'Usando um Job', 'Usando um StatefulSet'], a: 1, exp: 'Um DaemonSet garante que uma cópia de um Pod corre em todos (ou num subconjunto) dos nós do cluster — o caso de uso clássico para agentes de logging, monitorização ou rede.', mod: 'Workloads & Scheduling', diff: 'easy' },
  { q: 'Qual objecto Kubernetes é adequado para executar uma tarefa que deve correr até à conclusão, uma vez por dia?', opts: ['Deployment', 'DaemonSet', 'CronJob', 'ReplicaSet'], a: 2, exp: 'Um CronJob cria Jobs num horário definido (sintaxe cron), e cada Job garante a execução da tarefa até à conclusão, com política de re-tentativa configurável.', mod: 'Workloads & Scheduling', diff: 'easy' },
  { q: 'Um Pod tem um taint "NoSchedule" associado ao nó onde deveria correr. O que é necessário no PodSpec para que ele consiga ser agendado nesse nó?', opts: ['Uma nodeSelector', 'Uma toleration correspondente ao taint', 'Um resource limit', 'Uma affinity rule apenas'], a: 1, exp: 'Taints repelem Pods de um nó a menos que o Pod tenha uma toleration correspondente. Taints e tolerations trabalham em conjunto para restringir que Pods podem ser agendados em determinados nós.', mod: 'Workloads & Scheduling', diff: 'medium' },
  { q: 'Qual a diferença entre resources.requests e resources.limits num container?', opts: ['São sinónimos', 'Requests é o mínimo garantido usado pelo scheduler; limits é o máximo que o container pode consumir antes de ser limitado/terminado', 'Limits é usado pelo scheduler; requests define o máximo', 'Ambos são apenas informativos, sem efeito real'], a: 1, exp: 'O scheduler usa "requests" para decidir em que nó colocar o Pod (com base na capacidade disponível). "limits" define o teto: CPU é limitada (throttling) e memória acima do limite causa OOMKill.', mod: 'Workloads & Scheduling', diff: 'medium' },
  { q: 'Como se força um Pod a correr apenas em nós com o label "disktype=ssd"?', opts: ['Usando nodeSelector: { disktype: ssd } no PodSpec', 'Usando um taint no Pod', 'Não é possível controlar isto ao nível do Pod', 'Usando um Service com selector'], a: 0, exp: 'nodeSelector é a forma mais simples de restringir o agendamento de um Pod a nós com labels específicos. Para regras mais expressivas (afinidade/anti-afinidade), usa-se nodeAffinity.', mod: 'Workloads & Scheduling', diff: 'easy' },
  { q: 'Qual o propósito de um readinessProbe num container?', opts: ['Reiniciar o container se falhar', 'Determinar se o container está pronto para receber tráfego (remove-o dos endpoints de Service até estar pronto)', 'Verificar se a imagem existe no registry', 'Definir o tempo de vida do container'], a: 1, exp: 'Uma readinessProbe determina se o container está pronto para servir tráfego. Enquanto falhar, o Pod é removido dos endpoints do Service, evitando que receba pedidos prematuramente.', mod: 'Workloads & Scheduling', diff: 'medium' },
  { q: 'O que distingue uma livenessProbe de uma readinessProbe?', opts: ['Não há diferença', 'livenessProbe reinicia o container se falhar continuamente; readinessProbe apenas remove/adiciona o Pod dos endpoints do Service', 'readinessProbe só corre uma vez, no arranque', 'livenessProbe é obrigatória em todos os Pods'], a: 1, exp: 'Uma livenessProbe que falha repetidamente leva o kubelet a reiniciar o container. Uma readinessProbe que falha apenas remove o Pod do balanceamento de tráfego, sem o reiniciar.', mod: 'Workloads & Scheduling', diff: 'hard' },
  { q: 'Qual tipo de Service expõe uma aplicação apenas dentro do cluster, com um IP virtual estável?', opts: ['NodePort', 'LoadBalancer', 'ClusterIP', 'ExternalName'], a: 2, exp: 'ClusterIP é o tipo por defeito: atribui um IP virtual interno estável, acessível apenas dentro do cluster — ideal para comunicação entre microserviços.', mod: 'Serviços & Rede', diff: 'easy' },
  { q: 'Qual o intervalo de portas típico usado por um Service do tipo NodePort?', opts: ['1-1024', '3000-3999', '30000-32767', '8000-8999'], a: 2, exp: 'Por defeito, o Kubernetes reserva o intervalo 30000-32767 para NodePorts, expondo o Service numa porta estática em todos os nós do cluster.', mod: 'Serviços & Rede', diff: 'medium' },
  { q: 'Qual recurso Kubernetes gere o encaminhamento HTTP/HTTPS externo para Services com base em regras de host/path?', opts: ['NetworkPolicy', 'Ingress', 'Endpoint', 'ServiceAccount'], a: 1, exp: 'O Ingress define regras de encaminhamento HTTP(S) (por host e/ou path) para Services internos, tipicamente implementado por um Ingress Controller (ex: NGINX, Traefik).', mod: 'Serviços & Rede', diff: 'easy' },
  { q: 'Por defeito, sem nenhuma NetworkPolicy aplicada, como comunicam os Pods entre si num cluster?', opts: ['Todo o tráfego é bloqueado até se definir uma policy', 'Todos os Pods podem comunicar livremente entre si (modelo "flat network")', 'Apenas Pods no mesmo namespace comunicam', 'É necessário um Service para qualquer comunicação Pod-a-Pod'], a: 1, exp: 'O modelo de rede do Kubernetes assume, por defeito, que todos os Pods podem comunicar com todos os outros Pods sem NAT ("flat network"). NetworkPolicies são usadas para restringir isto explicitamente.', mod: 'Serviços & Rede', diff: 'medium' },
  { q: 'Qual componente é responsável pela resolução de nomes DNS internos (ex: meu-service.meu-namespace.svc.cluster.local)?', opts: ['kube-proxy', 'CoreDNS', 'etcd', 'kubelet'], a: 1, exp: 'CoreDNS corre como um Deployment no cluster e fornece resolução DNS para Services e Pods, permitindo descoberta de serviços por nome em vez de IP.', mod: 'Serviços & Rede', diff: 'easy' },
  { q: 'Uma NetworkPolicy com um podSelector vazio ({}) e sem regras de ingress definidas aplica-se a que Pods e com que efeito?', opts: ['A nenhum Pod', 'A todos os Pods do namespace, negando todo o tráfego de entrada não explicitamente permitido', 'Apenas ao Pod com o mesmo nome que a policy', 'Só tem efeito em tráfego de saída'], a: 1, exp: 'Um podSelector: {} selecciona todos os Pods do namespace. Sem regras de ingress, todo o tráfego de entrada para esses Pods é negado por defeito — uma forma comum de implementar "default deny".', mod: 'Serviços & Rede', diff: 'hard' },
  { q: 'Qual a função do kube-proxy em cada nó?', opts: ['Agendar Pods', 'Implementar as regras de rede que permitem a comunicação com os Services (via iptables/IPVS)', 'Armazenar o state do cluster', 'Gerir certificados TLS'], a: 1, exp: 'kube-proxy mantém regras de rede (tipicamente iptables ou IPVS) em cada nó que encaminham o tráfego destinado ao ClusterIP de um Service para os Pods correspondentes.', mod: 'Serviços & Rede', diff: 'medium' },
  { q: 'Qual a diferença entre um PersistentVolume (PV) e um PersistentVolumeClaim (PVC)?', opts: ['São o mesmo objecto com nomes diferentes', 'PV é o recurso de armazenamento real provisionado no cluster; PVC é o pedido de armazenamento feito por um utilizador/Pod', 'PVC é provisionado pelo administrador; PV é pedido pelo utilizador', 'PV só existe em armazenamento local'], a: 1, exp: 'Um PV representa uma unidade de armazenamento no cluster (provisionado estaticamente ou dinamicamente). Um PVC é o pedido de um utilizador por armazenamento, que é depois associado (bound) a um PV compatível.', mod: 'Armazenamento', diff: 'easy' },
  { q: 'O que define uma StorageClass?', opts: ['A quantidade máxima de armazenamento permitida por namespace', 'Um "perfil" de armazenamento que permite o provisionamento dinâmico de PVs (provisioner, parâmetros, política de reclaim)', 'As permissões de acesso a um PVC', 'O tipo de sistema de ficheiros de um container'], a: 1, exp: 'Uma StorageClass define um provisioner (ex: um driver CSI) e parâmetros associados, permitindo que PVs sejam criados dinamicamente quando um PVC a referencia, sem intervenção manual do administrador.', mod: 'Armazenamento', diff: 'medium' },
  { q: 'Qual accessMode permite que um volume seja montado como leitura-escrita por um único nó de cada vez?', opts: ['ReadOnlyMany (ROX)', 'ReadWriteMany (RWX)', 'ReadWriteOnce (RWO)', 'ReadWriteOncePod (RWOP)'], a: 2, exp: 'ReadWriteOnce (RWO) permite montagem de leitura-escrita por um único nó. RWX permite vários nós em simultâneo (requer suporte do backend), e RWOP (mais recente) restringe a um único Pod.', mod: 'Armazenamento', diff: 'medium' },
  { q: 'O que acontece a um PVC criado com storageClassName inexistente ou sem provisionamento dinâmico disponível?', opts: ['É automaticamente eliminado', 'Fica em estado "Pending" até existir um PV compatível ou a StorageClass ser corrigida', 'É associado ao primeiro PV disponível, independentemente da classe', 'O Pod que o usa arranca sem armazenamento'], a: 1, exp: 'Sem provisionamento dinâmico funcional, o PVC permanece "Pending" indefinidamente à espera de um PV compatível — um cenário comum de troubleshooting em ambientes CKA.', mod: 'Armazenamento', diff: 'hard' },
  { q: 'Um Pod está em estado CrashLoopBackOff. Qual o comando mais directo para investigar a causa?', opts: ['kubectl get pods', 'kubectl logs <pod> --previous', 'kubectl delete pod <pod>', 'kubectl top pod <pod>'], a: 1, exp: 'kubectl logs <pod> --previous mostra os logs do container que já terminou/reiniciou, essencial para diagnosticar a causa de um CrashLoopBackOff. kubectl describe pod também ajuda, mostrando eventos.', mod: 'Troubleshooting', diff: 'medium' },
  { q: 'Um Pod fica preso em estado Pending indefinidamente. Qual comando revela a razão mais rapidamente?', opts: ['kubectl logs <pod>', 'kubectl describe pod <pod> (secção Events)', 'kubectl exec -it <pod> -- sh', 'kubectl get nodes'], a: 1, exp: 'kubectl describe pod mostra a secção Events, que tipicamente revela a causa de um Pod Pending: recursos insuficientes, taints sem toleration, PVC não associado, etc.', mod: 'Troubleshooting', diff: 'easy' },
  { q: 'Um nó aparece com estado NotReady. Onde se deve procurar primeiro a causa raiz nesse nó?', opts: ['Nos logs do kube-apiserver', 'Nos logs do kubelet nesse nó (ex: journalctl -u kubelet)', 'No ficheiro kubeconfig local', 'Nos eventos do namespace default'], a: 1, exp: 'O estado "NotReady" de um nó normalmente indica que o kubelet parou de reportar heartbeats ao API server. Investigar os logs do kubelet nesse nó (journalctl -u kubelet) é o primeiro passo.', mod: 'Troubleshooting', diff: 'medium' },
  { q: 'Um Service não está a encaminhar tráfego para os Pods esperados. Qual comando ajuda a confirmar se os selectors correspondem correctamente?', opts: ['kubectl get endpoints <service>', 'kubectl get pv', 'kubectl get taints', 'kubectl config view'], a: 0, exp: 'kubectl get endpoints <service> mostra os IPs dos Pods actualmente associados ao Service. Se estiver vazio, o selector do Service provavelmente não corresponde aos labels dos Pods.', mod: 'Troubleshooting', diff: 'hard' },
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
  { id: 'timed', label: 'Modo Exame', desc: 'Tempo limitado — simula condições de exame real (killer.sh)', time: 900 },
];

export default function CkaExamSimulator() {
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
      const diff = (q as Question<CkaModule>).diff;
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
        <h3 className="text-2xl font-bold text-white">Simulado · CKA (Certified Kubernetes Administrator)</h3>
        <p className="text-slate-400 max-w-md mx-auto">{QUESTIONS.length} questões cobrindo os domínios oficiais do exame CKA: arquitectura de cluster &amp; kubeadm, workloads &amp; scheduling, serviços &amp; rede, armazenamento e troubleshooting.</p>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[[String(QUESTIONS.length), 'Questões'], ['66%', 'Aprovação'], ['5', 'Domínios']].map(([v, l]) => (
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
    const pass = percentage >= 66;
    const wrongQuestions = examQuestions
      .map((q, i) => ({ q, idx: i }))
      .filter(({ idx, q }) => state.answers[idx] !== null && state.answers[idx] !== q.a);

    return (
      <div className="rounded-3xl border border-slate-800 bg-[#181926]/70 p-8 text-center space-y-5">
        <Trophy size={40} className={pass ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
        <div>
          <div className="text-4xl font-black text-white">{percentage}%</div>
          <div className={`text-md font-semibold mt-1 ${pass ? 'text-emerald-400' : 'text-rose-400'}`}>
            {percentage >= 85 ? 'Excelente!' : percentage >= 66 ? 'Aprovado' : 'Precisa de mais estudo'}
          </div>
          <div className="text-slate-400 text-base mt-1">{score}/{QUESTIONS.length} respostas correctas · aprovação real ≥ 66%</div>
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
          {(rq.q as Question<CkaModule>).diff && (
            <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${DIFFICULTY_CONFIG[(rq.q as Question<CkaModule>).diff!].bg} ${DIFFICULTY_CONFIG[(rq.q as Question<CkaModule>).diff!].color} ${DIFFICULTY_CONFIG[(rq.q as Question<CkaModule>).diff!].border}`}>
              {DIFFICULTY_CONFIG[(rq.q as Question<CkaModule>).diff!].label}
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
