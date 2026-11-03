import { useState } from 'react';
import { Terminal, Code, CheckCircle, ShieldAlert, Cpu, FileText } from 'lucide-react';

export default function ShellScriptingSimulator() {
  const [activeTab, setActiveTab] = useState<'basics' | 'advanced' | 'best-practices'>('basics');

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'basics', label: 'Fundamentos', icon: Terminal },
          { id: 'advanced', label: 'Processamento de Texto', icon: FileText },
          { id: 'best-practices', label: 'Boas Práticas', icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                : 'border border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'basics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#181926]/70 space-y-4">
            <h3 className="text-sm font-black text-violet-400 uppercase tracking-widest">Variáveis e Loops</h3>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-sky-300"># Atribuição (sem espaços!)</div>
              <div>NAME="DevOps"</div>
              <br />
              <div className="text-sky-300"># Loop For</div>
              <div>for server in web1 web2 db1; do</div>
              <div className="pl-4">echo "Fazendo ping em $server..."</div>
              <div className="pl-4">ping -c 1 $server</div>
              <div>done</div>
              <br />
              <div className="text-sky-300"># Loop While ler linha a linha</div>
              <div>while IFS= read -r line; do</div>
              <div className="pl-4">echo "Lido: $line"</div>
              <div>done &lt; ficheiro.txt</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#181926]/70 space-y-4">
            <h3 className="text-sm font-black text-violet-400 uppercase tracking-widest">Condicionais</h3>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-sky-300"># If / Else</div>
              <div>if [ -f "/tmp/lock" ]; then</div>
              <div className="pl-4">echo "Ficheiro existe!"</div>
              <div>elif [ "$USER" = "root" ]; then</div>
              <div className="pl-4">echo "É root mas ficheiro não existe"</div>
              <div>else</div>
              <div className="pl-4">echo "Não é root nem ficheiro existe"</div>
              <div>fi</div>
              <br />
              <div className="text-sky-300"># Case Statement</div>
              <div>case "$1" in</div>
              <div className="pl-4">start) echo "Iniciando..." ;;</div>
              <div className="pl-4">stop)  echo "Parando..." ;;</div>
              <div className="pl-4">*)     echo "Uso: $0 start|stop" ;;</div>
              <div>esac</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2"><Code size={16}/> grep</h3>
              <p className="text-xs text-slate-400 mb-3">Filtra linhas correspondentes a um padrão Regex.</p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-emerald-300"># Extrair IPs do log</div>
                <div>grep -oE "\b([0-9]&#123;1,3&#125;\.)&#123;3&#125;[0-9]&#123;1,3&#125;\b" access.log</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-500/5 space-y-2">
              <h3 className="text-sm font-black text-sky-400 flex items-center gap-2"><Code size={16}/> awk</h3>
              <p className="text-xs text-slate-400 mb-3">Processa e formata dados delimitados em colunas.</p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-sky-300"># Somar valores da 2ª coluna</div>
                <div>awk '&#123; sum += $2 &#125; END &#123; print sum &#125;' data.txt</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <h3 className="text-sm font-black text-rose-400 flex items-center gap-2"><Code size={16}/> sed</h3>
              <p className="text-xs text-slate-400 mb-3">Editor de streams (find & replace).</p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-rose-300"># Substituir texto in-place</div>
                <div>sed -i 's/localhost/db.prod/g' config.yml</div>
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
            <h3 className="text-sm font-black text-amber-400 mb-3 uppercase tracking-widest">Pipes & xargs</h3>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <div className="text-amber-300"># Encontrar todos os .log mais antigos que 7 dias e apagá-los</div>
              <div>find /var/log -name "*.log" -mtime +7 | xargs rm -f</div>
              <br />
              <div className="text-amber-300"># Descobrir qual IP gerou mais requests (Top 10)</div>
              <div>cat access.log | awk '&#123;print $1&#125;' | sort | uniq -c | sort -nr | head -n 10</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'best-practices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
            <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={16}/> O "Modo Estrito" do Bash
            </h3>
            <p className="text-sm text-slate-400">
              Sempre que criares um script para CI/CD ou produção, começa com estas flags para evitar desastres em que o script continua a executar após um erro.
            </p>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div><span className="text-emerald-400">set -e</span> : Pára imediatamente se um comando falhar (exit &gt; 0)</div>
              <div><span className="text-emerald-400">set -u</span> : Pára se tentares usar uma variável não definida</div>
              <div><span className="text-emerald-400">set -o pipefail</span> : Se um comando no meio de um pipe falhar, o pipeline todo falha</div>
              <div className="pt-2 border-t border-slate-800 text-sky-300">#!/bin/bash<br/>set -euo pipefail</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-4">
            <h3 className="text-sm font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={16}/> Boas Práticas Comuns
            </h3>
            <ul className="space-y-3">
              {[
                'Usa sempre aspas em variáveis: echo "$NOME" previne quebra em palavras ou paths com espaços.',
                'Usa $() em vez de backticks ` ` para sub-comandos (permite aninhamento fácil).',
                'Usa shellcheck (linter) nos teus CI/CD pipelines.',
                'Prefere funções para modularizar o código.',
                'Usa Traps para limpeza: trap "rm -f /tmp/tempfile" EXIT'
              ].map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-400">
                  <Cpu size={16} className="text-sky-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
