import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

type View = 'commands' | 'permissions' | 'scripting' | 'processes';

function Cmd({ cmd, desc }: { cmd: string; desc: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
      <div>
        <code className="text-[12px] font-mono text-emerald-300">{cmd}</code>
        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(cmd.split('  ')[0]); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
        className="shrink-0 text-slate-600 hover:text-slate-400 transition-colors">
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      </button>
    </div>
  );
}

const COMMANDS: Record<string, { cmd: string; desc: string }[]> = {
  'Ficheiros & Dirs': [
    { cmd: 'ls -la', desc: 'Listar com permissões, tamanho e ocultos' },
    { cmd: 'find / -name "*.log" -mtime +7', desc: 'Encontrar logs com mais de 7 dias' },
    { cmd: 'du -sh /var/log/*', desc: 'Tamanho de cada item em /var/log' },
    { cmd: 'tar -czf backup.tar.gz /app', desc: 'Comprimir directório para tar.gz' },
    { cmd: 'rsync -avz src/ user@host:/dst/', desc: 'Sincronizar directórios remotamente' },
  ],
  'Processos': [
    { cmd: 'ps aux | grep nginx', desc: 'Encontrar processo nginx' },
    { cmd: 'kill -9 $(lsof -ti:8080)', desc: 'Matar processo na porta 8080' },
    { cmd: 'htop', desc: 'Monitor interactivo de processos e CPU/RAM' },
    { cmd: 'systemctl status docker', desc: 'Estado do serviço Docker' },
    { cmd: 'journalctl -u nginx -f --since "1h ago"', desc: 'Logs do nginx em tempo real' },
  ],
  'Rede': [
    { cmd: 'netstat -tlnp', desc: 'Portas TCP em escuta com PID' },
    { cmd: 'ss -tulnp', desc: 'Alternativa moderna ao netstat' },
    { cmd: 'curl -I https://api.exemplo.com', desc: 'Verificar headers HTTP' },
    { cmd: 'nc -zv host 1521', desc: 'Testar conectividade TCP na porta' },
    { cmd: 'tcpdump -i eth0 port 80', desc: 'Capturar tráfego na porta 80' },
  ],
  'Permissões': [
    { cmd: 'chmod 755 script.sh', desc: 'rwxr-xr-x — dono execute+write+read' },
    { cmd: 'chown -R user:group /app', desc: 'Mudar dono recursivamente' },
    { cmd: 'sudo -u deployer ./deploy.sh', desc: 'Executar como outro utilizador' },
    { cmd: 'umask 022', desc: 'Default: ficheiros 644, dirs 755' },
    { cmd: 'getfacl /mnt/data', desc: 'Ver ACLs extendidas' },
  ],
  'DevOps útil': [
    { cmd: 'grep -r "ERROR" /var/log/ | tail -20', desc: 'Encontrar erros nos logs' },
    { cmd: 'awk \'{print $1}\' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head', desc: 'Top IPs no nginx' },
    { cmd: 'watch -n 5 "kubectl get pods -n prod"', desc: 'Monitorizar pods a cada 5s' },
    { cmd: 'ssh-keygen -t ed25519 -C "devops@example.com"', desc: 'Gerar chave SSH moderna' },
    { cmd: 'crontab -e', desc: 'Editar cron jobs do utilizador' },
  ],
};

const PERM_TABLE = [
  { num: '4', sym: 'r', name: 'Read', desc: 'Ler conteúdo' },
  { num: '2', sym: 'w', name: 'Write', desc: 'Escrever/modificar' },
  { num: '1', sym: 'x', name: 'Execute', desc: 'Executar/entrar em dir' },
];

const SHELL_SCRIPTS = [
  { title: 'Health Check Loop', lang: 'bash', code: `#!/bin/bash
# Verifica saúde de endpoint a cada 30s
URL="\${1:-http://localhost:8080/health}"
INTERVAL=30

while true; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  if [ "$STATUS" == "200" ]; then
    echo "[$TIMESTAMP] ✓ OK ($STATUS)"
  else
    echo "[$TIMESTAMP] ✗ FAIL ($STATUS)" >&2
    # Aqui: enviar alerta, restart serviço, etc.
  fi
  
  sleep $INTERVAL
done` },
  { title: 'Backup com Rotação', lang: 'bash', code: `#!/bin/bash
# Backup com retenção de 7 dias
set -euo pipefail

SOURCE_DIR="/app/data"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Criar backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"
echo "Backup criado: backup_$DATE.tar.gz"

# Remover backups antigos
find "$BACKUP_DIR" -name "backup_*.tar.gz" \\
  -mtime +$RETENTION_DAYS -delete
echo "Backups com mais de $RETENTION_DAYS dias removidos"` },
  { title: 'Deploy Script', lang: 'bash', code: `#!/bin/bash
# Deploy simples com rollback automático
set -euo pipefail

APP_NAME="minha-app"
IMAGE="\${1:?Imagem obrigatória}"
NAMESPACE="prod"

echo "A fazer deploy de $IMAGE..."

# Guarda versão anterior para rollback
PREV=$(kubectl get deployment/$APP_NAME -n $NAMESPACE \\
  -o jsonpath='{.spec.template.spec.containers[0].image}')

# Aplica nova versão
kubectl set image deployment/$APP_NAME \\
  $APP_NAME=$IMAGE -n $NAMESPACE

# Aguarda rollout
if ! kubectl rollout status deployment/$APP_NAME -n $NAMESPACE --timeout=120s; then
  echo "Deploy falhou! A fazer rollback para $PREV..."
  kubectl set image deployment/$APP_NAME \\
    $APP_NAME=$PREV -n $NAMESPACE
  exit 1
fi

echo "Deploy de $IMAGE concluído com sucesso!"` },
];

export default function LinuxSimulator() {
  const [view, setView] = useState<View>('commands');
  const [activeGroup, setActiveGroup] = useState('Ficheiros & Dirs');
  const [perm, setPerm] = useState({ owner: [true, true, true], group: [true, false, true], other: [false, false, true] });
  const [activeScript, setActiveScript] = useState(0);
  const [copied, setCopied] = useState(false);

  const calcOctal = (bits: boolean[]) => bits.reduce((acc, b, i) => acc + (b ? [4, 2, 1][i] : 0), 0);
  const calcSym = (bits: boolean[]) => bits.map((b, i) => b ? 'rwx'[i] : '-').join('');
  const octal = [perm.owner, perm.group, perm.other].map(calcOctal).join('');
  const symbolic = [perm.owner, perm.group, perm.other].map(calcSym).join('');

  const views = [
    { id: 'commands' as View, label: '⌨️ Comandos' },
    { id: 'permissions' as View, label: '🔐 Permissões' },
    { id: 'scripting' as View, label: '📜 Shell Scripts' },
    { id: 'processes' as View, label: '⚙️ Processos & Serviços' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${view === v.id ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'commands' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            {Object.keys(COMMANDS).map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${activeGroup === g ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3 space-y-2">
            {COMMANDS[activeGroup].map((c, i) => <Cmd key={i} {...c} />)}
          </div>
        </div>
      )}

      {view === 'permissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Calculadora de Permissões</h3>
            {(['owner', 'group', 'other'] as const).map((who) => (
              <div key={who} className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 capitalize">{who === 'owner' ? 'Dono (Owner)' : who === 'group' ? 'Grupo (Group)' : 'Outros (Other)'}</div>
                <div className="flex gap-2">
                  {['r', 'w', 'x'].map((bit, i) => (
                    <button key={bit} onClick={() => { const n = { ...perm }; n[who] = [...n[who]]; n[who][i] = !n[who][i]; setPerm(n); }}
                      className={`flex-1 py-3 rounded-xl text-[13px] font-black uppercase transition-all ${perm[who][i] ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border border-slate-700 text-slate-600'}`}>
                      {bit}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <div className="font-mono text-3xl font-black text-white">{octal}</div>
              <div className="font-mono text-[14px] text-slate-400">{symbolic}</div>
              <div className="text-[11px] text-slate-500">chmod {octal} ficheiro</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Referência Rápida</h3>
            <table className="w-full text-[11px]">
              <thead><tr className="border-b border-slate-800">{['Octal', 'Símbolo', 'Nome', 'Descrição'].map(h => <th key={h} className="text-left text-slate-500 pb-2 pr-3">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800/50">
                {PERM_TABLE.map(p => <tr key={p.num}><td className="py-2 pr-3 font-mono text-amber-300">{p.num}</td><td className="py-2 pr-3 font-mono text-emerald-300">{p.sym}</td><td className="py-2 pr-3 text-slate-300">{p.name}</td><td className="py-2 text-slate-500">{p.desc}</td></tr>)}
              </tbody>
            </table>
            <div className="mt-3 space-y-2">
              {[['755', 'rwxr-xr-x', 'Scripts executáveis', 'emerald'], ['644', 'rw-r--r--', 'Ficheiros de configuração', 'sky'], ['600', 'rw-------', 'Chaves SSH privadas', 'amber'], ['777', 'rwxrwxrwx', '⚠ Nunca usar em prod!', 'rose']].map(([o, s, d, c]) => (
                <div key={o} className={`flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800`}>
                  <code className="font-mono text-[12px] font-bold text-slate-200 w-8">{o}</code>
                  <code className="font-mono text-[11px] text-slate-400 w-24">{s}</code>
                  <span className="text-[11px] text-slate-500">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'scripting' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            {SHELL_SCRIPTS.map((s, i) => (
              <button key={i} onClick={() => setActiveScript(i)}
                className={`w-full text-left p-3 rounded-xl text-[12px] font-medium transition-all ${activeScript === i ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}>
                <Terminal size={11} className="inline mr-1.5" />{s.title}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">{SHELL_SCRIPTS[activeScript].title.toLowerCase().replace(/ /g, '-')}.sh</span>
                <button onClick={() => { navigator.clipboard.writeText(SHELL_SCRIPTS[activeScript].code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
                  className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
                  {copied ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-950">
                {SHELL_SCRIPTS[activeScript].code.split('\n').map((line, i) => (
                  <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.match(/^(if|while|for|do|done|fi|else|elif|then)\b/) ? 'text-violet-400' : line.match(/^\s*(echo|curl|kubectl|tar|find|grep|awk)/) ? 'text-sky-300' : 'text-slate-300'}>{line}</div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {view === 'processes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'systemctl — Gestão de Serviços', color: 'sky', cmds: ['systemctl start nginx', 'systemctl stop nginx', 'systemctl restart nginx', 'systemctl enable nginx  # arrancar no boot', 'systemctl disable nginx', 'systemctl status nginx', 'systemctl list-units --type=service'] },
            { title: 'Diagnóstico Rápido', color: 'emerald', cmds: ['ps aux --sort=-%cpu | head -10', 'top -b -n 1 | head -20', 'free -h  # RAM usada/disponível', 'df -h  # espaço em disco', 'iostat -x 1 3  # I/O por disco', 'vmstat 1 5  # CPU, mem, swap, I/O', 'uptime  # load average'] },
            { title: 'Logs com journalctl', color: 'amber', cmds: ['journalctl -u docker -f', 'journalctl --since "2024-01-01" --until "2024-01-02"', 'journalctl -p err -b  # só erros desde o boot', 'journalctl --disk-usage', 'journalctl --vacuum-time=7d  # limpar > 7 dias'] },
            { title: 'Cron Jobs', color: 'violet', cmds: ['crontab -l  # listar crons', 'crontab -e  # editar', '# ┌─ minuto (0-59)', '# │ ┌─ hora (0-23)', '# │ │ ┌─ dia mês (1-31)', '# │ │ │ ┌─ mês (1-12)', '# 0 2 * * * /scripts/backup.sh  # daily 2am', '# */5 * * * * /scripts/health.sh  # a cada 5min'] },
          ].map(g => (
            <div key={g.title} className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70">
              <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${g.color === 'sky' ? 'text-sky-400' : g.color === 'emerald' ? 'text-emerald-400' : g.color === 'amber' ? 'text-amber-400' : 'text-violet-400'}`}>{g.title}</div>
              <div className="space-y-1.5">
                {g.cmds.map((c, i) => (
                  <div key={i} className={`font-mono text-[11px] ${c.startsWith('#') ? 'text-slate-600' : 'text-emerald-300'}`}>{c.startsWith('#') ? c : `$ ${c}`}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
