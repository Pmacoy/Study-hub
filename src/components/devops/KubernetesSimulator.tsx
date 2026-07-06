import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type View = 'architecture' | 'resources' | 'commands' | 'rbac';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
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
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') || line.startsWith('//') ? 'text-slate-600' : line.match(/^(apiVersion|kind|metadata|spec|status):/) ? 'text-sky-300' : line.match(/^  (name|namespace|labels|image|replicas|selector|ports|resources|env):/) ? 'text-violet-300' : line.startsWith('$') ? 'text-emerald-300' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const K8S_RESOURCES = [
  { name: 'Pod', icon: '🫛', color: 'sky', desc: 'Menor unidade deployável. Contém 1+ containers com namespace de rede partilhado.', yaml: `apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: prod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
    - containerPort: 80
    resources:
      requests: { cpu: "100m", memory: "64Mi" }
      limits:   { cpu: "500m", memory: "256Mi" }` },
  { name: 'Deployment', icon: '📦', color: 'violet', desc: 'Gere um conjunto de Pods idênticos com rolling update, rollback e autoscaling.', yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deploy
  namespace: prod
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
      - name: web
        image: myapp:v1.2.0
        livenessProbe:
          httpGet: { path: /health, port: 8080 }
          initialDelaySeconds: 15
        readinessProbe:
          httpGet: { path: /ready, port: 8080 }` },
  { name: 'Service', icon: '🔌', color: 'amber', desc: 'Abstracção de rede estável para aceder a Pods. ClusterIP, NodePort ou LoadBalancer.', yaml: `apiVersion: v1
kind: Service
metadata:
  name: app-svc
  namespace: prod
spec:
  selector:
    app: web          # Aponta para pods com este label
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP     # Interno ao cluster
---
# Para expor externamente:
# type: LoadBalancer  → cloud LB (AKS, EKS, GKE)
# type: NodePort      → porta no node (dev/testing)` },
  { name: 'ConfigMap & Secret', icon: '🗝️', color: 'rose', desc: 'ConfigMap para config não-sensível. Secret para passwords, tokens (base64 encoded).', yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  DB_HOST: "db.svc.cluster.local"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:           # Kubernetes faz o encode
  DB_PASSWORD: "s3cr3t"
  API_KEY: "tok_prod_abc123"` },
];

const KUBECTL_CMDS: Record<string, { cmd: string; desc: string }[]> = {
  'Diagnóstico': [
    { cmd: 'kubectl get pods -n prod -o wide', desc: 'Pods com nó e IP' },
    { cmd: 'kubectl describe pod app-xyz -n prod', desc: 'Detalhes e events do pod' },
    { cmd: 'kubectl logs -f app-xyz -n prod --previous', desc: 'Logs do crash anterior' },
    { cmd: 'kubectl top pods -n prod', desc: 'CPU/RAM por pod' },
    { cmd: 'kubectl get events -n prod --sort-by=.lastTimestamp', desc: 'Events recentes' },
  ],
  'Deploy & Rollout': [
    { cmd: 'kubectl rollout status deploy/app -n prod', desc: 'Estado do deploy em curso' },
    { cmd: 'kubectl rollout history deploy/app -n prod', desc: 'Histórico de versões' },
    { cmd: 'kubectl rollout undo deploy/app -n prod', desc: 'Rollback para versão anterior' },
    { cmd: 'kubectl set image deploy/app app=myapp:v1.3 -n prod', desc: 'Update de imagem' },
    { cmd: 'kubectl scale deploy/app --replicas=5 -n prod', desc: 'Escalar manualmente' },
  ],
  'Debug': [
    { cmd: 'kubectl exec -it pod/app-xyz -n prod -- /bin/sh', desc: 'Shell interactivo no pod' },
    { cmd: 'kubectl port-forward svc/app 8080:80 -n prod', desc: 'Forward porta local' },
    { cmd: 'kubectl cp app-xyz:/app/logs ./logs -n prod', desc: 'Copiar ficheiros do pod' },
    { cmd: 'kubectl run debug --image=busybox -it --rm', desc: 'Pod temporário para debug' },
  ],
};

const RBAC_CODE = `# Role — permissões no namespace "prod"
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: dev-role
  namespace: prod
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "update"]
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
# Nota: sem "delete" — developers não podem apagar pods

---
# RoleBinding — liga a Role a um utilizador/grupo
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: dev-binding
  namespace: prod
subjects:
- kind: User
  name: "joao@example.com"
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: dev-role
  apiGroup: rbac.authorization.k8s.io

---
# ClusterRole — permissões em todo o cluster
# Usar para: admins, operators, monitoring tools
# Verificar: kubectl auth can-i get pods -n prod --as joao@example.com`;

export default function KubernetesSimulator() {
  const [view, setView] = useState<View>('architecture');
  const [resource, setResource] = useState(0);
  const [cmdGroup, setCmdGroup] = useState('Diagnóstico');

  const views = [
    { id: 'architecture' as View, label: '☸️ Arquitectura' },
    { id: 'resources' as View, label: '📦 Recursos & YAML' },
    { id: 'commands' as View, label: '⌨️ kubectl' },
    { id: 'rbac' as View, label: '🔐 RBAC' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'architecture' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5">
              <div className="text-[11px] font-black text-violet-400 uppercase tracking-widest mb-3">Control Plane</div>
              {[
                { c: 'kube-apiserver', d: 'Gateway de toda a comunicação do cluster. REST API.' },
                { c: 'etcd', d: 'Datastore distribuído — fonte de verdade do estado do cluster.' },
                { c: 'kube-scheduler', d: 'Decide em que node colocar cada Pod (recursos, affinity, taints).' },
                { c: 'controller-manager', d: 'Loops de controlo: ReplicaSet, Deployment, Node, Endpoints...' },
              ].map(x => (
                <div key={x.c} className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0">
                  <code className="font-mono text-[11px] text-violet-300 shrink-0 w-36">{x.c}</code>
                  <span className="text-[11px] text-slate-400">{x.d}</span>
                </div>
              ))}
            </div>
            <div className="p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5">
              <div className="text-[11px] font-black text-sky-400 uppercase tracking-widest mb-3">Worker Node</div>
              {[
                { c: 'kubelet', d: 'Agente no node. Garante que os containers estão a correr.' },
                { c: 'kube-proxy', d: 'Mantém as regras de rede (iptables/ipvs) para os Services.' },
                { c: 'container runtime', d: 'ContainerD ou CRI-O — executa os containers.' },
                { c: 'pods', d: 'Unidades deployadas no node com volumes e rede partilhados.' },
              ].map(x => (
                <div key={x.c} className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0">
                  <code className="font-mono text-[11px] text-sky-300 shrink-0 w-36">{x.c}</code>
                  <span className="text-[11px] text-slate-400">{x.d}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { t: 'Service Types', items: ['ClusterIP — interno', 'NodePort — dev/test', 'LoadBalancer — cloud', 'ExternalName — DNS alias'], c: 'amber' },
              { t: 'Storage', items: ['PersistentVolume (PV)', 'PersistentVolumeClaim (PVC)', 'StorageClass (dinâmico)', 'emptyDir (temporário)'], c: 'teal' },
              { t: 'Scheduling', items: ['Requests/Limits CPU+Mem', 'NodeSelector', 'Affinity/Anti-affinity', 'Taints & Tolerations'], c: 'rose' },
              { t: 'Observabilidade', items: ['Liveness Probe', 'Readiness Probe', 'Startup Probe', 'kubectl top / metrics-server'], c: 'emerald' },
            ].map(g => (
              <div key={g.t} className={`p-4 rounded-2xl border ${g.c === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : g.c === 'teal' ? 'border-teal-500/30 bg-teal-500/8' : g.c === 'rose' ? 'border-rose-500/30 bg-rose-500/8' : 'border-emerald-500/30 bg-emerald-500/8'}`}>
                <div className={`text-[10px] font-black uppercase mb-2 ${g.c === 'amber' ? 'text-amber-400' : g.c === 'teal' ? 'text-teal-400' : g.c === 'rose' ? 'text-rose-400' : 'text-emerald-400'}`}>{g.t}</div>
                {g.items.map(i => <div key={i} className="text-[10px] text-slate-500 py-0.5">{i}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            {K8S_RESOURCES.map((r, i) => (
              <button key={i} onClick={() => setResource(i)}
                className={`w-full text-left p-3 rounded-xl transition-all ${resource === i ? 'bg-violet-500/15 border border-violet-500/30' : 'border border-slate-800 hover:border-slate-700 hover:bg-slate-900'}`}>
                <div className="text-lg">{r.icon}</div>
                <div className={`text-[12px] font-bold ${resource === i ? 'text-violet-300' : 'text-slate-300'}`}>{r.name}</div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-3">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
              <div className="text-[13px] font-semibold text-slate-200 mb-1">{K8S_RESOURCES[resource].icon} {K8S_RESOURCES[resource].name}</div>
              <p className="text-[12px] text-slate-400">{K8S_RESOURCES[resource].desc}</p>
            </div>
            <Code code={K8S_RESOURCES[resource].yaml} lang={`${K8S_RESOURCES[resource].name.toLowerCase()}.yaml`} />
          </div>
        </div>
      )}

      {view === 'commands' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            {Object.keys(KUBECTL_CMDS).map(g => (
              <button key={g} onClick={() => setCmdGroup(g)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${cmdGroup === g ? 'bg-violet-500/15 border border-violet-500/30 text-violet-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-2">
            {KUBECTL_CMDS[cmdGroup].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <code className="text-[11px] font-mono text-violet-300 flex-1">{c.cmd}</code>
                <span className="text-[11px] text-slate-500 shrink-0 text-right max-w-[200px]">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'rbac' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { t: 'Role', d: 'Permissões dentro de um namespace', c: 'sky' },
              { t: 'ClusterRole', d: 'Permissões em todo o cluster', c: 'violet' },
              { t: 'RoleBinding / ClusterRoleBinding', d: 'Liga Role a User/Group/ServiceAccount', c: 'amber' },
            ].map(x => (
              <div key={x.t} className={`p-3 rounded-xl border text-center ${x.c === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : x.c === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : 'border-amber-500/30 bg-amber-500/8'}`}>
                <div className={`text-[11px] font-black ${x.c === 'sky' ? 'text-sky-400' : x.c === 'violet' ? 'text-violet-400' : 'text-amber-400'}`}>{x.t}</div>
                <div className="text-[10px] text-slate-500 mt-1">{x.d}</div>
              </div>
            ))}
          </div>
          <Code code={RBAC_CODE} lang="rbac.yaml" />
        </div>
      )}
    </div>
  );
}
