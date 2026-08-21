import { useState } from 'react';
import { ExternalLink, Compass, Users, AlertTriangle, CalendarCheck, Award } from 'lucide-react';
import { useLang } from '../../i18n/LangContext';
import { CAREER_EN } from '../../i18n/careerEn';

interface Props {
  onExit: () => void;
}

type View = 'what' | 'skills' | 'mistakes' | 'plan' | 'certs';

const ROLES: [string, string][] = [
  ['Analista', 'Analisa processos, sistemas ou requisitos'],
  ['Desenvolvedor', 'Constrói, testa e mantém software'],
  ['Engenheiro de cloud', 'Projecta, automatiza e opera ambientes na nuvem'],
  ['Especialista', 'Domina em profundidade um domínio concreto'],
  ['Arquitecto', 'Desenha estruturas e decisões de longo prazo'],
  ['Consultor', 'Diagnostica problemas e recomenda soluções'],
  ['Gestor', 'Administra pessoas, orçamento e prioridades'],
];

const SOFT_SKILLS: { title: string; icon: string; body: string; check: string }[] = [
  {
    title: 'Profundidade técnica',
    icon: '🔬',
    body: 'Perceber fundamentos, limitações, falhas comuns e as consequências das tecnologias que usas. Decorar comandos não é profundidade — é memória.',
    check: 'Consegues explicar porque uma solução funciona, não apenas que funciona.',
  },
  {
    title: 'Capacidade de diagnóstico',
    icon: '🔍',
    body: 'Problemas reais não vêm com tutorial. Formular hipóteses, recolher evidências, reproduzir a falha, eliminar causas, medir o resultado — e nunca mudar nada sem plano de rollback.',
    check: 'Perante um problema que nunca viste, tens um método em vez de um palpite.',
  },
  {
    title: 'Visão sistémica',
    icon: '🕸️',
    body: 'Uma decisão local afecta segurança, desempenho, custo, operação e utilizadores. Ver as dependências e as consequências faz parte do trabalho.',
    check: 'Antes de decidir, consegues nomear o que essa decisão vai partir noutro sítio.',
  },
  {
    title: 'Comunicação',
    icon: '💬',
    body: 'Conhecimento preso na cabeça de uma pessoa é risco operacional. Documentar, explicar alternativas, comunicar riscos, orientar colegas, adaptar a linguagem a quem ouve.',
    check: 'Um gestor sem formação técnica percebe o risco que lhe explicaste.',
  },
  {
    title: 'Pensamento crítico',
    icon: '⚖️',
    body: 'Ser especialista não é defender uma ferramenta como se fosse clube de futebol. É saber quando usá-la — e sobretudo quando não usar.',
    check: 'Já recomendaste NÃO usar a tecnologia em que és mais forte.',
  },
];

const MISTAKES: [string, string][] = [
  ['Coleccionar cursos sem aplicar', 'Consumir conteúdo dá sensação de progresso, mas não substitui experiência. O hub tem 50 projectos precisamente por isto.'],
  ['Estudar apenas ferramentas', 'Uma carreira presa a um produto fica vulnerável a mudanças de mercado. Ferramentas mudam; os problemas mantêm-se.'],
  ['Ignorar fundamentos', 'Sem fundamentos, qualquer problema diferente do tutorial vira emergência. Linux e redes sustentam tudo o resto.'],
  ['Desprezar comunicação', 'Um especialista incapaz de explicar riscos pode ser brilhante tecnicamente e irrelevante na hora da decisão.'],
  ['Confundir cargo com competência', 'Receber o título não encerra a aprendizagem — nem prova que ela aconteceu.'],
  ['Tentar acompanhar tudo', 'Produz conhecimento raso e uma bela colecção de separadores abertos.'],
];

const PLAN_90: { window: string; items: string[] }[] = [
  {
    window: 'Dias 1–30',
    items: [
      'Escolhe uma área e pesquisa vagas reais na tua região',
      'Repara nos requisitos que se repetem — é o mercado a dizer-te o que importa',
      'Identifica as tuas lacunas (o diagnóstico do hub serve para isto)',
      'Escolhe um projecto prático concreto',
    ],
  },
  {
    window: 'Dias 30–60',
    items: [
      'Desenvolve o projecto e documenta as decisões pelo caminho',
      'Procura revisão de alguém mais experiente',
      'Estuda os fundamentos que o projecto expôs',
      'Publica o código quando possível',
    ],
  },
  {
    window: 'Dias 60–90',
    items: [
      'Corrige o projecto com base no feedback',
      'Escreve um artigo ou estudo de caso sobre ele',
      'Actualiza currículo e LinkedIn com evidências, não adjectivos',
      'Avalia uma certificação coerente com a área escolhida',
    ],
  },
];

export default function CareerView({ onExit }: Props) {
  const { lang, t } = useLang();
  const [view, setView] = useState<View>('what');
  const L = lang === 'en' ? CAREER_EN : null;
  const roles = L?.roles ?? ROLES;
  const skills = L?.skills ?? SOFT_SKILLS;
  const mistakes = L?.mistakes ?? MISTAKES;
  const plan = L?.plan ?? PLAN_90;

  const tabs: { id: View; label: string }[] = [
    { id: 'what',     label: L?.tabs.what     ?? 'O que é ser especialista' },
    { id: 'skills',   label: L?.tabs.skills   ?? 'As 5 competências' },
    { id: 'mistakes', label: L?.tabs.mistakes ?? 'Erros comuns' },
    { id: 'plan',     label: L?.tabs.plan     ?? 'Plano de 90 dias' },
    { id: 'certs',    label: L?.tabs.certs    ?? 'Certificações' },
  ];

  return (
    <div className="space-y-6">
      <button onClick={onExit} className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-slate-300">
        ← Voltar
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-slate-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🧭</div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{L?.eyebrow ?? 'Carreira'}</div>
            <h1 className="text-2xl font-bold text-white">{L?.title ?? 'Como se constrói um especialista'}</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              {L?.intro ?? 'O diagnóstico mede o que sabes fazer. Isto trata do resto.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-3 py-1.5 rounded-2xl border text-[12px] font-semibold transition-all ${
              view === t.id
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── O que é ─────────────────────────────────────────── */}
      {view === 'what' && (
        <div className="space-y-5">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Compass size={15} className="text-amber-400" />
              <h3 className="text-[14px] font-bold text-white">{L?.definitionTitle ?? 'A definição que interessa'}</h3>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              {L?.definition1 ?? ''}
            </p>
            <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
              {L?.definition2 ?? ''}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">{L?.vsTitle ?? 'Generalista vs especialista'}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">{L?.generalist ?? 'Generalista'}</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  {(L?.generalistPoints ?? ['Conhece várias áreas','Liga tecnologias e equipas','Adapta-se a funções diferentes','Visão abrangente']).map(x => <li key={x}>· {x}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">{L?.specialist ?? 'Especialista'}</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  {(L?.specialistPoints ?? ['Aprofunda-se numa área','Resolve problemas complexos do domínio','Torna-se referência num assunto','Maior profundidade técnica']).map(x => <li key={x}>· {x}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              {L?.vsNote ?? ''}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-amber-400" />
              <h3 className="text-[14px] font-bold text-white">{L?.rolesTitle ?? 'Os papéis não são sinónimos'}</h3>
            </div>
            <div className="space-y-1.5">
              {roles.map(([role, focus]) => (
                <div key={role} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-[12px] font-bold text-amber-300 w-40">{role}</span>
                  <span className="text-[12px] text-slate-400">{focus}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              {L?.rolesNote ?? ''}
            </p>
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">{L?.vacancyTitle ?? 'Ao avaliar uma vaga'}</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              {L?.vacancyBody ?? ''}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{L?.managerTitle ?? 'Especialista precisa de virar gestor?'}</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              {L?.managerBody ?? ''}
            </p>
          </div>
        </div>
      )}

      {/* ── Competências ────────────────────────────────────── */}
      {view === 'skills' && (
        <div className="space-y-4">
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {L?.skillsIntro ?? ''}
          </p>
          {skills.map(s => (
            <section key={s.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <h3 className="text-[14px] font-bold text-white">{s.title}</h3>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">{s.body}</p>
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{t('diag.masterySignal')}</div>
                <p className="text-[12px] text-emerald-100/80 leading-relaxed italic">{s.check}</p>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Erros ───────────────────────────────────────────── */}
      {view === 'mistakes' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-rose-400" />
            <h3 className="text-[14px] font-bold text-white">{L?.mistakesTitle ?? 'O que trava a maioria das carreiras'}</h3>
          </div>
          {mistakes.map(([mistake, why]) => (
            <div key={mistake} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[13px] font-semibold text-rose-300">{mistake}</div>
              <p className="text-[12px] text-slate-400 mt-1.5 leading-relaxed">{why}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 mt-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{L?.mistakesPrincipleTitle ?? 'O princípio por trás de todos'}</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              {L?.mistakesPrinciple ?? ''}
            </p>
          </div>
        </div>
      )}

      {/* ── Plano 90 dias ───────────────────────────────────── */}
      {view === 'plan' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarCheck size={15} className="text-amber-400" />
            <h3 className="text-[14px] font-bold text-white">{L?.planTitle ?? 'Plano prático de 90 dias'}</h3>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {L?.planIntro ?? ''}
          </p>

          {plan.map((phase, i) => (
            <section key={phase.window} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[10px] font-black text-amber-300">
                  {i + 1}
                </span>
                <h4 className="text-[13px] font-bold text-white">{phase.window}</h4>
              </div>
              <div className="space-y-1.5 pl-8">
                {phase.items.map(item => (
                  <div key={item} className="flex gap-2 text-[12px] text-slate-400">
                    <span className="text-amber-400 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4">
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{L?.planHubTitle ?? 'Como o hub encaixa'}</div>
            <p className="text-[12px] text-emerald-100 leading-relaxed">
              {L?.planHubBody ?? ''}
            </p>
          </div>
        </div>
      )}

      {/* ── Certificações ───────────────────────────────────── */}
      {view === 'certs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-400" />
            <h3 className="text-[14px] font-bold text-white">{L?.certsTitle ?? 'Quando uma certificação vale a pena'}</h3>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            {L?.certsIntro ?? ''}
          </p>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="space-y-1.5">
              {(L?.certsRows ?? [
                ['Fundamentos de redes', 'CCNA'],
                ['Entrar em segurança', 'Security+ ou SSCP'],
                ['Segurança avançada', 'CISSP (exige 5 anos de experiência)'],
                ['Trabalhar com cloud', 'Certificação associate da plataforma que usas'],
                ['Arquitectura cloud', 'Certificação professional, depois de experiência'],
                ['Gestão de serviços', 'ITIL'],
              ]).map(([goal, cert]) => (
                <div key={goal} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className="flex-1 text-[12px] text-slate-400">{goal}</span>
                  <span className="text-[12px] font-semibold text-amber-300">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
            <p className="text-[13px] text-rose-100 leading-relaxed font-semibold">
              {L?.certsWarningTitle ?? 'Certificado sem experiência ainda é só um PDF caro.'}
            </p>
            <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
              {L?.certsWarningBody ?? ''}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">{L?.authorityTitle ?? 'Autoridade constrói-se com evidências'}</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              {L?.authorityBody ?? ''}
            </p>
          </div>
        </div>
      )}

      {/* Fonte */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">{L?.basedOn ?? 'Baseado em'}</div>
        <a
          href="https://www.tiespecialistas.com.br/especialista-em-ti/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[12px] text-slate-400 hover:text-slate-200"
        >
          <span>«Especialista em TI: o que faz e como construir essa carreira» — Augusto Vespermann, TI Especialistas</span>
          <ExternalLink size={11} className="shrink-0" />
        </a>
      </div>
    </div>
  );
}
