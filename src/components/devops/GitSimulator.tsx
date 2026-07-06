import { useState } from 'react';
import { Copy, Check, GitBranch, ArrowRight } from 'lucide-react';

type View = 'basics' | 'branching' | 'workflows' | 'advanced';

function Code({ code, lang = '' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-mono text-slate-500">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300">
          {copied ? <><Check size={10} className="text-emerald-400" /><span className="text-emerald-400">Copiado</span></> : <><Copy size={10} />Copiar</>}
        </button>
      </div>
      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.startsWith('$') ? 'text-emerald-300' : 'text-slate-400'}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

const GIT_AREAS = [
  { name: 'Working Directory', color: 'rose', desc: 'Ficheiros no disco, modificados mas não rastreados', cmd: 'git status' },
  { name: 'Staging Area', color: 'amber', desc: 'Ficheiros adicionados com git add, prontos para commit', cmd: 'git add .' },
  { name: 'Local Repository', color: 'sky', desc: 'Histórico local de commits, não enviado ao remote', cmd: 'git commit -m "msg"' },
  { name: 'Remote Repository', color: 'emerald', desc: 'GitHub/GitLab/Bitbucket — fonte de verdade da equipa', cmd: 'git push origin main' },
];

const BRANCH_STRATEGIES = [
  { name: 'Git Flow', color: 'violet', branches: ['main (produção)', 'develop (integração)', 'feature/xxx', 'release/x.x.x', 'hotfix/xxx'], pro: 'Estrutura clara para releases planeados', con: 'Complexo para CI/CD contínuo' },
  { name: 'GitHub Flow', color: 'sky', branches: ['main (sempre deployável)', 'feature/xxx → PR → main'], pro: 'Simples, ideal para CI/CD e SaaS', con: 'Menos controlo para releases estabilizadas' },
  { name: 'Trunk-Based', color: 'emerald', branches: ['main (trunk)', 'feature branches de curta duração (<1 dia)', 'Feature flags para código inacabado'], pro: 'Máxima velocidade, menos merge conflicts', con: 'Requer feature flags e testes sólidos' },
];

const GIT_COMMANDS = {
  'Setup Inicial': `$ git config --global user.name "Teu Nome"
$ git config --global user.email "email@example.com"
$ git config --global core.editor "code --wait"
$ git config --global init.defaultBranch main
$ ssh-keygen -t ed25519 -C "email@example.com"
$ cat ~/.ssh/id_ed25519.pub  # copiar para GitHub Settings`,

  'Workflow Diário': `# Ver estado
$ git status
$ git log --oneline --graph --all

# Criar feature branch
$ git checkout -b feature/nova-funcionalidade

# Adicionar e commitar
$ git add src/componente.ts
$ git add -p  # adicionar por partes (interactive)
$ git commit -m "feat: adiciona componente de login"

# Sincronizar com main antes de fazer PR
$ git fetch origin
$ git rebase origin/main
$ git push origin feature/nova-funcionalidade`,

  'Merge vs Rebase': `# MERGE — preserva histórico, cria merge commit
$ git checkout main
$ git merge feature/login
# ⚠ Cria "merge bubbles" no histórico

# REBASE — histórico linear, sem merge commits
$ git checkout feature/login
$ git rebase main
# ✓ Commits re-aplicados sobre main
# ⚠ Nunca fazer rebase em branches partilhadas!

# SQUASH — agrupar commits antes de merge
$ git rebase -i HEAD~3
# pick → squash para os commits intermédios
# Resulta: 1 commit limpo no PR`,

  'Desfazer & Recovery': `# Desfazer último commit (mantém ficheiros)
$ git reset --soft HEAD~1

# Descartar todas as alterações não commitadas
$ git checkout -- .

# Reverter commit já em main (cria novo commit)
$ git revert abc1234

# Recuperar commit perdido
$ git reflog        # ver todos os commits recentes
$ git checkout abc1234  # recuperar estado

# Limpar ficheiros não rastreados
$ git clean -fd`,
};

const COMMIT_TYPES = [
  { type: 'feat', desc: 'Nova funcionalidade', example: 'feat: adiciona autenticação OAuth2' },
  { type: 'fix', desc: 'Correcção de bug', example: 'fix: corrige null pointer no login' },
  { type: 'docs', desc: 'Documentação', example: 'docs: actualiza README com setup local' },
  { type: 'refactor', desc: 'Refactoring sem mudança funcional', example: 'refactor: extrai lógica de validação' },
  { type: 'test', desc: 'Adição ou correcção de testes', example: 'test: adiciona testes unitários ao serviço' },
  { type: 'chore', desc: 'Tarefas de manutenção', example: 'chore: actualiza dependências npm' },
  { type: 'ci', desc: 'Alterações no CI/CD', example: 'ci: adiciona step de scanning no pipeline' },
  { type: 'perf', desc: 'Melhoria de performance', example: 'perf: optimiza query de pesquisa' },
];

export default function GitSimulator() {
  const [view, setView] = useState<View>('basics');
  const [activeCmd, setActiveCmd] = useState('Setup Inicial');
  const [selectedStrategy, setSelectedStrategy] = useState(0);

  const views = [
    { id: 'basics' as View, label: '📦 Áreas do Git' },
    { id: 'branching' as View, label: '🌿 Branching Strategies' },
    { id: 'workflows' as View, label: '⌨️ Comandos' },
    { id: 'advanced' as View, label: '✍️ Conventional Commits' },
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

      {view === 'basics' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {GIT_AREAS.map((a, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className={`p-4 rounded-2xl border text-center min-w-[150px] ${a.color === 'rose' ? 'border-rose-500/30 bg-rose-500/8' : a.color === 'amber' ? 'border-amber-500/30 bg-amber-500/8' : a.color === 'sky' ? 'border-sky-500/30 bg-sky-500/8' : 'border-emerald-500/30 bg-emerald-500/8'}`}>
                  <div className={`text-[11px] font-black uppercase mb-1 ${a.color === 'rose' ? 'text-rose-400' : a.color === 'amber' ? 'text-amber-400' : a.color === 'sky' ? 'text-sky-400' : 'text-emerald-400'}`}>{a.name}</div>
                  <div className="text-[10px] text-slate-500 leading-relaxed">{a.desc}</div>
                  <code className={`mt-2 block text-[10px] font-mono font-bold ${a.color === 'rose' ? 'text-rose-300' : a.color === 'amber' ? 'text-amber-300' : a.color === 'sky' ? 'text-sky-300' : 'text-emerald-300'}`}>{a.cmd}</code>
                </div>
                {i < GIT_AREAS.length - 1 && <ArrowRight size={16} className="text-slate-600 shrink-0" />}
              </div>
            ))}
          </div>
          <Code code={GIT_COMMANDS['Workflow Diário']} lang="workflow diário" />
        </div>
      )}

      {view === 'branching' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {BRANCH_STRATEGIES.map((s, i) => (
              <button key={i} onClick={() => setSelectedStrategy(i)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedStrategy === i ? `bg-${s.color}-500/15 border-${s.color}-500/40 text-${s.color}-300` : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}>
                <div className="flex items-center gap-2">
                  <GitBranch size={13} className={selectedStrategy === i ? `text-${s.color}-400` : 'text-slate-600'} />
                  <span className="text-[13px] font-semibold">{s.name}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
            {(() => {
              const s = BRANCH_STRATEGIES[selectedStrategy];
              return (
                <>
                  <div className={`text-lg font-black ${s.color === 'violet' ? 'text-violet-300' : s.color === 'sky' ? 'text-sky-300' : 'text-emerald-300'}`}>{s.name}</div>
                  <div className="space-y-2">
                    {s.branches.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 font-mono text-[12px]">
                        <GitBranch size={11} className="text-slate-600" />
                        <span className="text-slate-300">{b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] font-bold text-emerald-400 mb-1">✓ Vantagem</div>
                      <div className="text-[11px] text-slate-400">{s.pro}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <div className="text-[10px] font-bold text-rose-400 mb-1">✗ Limitação</div>
                      <div className="text-[11px] text-slate-400">{s.con}</div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {view === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            {Object.keys(GIT_COMMANDS).map(k => (
              <button key={k} onClick={() => setActiveCmd(k)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all ${activeCmd === k ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}>
                {k}
              </button>
            ))}
          </div>
          <div className="lg:col-span-3">
            <Code code={GIT_COMMANDS[activeCmd as keyof typeof GIT_COMMANDS]} lang={`git — ${activeCmd.toLowerCase()}`} />
          </div>
        </div>
      )}

      {view === 'advanced' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/8">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest mb-2">Conventional Commits</div>
            <code className="font-mono text-[12px] text-slate-300">
              {'<type>(<scope>): <description>'}
            </code>
            <p className="text-[11px] text-slate-500 mt-1">Formato padronizado para gerar CHANGELOG e versioning semântico automático.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COMMIT_TYPES.map(c => (
              <div key={c.type} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <code className="font-mono text-[12px] font-black text-amber-300 shrink-0 w-16">{c.type}</code>
                <div>
                  <div className="text-[11px] text-slate-400">{c.desc}</div>
                  <div className="text-[10px] font-mono text-slate-600 mt-0.5">{c.example}</div>
                </div>
              </div>
            ))}
          </div>
          <Code code={`# .gitmessage — Template para commits
# Copiar para: git config --global commit.template ~/.gitmessage

# <type>(<scope>): <título em minúsculas> (máx 72 chars)

# Corpo — explica o PORQUÊ, não o QUÊ (opcional)

# Footer — referências, breaking changes (opcional)
# BREAKING CHANGE: descreve a mudança incompatível
# Closes #123, #456`} lang="git commit template" />
        </div>
      )}
    </div>
  );
}
