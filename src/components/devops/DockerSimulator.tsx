import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type View = 'concepts' | 'dockerfile' | 'commands' | 'compose';

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
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.match(/^(FROM|RUN|COPY|ADD|CMD|ENTRYPOINT|ENV|ARG|WORKDIR|EXPOSE|USER|VOLUME|HEALTHCHECK|LABEL)\b/) ? 'text-sky-300' : line.startsWith('$') ? 'text-emerald-300' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const DOCKERFILE_PROD = `# Multi-stage build — imagem final sem ferramentas de build
FROM node:20-alpine AS builder
WORKDIR /app
# Copiar só package files primeiro (cache de layers)
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Stage final — só o necessário para executar
FROM node:20-alpine AS runner
# Não correr como root!
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app

# Copiar apenas artefactos do builder
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

USER appuser
EXPOSE 3000

# HEALTHCHECK integrado
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT ["node", "dist/server.js"]`;

const DOCKERFILE_BAD = `# ❌ Dockerfile com má prática — imagem 1.2GB+
FROM node:20
WORKDIR /app

# Instala tudo de uma vez (sem cache de layers)
COPY . .
RUN npm install

# Corre como root (risco de segurança)
CMD ["npm", "start"]`;

const COMPOSE_STACK = `# docker-compose.yml — Local dev stack
version: '3.9'

services:
  haproxy:
    image: haproxy:2.8-alpine
    ports:
      - "1521:1521"  # Oracle POPM
      - "1522:1522"  # Oracle ERPP
      - "9000:9000"  # Health check
    volumes:
      - ./haproxy_cfg.tpl:/usr/local/etc/haproxy/haproxy.cfg:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - cpe-net

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      haproxy:
        condition: service_healthy
    networks:
      - cpe-net

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - "9090:9090"
    networks:
      - cpe-net

networks:
  cpe-net:
    driver: bridge`;

const CMD_GROUPS: Record<string, { cmd: string; desc: string }[]> = {
  'Imagens': [
    { cmd: 'docker build -t app:v1.0 .', desc: 'Build com tag' },
    { cmd: 'docker build --no-cache -t app:latest .', desc: 'Sem cache (força rebuild)' },
    { cmd: 'docker images', desc: 'Listar imagens locais' },
    { cmd: 'docker rmi app:old', desc: 'Remover imagem' },
    { cmd: 'docker push registry.io/app:v1.0', desc: 'Publicar no registry' },
    { cmd: 'trivy image app:v1.0', desc: 'Scan de vulnerabilidades' },
  ],
  'Containers': [
    { cmd: 'docker run -d -p 8080:80 --name web nginx', desc: 'Run em background' },
    { cmd: 'docker exec -it web /bin/sh', desc: 'Shell interactivo no container' },
    { cmd: 'docker logs -f --tail 100 web', desc: 'Logs em tempo real' },
    { cmd: 'docker stats', desc: 'CPU/RAM por container em tempo real' },
    { cmd: 'docker cp ficheiro.txt web:/app/', desc: 'Copiar ficheiro para container' },
    { cmd: 'docker rm -f $(docker ps -aq)', desc: 'Remover todos os containers' },
  ],
  'Compose': [
    { cmd: 'docker compose up -d', desc: 'Start em background' },
    { cmd: 'docker compose down -v', desc: 'Stop e remove volumes' },
    { cmd: 'docker compose logs -f app', desc: 'Logs do serviço app' },
    { cmd: 'docker compose scale worker=3', desc: 'Escalar serviço' },
    { cmd: 'docker compose exec db psql -U user', desc: 'Aceder à base de dados' },
    { cmd: 'docker compose ps', desc: 'Estado dos serviços' },
  ],
  'Limpeza': [
    { cmd: 'docker system prune -af', desc: 'Remover tudo não usado' },
    { cmd: 'docker volume prune', desc: 'Remover volumes órfãos' },
    { cmd: 'docker image prune -a --filter "until=24h"', desc: 'Imagens mais antigas que 24h' },
    { cmd: 'docker network prune', desc: 'Redes não usadas' },
  ],
};

export default function DockerSimulator() {
  const [view, setView] = useState<View>('concepts');
  const [dfMode, setDfMode] = useState<'good' | 'bad'>('good');
  const [cmdGroup, setCmdGroup] = useState('Imagens');

  const views = [
    { id: 'concepts' as View, label: '🐳 Arquitectura' },
    { id: 'dockerfile' as View, label: '📄 Dockerfile' },
    { id: 'commands' as View, label: '⌨️ Comandos' },
    { id: 'compose' as View, label: '🎼 Compose' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'concepts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { n: 'Docker Client', e: '💻', d: 'CLI que envia comandos ao Daemon via REST API', c: 'sky' },
              { n: 'Docker Daemon', e: '⚙️', d: 'dockerd — gere containers, imagens, redes e volumes', c: 'violet' },
              { n: 'Registry', e: '📦', d: 'Docker Hub, ECR, ACR, GCR — armazena imagens', c: 'amber' },
              { n: 'Container', e: '🎁', d: 'Processo isolado com filesystem e rede próprios', c: 'emerald' },
            ].map(c => (
              <div key={c.n} className={`p-4 rounded-2xl border text-center ${c.c === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : c.c === 'violet' ? 'border-violet-500/30 bg-violet-500/8' : c.c === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : 'border-emerald-500/30 bg-emerald-500/8'}`}>
                <div className="text-2xl mb-2">{c.e}</div>
                <div className={`text-[11px] font-black mb-1 ${c.c === 'sky' ? 'text-sky-400' : c.c === 'violet' ? 'text-violet-400' : c.c === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>{c.n}</div>
                <div className="text-[10px] text-slate-500 leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[11px] font-black text-sky-400 uppercase tracking-widest mb-3">VM vs Container</div>
              <table className="w-full text-[11px]">
                <thead><tr className="border-b border-slate-800">{['', 'VM', 'Container'].map(h => <th key={h} className="text-left text-slate-500 pb-2 pr-3">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-800/40">
                  {[['Boot', '~1-2 min', '~1-2 sec'], ['Tamanho', 'GBs', 'MBs'], ['OS', 'Guest OS próprio', 'Kernel partilhado'], ['Isolamento', 'Hardware', 'Processo'], ['Uso', 'Workloads legacy', 'Microserviços']].map(([k, v, c]) => (
                    <tr key={k}><td className="py-1.5 pr-3 text-slate-500">{k}</td><td className="py-1.5 pr-3 text-rose-300">{v}</td><td className="py-1.5 text-emerald-300">{c}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest mb-3">Boas Práticas</div>
              <div className="space-y-2">
                {['Multi-stage builds — imagem mínima em produção', 'Nunca correr como root (USER nonroot)', 'Um processo por container (Single Responsibility)', 'HEALTHCHECK em todos os serviços', 'Imagens base oficiais e mínimas (alpine, distroless)', '.dockerignore para excluir node_modules, .git', 'Scan de vulnerabilidades com Trivy antes do push', 'Secrets via variáveis de ambiente, nunca no Dockerfile'].map(b => (
                  <div key={b} className="flex items-start gap-2 text-[11px] text-slate-400">
                    <span className="text-emerald-400 shrink-0">✓</span>{b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'dockerfile' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {([['good', '✓ Produção (Multi-stage)', 'emerald'], ['bad', '✗ Anti-pattern', 'rose']] as const).map(([id, label, color]) => (
              <button key={id} onClick={() => setDfMode(id)}
                className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${dfMode === id ? color === 'emerald' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300' : 'border border-slate-800 text-slate-500'}`}>
                {label}
              </button>
            ))}
          </div>
          <Code code={dfMode === 'good' ? DOCKERFILE_PROD : DOCKERFILE_BAD} lang={`Dockerfile — ${dfMode === 'good' ? 'multi-stage produção' : 'anti-pattern ❌'}`} />
          {dfMode === 'bad' && (
            <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/8 space-y-2">
              <div className="text-[11px] font-black text-rose-400 uppercase">Problemas neste Dockerfile</div>
              {['Copia todo o código antes de instalar deps — invalida cache a cada mudança de código', 'node:20 tem >1GB — alpine tem ~180MB', 'npm install inclui devDependencies desnecessárias em prod', 'Corre como root — se o container for comprometido, tem acesso total', 'Sem HEALTHCHECK — orchestrators não sabem se o app está saudável'].map(p => (
                <div key={p} className="flex items-start gap-2 text-[11px] text-slate-400"><span className="text-rose-400 shrink-0">✗</span>{p}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'commands' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            {Object.keys(CMD_GROUPS).map(g => (
              <button key={g} onClick={() => setCmdGroup(g)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${cmdGroup === g ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-2">
            {CMD_GROUPS[cmdGroup].map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <code className="text-[12px] font-mono text-sky-300 flex-1">{c.cmd}</code>
                <span className="text-[11px] text-slate-500 shrink-0">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'compose' && <Code code={COMPOSE_STACK} lang="docker-compose.yml — Local dev stack" />}
    </div>
  );
}
