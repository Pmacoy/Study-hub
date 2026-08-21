export const CAREER_EN = {
  eyebrow: 'Career',
  title: 'How specialists are built',
  intro: 'The diagnostic measures what you can do. This covers the rest — depth, judgement, communication, and the career decisions that separate people who execute from people who get called when the problem is hard.',

  tabs: {
    what: 'What a specialist is',
    skills: 'The 5 competencies',
    mistakes: 'Common mistakes',
    plan: '90-day plan',
    certs: 'Certifications',
  },

  definitionTitle: 'The definition that matters',
  definition1: 'A specialist is someone who has developed deep knowledge in one area and uses that experience to solve complex problems, guide technical decisions and reduce risk. They do not need to know everything — they need to master one field, understand how it relates to the rest, and turn that into results.',
  definition2: 'In practice, it is the person who tends to get called when a difficult failure appears, an architecture decision is needed, an incident turns critical, or the team hits a technology it does not yet know.',

  vsTitle: 'Generalist vs specialist',
  generalist: 'Generalist',
  generalistPoints: [
    'Knows several areas',
    'Connects technologies and teams',
    'Adapts to different roles',
    'Broad perspective',
  ],
  specialist: 'Specialist',
  specialistPoints: [
    'Goes deep in one area',
    'Solves complex problems in that domain',
    'Becomes a reference on a subject',
    'Greater technical depth',
  ],
  vsNote: 'Neither is better than the other — and most people alternate between them over a career. The best specialists usually have a solid generalist base underneath.',

  rolesTitle: 'The roles are not synonyms',
  roles: [
    ['Analyst', 'Analyses processes, systems or requirements'],
    ['Developer', 'Builds, tests and maintains software'],
    ['Cloud engineer', 'Designs, automates and operates cloud environments'],
    ['Specialist', 'Masters one concrete domain in depth'],
    ['Architect', 'Designs structures and long-term decisions'],
    ['Consultant', 'Diagnoses problems and recommends solutions'],
    ['Manager', 'Manages people, budget and priorities'],
  ] as [string, string][],
  rolesNote: '"Specialist" does not replace the name of the profession — it indicates the degree of depth within it.',

  vacancyTitle: 'When evaluating a job',
  vacancyBody: 'A nice title guarantees neither autonomy nor decision-making power. Look instead at the complexity of the problems, the level of autonomy, the decisions you will get to make, whether there is technical leadership, and the impact of a wrong decision.',

  managerTitle: 'Does a specialist have to become a manager?',
  managerBody: 'No. Many companies keep parallel tracks: management on one side; specialist, staff engineer, principal engineer and architect on the other. The honest question is: do you want to keep solving complex technical problems, or do you want to develop people and be accountable for a team\'s results? These are different jobs, not different levels.',

  skillsIntro: 'The hub diagnostic measures technical competencies by area. These five are cross-cutting — and they are usually what separates a senior from a specialist.',
  skills: [
    {
      title: 'Technical depth',
      icon: '🔬',
      body: 'Understanding fundamentals, limitations, common failure modes and the consequences of the technologies you use. Memorising commands is not depth — it is recall.',
      check: 'You can explain why a solution works, not just that it works.',
    },
    {
      title: 'Diagnostic ability',
      icon: '🔍',
      body: 'Real problems do not come with a tutorial. Forming hypotheses, gathering evidence, reproducing the failure, eliminating causes, measuring the result — and never changing anything without a rollback plan.',
      check: 'Facing a problem you have never seen, you have a method rather than a guess.',
    },
    {
      title: 'Systems thinking',
      icon: '🕸️',
      body: 'A local decision affects security, performance, cost, operations and users. Seeing the dependencies and consequences is part of the job.',
      check: 'Before deciding, you can name what that decision will break somewhere else.',
    },
    {
      title: 'Communication',
      icon: '💬',
      body: 'Knowledge trapped in one person\'s head is operational risk. Documenting, explaining alternatives, communicating risk, mentoring colleagues, adapting language to the audience.',
      check: 'A non-technical manager understands the risk you just explained.',
    },
    {
      title: 'Critical thinking',
      icon: '⚖️',
      body: 'Being a specialist is not defending a tool like a football club. It is knowing when to use it — and above all when not to.',
      check: 'You have recommended NOT using the technology you are strongest in.',
    },
  ],

  mistakesTitle: 'What holds most careers back',
  mistakes: [
    ['Collecting courses without applying them', 'Consuming content feels like progress, but it does not replace experience. The hub has 50 projects for exactly this reason.'],
    ['Studying only tools', 'A career tied to a product is vulnerable to market shifts. Tools change; problems stay.'],
    ['Ignoring fundamentals', 'Without fundamentals, any problem that differs from the tutorial becomes an emergency. Linux and networking hold up everything else.'],
    ['Dismissing communication', 'A specialist who cannot explain risk may be technically brilliant and irrelevant when the decision is made.'],
    ['Confusing title with competence', 'Getting the title does not end the learning — nor prove it happened.'],
    ['Trying to keep up with everything', 'Produces shallow knowledge and a fine collection of open tabs.'],
  ] as [string, string][],
  mistakesPrincipleTitle: 'The principle behind all of them',
  mistakesPrinciple: 'Specialise in a problem, not a tool. Better to master application security than to depend on one specific scanner; better to understand data engineering than to build a career around one platform. Tools change — problems remain.',

  planTitle: 'A practical 90-day plan',
  planIntro: 'Ninety days will not turn anyone into a specialist. But they create a concrete trajectory — which is considerably better than changing the title on your profile.',
  plan: [
    {
      window: 'Days 1–30',
      items: [
        'Pick one area and research real job postings in your region',
        'Notice the requirements that repeat — that is the market telling you what matters',
        'Identify your gaps (the hub diagnostic is built for this)',
        'Choose one concrete practical project',
      ],
    },
    {
      window: 'Days 30–60',
      items: [
        'Build the project and document the decisions as you go',
        'Seek review from someone more experienced',
        'Study the fundamentals the project exposed',
        'Publish the code where possible',
      ],
    },
    {
      window: 'Days 60–90',
      items: [
        'Fix the project based on feedback',
        'Write an article or case study about it',
        'Update your CV and LinkedIn with evidence, not adjectives',
        'Evaluate a certification consistent with the chosen area',
      ],
    },
  ],
  planHubTitle: 'How the hub fits',
  planHubBody: 'The diagnostic gives you the gaps for the first 30 days. The 50 projects give you what to build between 30 and 60. The scenarios and terminal train the diagnostic ability no course teaches. And the question bank prepares the conversation at the end.',

  certsTitle: 'When a certification is worth it',
  certsIntro: 'They help when they match the area and the moment in your career. The best certification is not the most famous — it is the one that validates knowledge useful for the work you want to do.',
  certsRows: [
    ['Networking fundamentals', 'CCNA'],
    ['Getting into security', 'Security+ or SSCP'],
    ['Advanced security', 'CISSP (requires 5 years of experience)'],
    ['Working with cloud', 'Associate certification for the platform you use'],
    ['Cloud architecture', 'Professional certification, after experience'],
    ['Service management', 'ITIL'],
  ] as [string, string][],
  certsWarningTitle: 'A certificate without experience is still an expensive PDF.',
  certsWarningBody: 'Certification validates knowledge and structures your study. It does not on its own prove you can solve real problems — that is what the portfolio is for.',
  authorityTitle: 'Authority is built on evidence',
  authorityBody: 'It does not come from writing "specialist" on LinkedIn. It comes from completed projects, solved problems, documentation, articles, code, case studies and the ability to explain decisions. The goal is not to look like you know everything — it is to demonstrate, verifiably, what you can do.',

  basedOn: 'Based on',
};
