import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type View = 'overview' | 'prometheus' | 'grafana' | 'elk';

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
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') ? 'text-slate-600' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const PROMQL_EXAMPLES = [
  { name: 'CPU Usage', q: 'rate(container_cpu_usage_seconds_total[5m]) * 100', desc: 'CPU % por container nos últimos 5 minutos' },
  { name: 'Memory', q: 'container_memory_usage_bytes / container_spec_memory_limit_bytes * 100', desc: '% de memória usada vs limite definido' },
  { name: 'HTTP Error Rate', q: 'rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100', desc: 'Taxa de erros 5xx em percentagem' },
  { name: 'Request Latency p95', q: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[10m]))', desc: 'Latência no percentil 95 (últimos 10 min)' },
  { name: 'Pod Restarts', q: 'increase(kube_pod_container_status_restarts_total[1h])', desc: 'Restarts de containers na última hora' },
  { name: 'Disk Free', q: '(node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 20', desc: 'Nós com menos de 20% de disco livre' },
];

const ALERT_RULES = `# prometheus/rules/alerts.yml
groups:
  - name: application
    rules:
      # Alta taxa de erros HTTP
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) /
              rate(http_requests_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Alta taxa de erros em {{ \$labels.service }}"
          description: "Error rate: {{ \$value | humanizePercentage }}"

      # Latência elevada
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Latência p95 > 500ms em {{ \$labels.service }}"

  - name: kubernetes
    rules:
      # Pod em CrashLoopBackOff
      - alert: PodCrashLooping
        expr: increase(kube_pod_container_status_restarts_total[15m]) > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pod a crashar: {{ \$labels.pod }}"`;

const ELK_QUERIES = `# Elasticsearch — queries DSL
# Encontrar erros nas últimas 24h
GET /app-logs-*/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-24h" } } }
      ]
    }
  },
  "aggs": {
    "errors_by_service": {
      "terms": { "field": "service.keyword" }
    }
  }
}

# Kibana KQL (mais simples)
level: ERROR AND service: "api-gateway" AND @timestamp > now-1h

# Logstash pipeline — parsear logs nginx
filter {
  grok {
    match => { "message" => "%{NGINXACCESS}" }
  }
  date {
    match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
  }
  geoip {
    source => "clientip"
  }
}`;

export default function MonitoringSimulator() {
  const [view, setView] = useState<View>('overview');
  const [activeQuery, setActiveQuery] = useState(0);

  const views = [
    { id: 'overview' as View, label: '📊 Overview' },
    { id: 'prometheus' as View, label: '🔥 Prometheus' },
    { id: 'grafana' as View, label: '📈 Grafana' },
    { id: 'elk' as View, label: '🔍 ELK Stack' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { t: 'Logs', e: '📋', d: 'O quê aconteceu? ELK Stack, Loki, CloudWatch', c: 'sky' },
              { t: 'Métricas', e: '📊', d: 'Como está o sistema? Prometheus + Grafana', c: 'amber' },
              { t: 'Traces', e: '🔗', d: 'Porquê demorou? Jaeger, Zipkin, Tempo', c: 'violet' },
              { t: 'Alertas', e: '🔔', d: 'Quando falha? AlertManager, PagerDuty', c: 'rose' },
            ].map(p => (
              <div key={p.t} className={`p-4 rounded-2xl border text-center ${p.c === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : p.c === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : p.c === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : 'border-rose-500/30 bg-rose-500/8'}`}>
                <div className="text-2xl mb-2">{p.e}</div>
                <div className={`text-[11px] font-black mb-1 ${p.c === 'sky' ? 'text-sky-400' : p.c === 'amber' ? 'text-amber-400' : p.c === 'violet' ? 'text-violet-400' : 'text-rose-400'}`}>{p.t}</div>
                <div className="text-[10px] text-slate-500">{p.d}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'SLI / SLO / SLA', color: 'sky', items: ['SLI (Indicator): métrica medida — ex: % de requests bem-sucedidos', 'SLO (Objective): meta — ex: availability ≥ 99.9%', 'SLA (Agreement): contrato com penalizações', 'Error Budget: quanto podemos falhar sem quebrar o SLO', 'Exemplo: latência Oracle p95 < 500ms (SLO 99.5%)'] },
              { title: 'Golden Signals (SRE)', color: 'amber', items: ['Latency: tempo de resposta (p50, p95, p99)', 'Traffic: requests/segundo, mensagens/segundo', 'Errors: taxa de erros (5xx, falhas de negócio)', 'Saturation: CPU%, memória%, fila de espera', 'Usar como base para alertas críticos'] },
              { title: 'Alert Fatigue Prevention', color: 'rose', items: ['Alertar só sobre o que afecta utilizadores', 'Agrupar alertas relacionados', 'Severity: P1=pager now, P2=next hour, P3=ticket', 'Runbooks para cada alerta (o que fazer)', 'Rever e desactivar alertas silenciados > 30 dias'] },
            ].map(g => (
              <div key={g.title} className={`p-4 rounded-2xl border ${g.color === 'sky' ? 'border-sky-500/20 bg-sky-500/5' : g.color === 'amber' ? 'border-amber-500/20 bg-amber-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${g.color === 'sky' ? 'text-sky-400' : g.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>{g.title}</div>
                {g.items.map(i => <div key={i} className="text-[11px] text-slate-400 py-0.5 flex items-start gap-1.5"><span className={`${g.color === 'sky' ? 'text-sky-500' : g.color === 'amber' ? 'text-amber-500' : 'text-rose-500'} shrink-0`}>·</span>{i}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'prometheus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest">PromQL Queries</div>
              {PROMQL_EXAMPLES.map((q, i) => (
                <button key={i} onClick={() => setActiveQuery(i)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${activeQuery === i ? 'border-amber-500/40 bg-amber-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}>
                  <div className={`text-[12px] font-semibold mb-1 ${activeQuery === i ? 'text-amber-300' : 'text-slate-300'}`}>{q.name}</div>
                  <div className="text-[10px] text-slate-500">{q.desc}</div>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="text-[10px] font-black text-amber-400 uppercase mb-2">Query seleccionada</div>
                <code className="block font-mono text-[12px] text-slate-300 break-all">{PROMQL_EXAMPLES[activeQuery].q}</code>
                <p className="text-[11px] text-slate-500 mt-2">{PROMQL_EXAMPLES[activeQuery].desc}</p>
              </div>
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Regras de Alerta</div>
              <Code code={ALERT_RULES} lang="prometheus/rules/alerts.yml" />
            </div>
          </div>
        </div>
      )}

      {view === 'grafana' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'Tipos de Painéis', c: 'sky', items: ['Time series — métricas ao longo do tempo', 'Gauge — valor actual vs threshold', 'Stat — número único em destaque', 'Table — dados tabulares (top pods por CPU)', 'Heatmap — distribuição de latências', 'Alert list — alertas activos'] },
            { t: 'Data Sources', c: 'violet', items: ['Prometheus — métricas de infra e app', 'Loki — logs sem indexação completa', 'Elasticsearch — logs com full-text search', 'Azure Monitor / CloudWatch — cloud nativa', 'PostgreSQL / MySQL — dados de negócio', 'JSON API — qualquer HTTP endpoint'] },
            { t: 'Dashboard Best Practices', c: 'amber', items: ['USE Method: Utilization, Saturation, Errors', 'RED Method: Rate, Errors, Duration (microserviços)', 'Variáveis de template (namespace, service, instance)', 'Anotações para deploys e incidents', 'Alertas definidos no Grafana ou AlertManager'] },
            { t: 'Grafana + Azure', c: 'emerald', items: ['Datasource: Azure Monitor (Log Analytics)', 'Painel HAProxy: conexões activas por backend', 'Painel VMSS: instâncias saudáveis e CPU', 'Alerta: Oracle connection failures > 10/min', 'SLO dashboard: availability 99.9% target'] },
          ].map(g => (
            <div key={g.t} className={`p-5 rounded-2xl border ${g.c === 'sky' ? 'border-sky-500/20 bg-sky-500/5' : g.c === 'violet' ? 'border-violet-500/20 bg-violet-500/5' : g.c === 'amber' ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
              <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${g.c === 'sky' ? 'text-sky-400' : g.c === 'violet' ? 'text-violet-400' : g.c === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>{g.t}</div>
              {g.items.map(i => <div key={i} className="flex items-start gap-2 text-[12px] text-slate-400 py-0.5"><span className="text-slate-600 shrink-0">·</span>{i}</div>)}
            </div>
          ))}
        </div>
      )}

      {view === 'elk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { t: 'Elasticsearch', d: 'Motor de busca e armazenamento. Indexa logs em tempo real. Query DSL ou Kibana.', c: 'amber' },
              { t: 'Logstash', d: 'Pipeline de ingestão. Recebe logs, faz parse (grok), enriquece e envia para ES.', c: 'rose' },
              { t: 'Kibana', d: 'UI para visualização, dashboards, KQL queries e alertas sobre os dados no ES.', c: 'violet' },
            ].map(x => (
              <div key={x.t} className={`p-4 rounded-2xl border text-center ${x.c === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : x.c === 'rose' ? 'border-rose-500/30 bg-rose-500/8' : 'border-violet-500/30 bg-violet-500/8'}`}>
                <div className={`text-[13px] font-black mb-1 ${x.c === 'amber' ? 'text-amber-400' : x.c === 'rose' ? 'text-rose-400' : 'text-violet-400'}`}>{x.t}</div>
                <div className="text-[10px] text-slate-500 leading-relaxed">{x.d}</div>
              </div>
            ))}
          </div>
          <Code code={ELK_QUERIES} lang="Elasticsearch DSL + Kibana KQL + Logstash" />
        </div>
      )}
    </div>
  );
}
