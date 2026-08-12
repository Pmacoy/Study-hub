import { useState } from 'react';
import { ExternalLink, Compass, Users, AlertTriangle, CalendarCheck, Award } from 'lucide-react';

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
  const [view, setView] = useState<View>('what');

  const tabs: { id: View; label: string }[] = [
    { id: 'what',     label: 'O que é ser especialista' },
    { id: 'skills',   label: 'As 5 competências' },
    { id: 'mistakes', label: 'Erros comuns' },
    { id: 'plan',     label: 'Plano de 90 dias' },
    { id: 'certs',    label: 'Certificações' },
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
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Carreira</div>
            <h1 className="text-2xl font-bold text-white">Como se constrói um especialista</h1>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed max-w-2xl">
              O diagnóstico mede o que sabes fazer. Isto trata do resto — profundidade, julgamento,
              comunicação e as decisões de carreira que separam quem executa de quem é chamado quando
              o problema é difícil.
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
              <h3 className="text-[14px] font-bold text-white">A definição que interessa</h3>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Um especialista é quem desenvolveu conhecimento profundo numa área e usa essa experiência
              para resolver problemas complexos, orientar decisões técnicas e reduzir risco.
              Não precisa de saber tudo — precisa de dominar um campo, perceber como ele se relaciona
              com o resto, e transformar isso em resultado.
            </p>
            <p className="mt-3 text-[13px] text-slate-400 leading-relaxed">
              Na prática, é a pessoa que costuma ser chamada quando aparece uma falha difícil,
              uma decisão de arquitectura, um incidente crítico ou uma tecnologia que a equipa ainda não domina.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-[14px] font-bold text-white mb-3">Generalista vs especialista</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">Generalista</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  <li>· Conhece várias áreas</li>
                  <li>· Liga tecnologias e equipas</li>
                  <li>· Adapta-se a funções diferentes</li>
                  <li>· Visão abrangente</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Especialista</div>
                <ul className="space-y-1.5 text-[12px] text-slate-400">
                  <li>· Aprofunda-se numa área</li>
                  <li>· Resolve problemas complexos do domínio</li>
                  <li>· Torna-se referência num assunto</li>
                  <li>· Maior profundidade técnica</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              Nenhum é melhor que o outro — e a maioria das pessoas alterna entre os dois ao longo da carreira.
              Os melhores especialistas costumam ter uma base generalista sólida por baixo.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-amber-400" />
              <h3 className="text-[14px] font-bold text-white">Os papéis não são sinónimos</h3>
            </div>
            <div className="space-y-1.5">
              {ROLES.map(([role, focus]) => (
                <div key={role} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className="shrink-0 text-[12px] font-bold text-amber-300 w-40">{role}</span>
                  <span className="text-[12px] text-slate-400">{focus}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-slate-500 leading-relaxed">
              "Especialista" não substitui o nome da profissão — indica o grau de profundidade dentro dela.
            </p>
          </section>

          <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4">
            <div className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Ao avaliar uma vaga</div>
            <p className="text-[12px] text-sky-100 leading-relaxed">
              Um título bonito não garante autonomia nem capacidade de decisão. Olha antes para a
              complexidade dos problemas, o nível de autonomia, as decisões que vais poder tomar,
              se há liderança técnica, e o impacto de uma decisão errada.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Especialista precisa de virar gestor?</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              Não. Muitas empresas mantêm trilhas paralelas: gestão de um lado; especialista, staff engineer,
              principal engineer e arquitecto do outro. A pergunta honesta é: queres continuar a resolver
              problemas técnicos complexos, ou queres desenvolver pessoas e responder pelos resultados de uma equipa?
              São trabalhos diferentes, não níveis diferentes.
            </p>
          </div>
        </div>
      )}

      {/* ── Competências ────────────────────────────────────── */}
      {view === 'skills' && (
        <div className="space-y-4">
          <p className="text-[12px] text-slate-400 leading-relaxed">
            O diagnóstico do hub mede competências técnicas por área. Estas cinco são transversais —
            e são normalmente o que separa um sénior de um especialista.
          </p>
          {SOFT_SKILLS.map(s => (
            <section key={s.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <h3 className="text-[14px] font-bold text-white">{s.title}</h3>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">{s.body}</p>
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Sinal de domínio</div>
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
            <h3 className="text-[14px] font-bold text-white">O que trava a maioria das carreiras</h3>
          </div>
          {MISTAKES.map(([mistake, why]) => (
            <div key={mistake} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-[13px] font-semibold text-rose-300">{mistake}</div>
              <p className="text-[12px] text-slate-400 mt-1.5 leading-relaxed">{why}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 mt-4">
            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">O princípio por trás de todos</div>
            <p className="text-[12px] text-amber-100 leading-relaxed">
              Especializa-te num <strong>problema</strong>, não numa ferramenta. É melhor dominar segurança
              de aplicações do que depender de um scanner específico; melhor perceber engenharia de dados
              do que construir a carreira à volta de uma plataforma. As ferramentas mudam — os problemas ficam.
            </p>
          </div>
        </div>
      )}

      {/* ── Plano 90 dias ───────────────────────────────────── */}
      {view === 'plan' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarCheck size={15} className="text-amber-400" />
            <h3 className="text-[14px] font-bold text-white">Plano prático de 90 dias</h3>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Noventa dias não transformam ninguém em especialista. Mas criam uma trajectória concreta —
            o que já é bastante melhor do que trocar o título no perfil.
          </p>

          {PLAN_90.map((phase, i) => (
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
            <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Como o hub encaixa</div>
            <p className="text-[12px] text-emerald-100 leading-relaxed">
              O diagnóstico dá-te as lacunas dos primeiros 30 dias. Os 50 projectos dão-te o que construir
              entre os 30 e os 60. Os cenários e o terminal treinam a capacidade de diagnóstico que
              nenhum curso ensina. E o banco de perguntas prepara a conversa no fim.
            </p>
          </div>
        </div>
      )}

      {/* ── Certificações ───────────────────────────────────── */}
      {view === 'certs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-400" />
            <h3 className="text-[14px] font-bold text-white">Quando uma certificação vale a pena</h3>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Ajudam quando correspondem à área e ao momento da carreira. A melhor certificação não é a
            mais famosa — é a que valida conhecimento útil para o trabalho que queres fazer.
          </p>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <div className="space-y-1.5">
              {[
                ['Fundamentos de redes', 'CCNA'],
                ['Entrar em segurança', 'Security+ ou SSCP'],
                ['Segurança avançada', 'CISSP (exige 5 anos de experiência)'],
                ['Trabalhar com cloud', 'Certificação associate da plataforma que usas'],
                ['Arquitectura cloud', 'Certificação professional, depois de experiência'],
                ['Gestão de serviços', 'ITIL'],
              ].map(([goal, cert]) => (
                <div key={goal} className="flex gap-3 p-2.5 rounded-xl bg-slate-900">
                  <span className="flex-1 text-[12px] text-slate-400">{goal}</span>
                  <span className="text-[12px] font-semibold text-amber-300">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4">
            <p className="text-[13px] text-rose-100 leading-relaxed font-semibold">
              Certificado sem experiência ainda é só um PDF caro.
            </p>
            <p className="text-[12px] text-slate-400 leading-relaxed mt-2">
              A certificação valida conhecimento e organiza o estudo. Não prova sozinha que resolves
              problemas reais — é para isso que serve o portfolio.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-4">
            <div className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Autoridade constrói-se com evidências</div>
            <p className="text-[12px] text-violet-100 leading-relaxed">
              Não nasce de escrever "especialista" no LinkedIn. Vem de projectos concluídos, problemas
              resolvidos, documentação, artigos, código, estudos de caso e capacidade de explicar decisões.
              O objectivo não é parecer que sabes tudo — é demonstrar, de forma verificável, o que sabes fazer.
            </p>
          </div>
        </div>
      )}

      {/* Fonte */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Baseado em</div>
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
