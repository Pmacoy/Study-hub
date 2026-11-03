import { Terminal, BookOpen, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface Props {
  tab: string;
}

export default function CitrixSimulator({ tab }: Props) {
  const [activeTab, setActiveTab] = useState<'theory' | 'interactive' | 'troubleshoot'>('theory');

  const contentMap: Record<string, { title: string; desc: string; theory: string[]; command: string; scenario: { q: string; a: string } }> = {
    'daas-mcs': {
      title: 'Citrix DaaS & Machine Creation Services (MCS)',
      desc: 'Gestão de catálogos de máquinas virtuais e atualizações sem downtime em arquiteturas cloud.',
      theory: [
        'MCS utiliza uma master image (Gold Image) para criar discos de diferenciação (write cache) para cada VDA.',
        'Permite rollbacks rápidos através da reversão do apontador do provisioning scheme para uma versão anterior de AMI/Snapshot.',
        'Remote PowerShell SDK (`Citrix.Broker.Admin.V2`) automatiza inventários, criação de catálogos e gestão de delivery groups.',
      ],
      command: `Get-BrokerMachine -DeliveryGroupName "Prod-Desktops" -RegistrationState Unregistered`,
      scenario: {
        q: 'Como atualizar 300 desktops sem interromper sessões ativas e com plano de retorno?',
        a: 'Publicar nova master image no provisioning scheme, agendar reboot com drenagem e manter o AMI anterior etiquetado para eventual rollback imediato.',
      },
    },
    'wem': {
      title: 'Citrix Workspace Environment Management (WEM)',
      desc: 'Otimização de logon, gestão de ações (shortcuts, printers, environmental variables) e cache do agente.',
      theory: [
        'O WEM acelera o logon substituindo políticas de grupo pesadas por um agente inteligente na VDA.',
        'Usa uma cache local (`Local Databases`) para garantir funcionamento mesmo em caso de perda temporária de conectividade com a cloud/servidor.',
        'Cuidado com tarefas externas (External Tasks) mal configuradas: um timeout síncrono padrão pode adicionar exatamente 30 segundos ao logon.',
      ],
      command: `& "C:\\Program Files (x86)\\Citrix\\Workspace Environment Management Agent\\AgentCacheUtility.exe" -RefreshCache`,
      scenario: {
        q: 'Logons ficaram 30 segundos mais lentos após alteração no WEM. Qual a causa provável?',
        a: 'Uma external task recém-adicionada aponta para uma share inacessível, atingindo o timeout síncrono predefinido de 30 segundos.',
      },
    },
    'profile-management': {
      title: 'Citrix Profile Management (UPM)',
      desc: 'Gestão de perfis de utilizador com suporte a streaming, active write-back e profile containers em VDI.',
      theory: [
        'UPM descarrega apenas o necessário no logon e sincroniza alterações em segundo plano.',
        'Evita perfis corrompidos através de exclusões inteligentes de caches de browsers e pastas temporárias.',
        'Nunca misturar Citrix UPM e FSLogix Profile Container na gestão do mesmo perfil completo para evitar conflitos de lock.',
      ],
      command: `UpmCLI.exe -export -user "lab\\utilizador" -destination "\\\\FS01\\UPM$"`,
      scenario: {
        q: 'Utilizador queixa-se de perda de definições da aplicação após relogging.',
        a: 'Verificar se o perfil foi devidamente descarregado no logoff (Write-back failure) devido a cortes de rede ou locks de ficheiro.',
      },
    },
    'fslogix': {
      title: 'FSLogix Profile & ODFC Containers',
      desc: 'Solução Microsoft para montagem de perfis e dados do Office 365 via VHDX em shares de rede.',
      theory: [
        'FSLogix redireciona o perfil do utilizador para um contentor VHDX montado dinamicamente durante o logon.',
        'O ODFC (Office Data File Container) separa o OST do Outlook do resto do perfil, evitando ficheiros gigantescos.',
        '`PreventLoginWithFailure` impede sessões com perfis temporários caso o VHDX esteja bloqueado por outra VDA órfã.',
      ],
      command: `Get-ChildItem "C:\\ProgramData\\FSLogix\\Logs" -Filter "*.log" | Sort-Object LastWriteTime -Descending`,
      scenario: {
        q: 'Utilizador entra e o ambiente está vazio (perfil temporário). O que aconteceu?',
        a: 'O VHDX está bloqueado numa sessão órfã anterior noutra VDA. É necessário terminar a sessão fantasma no Citrix Monitor.',
      },
    },
    'packer-gold-image': {
      title: 'Gold Image com Packer & AWS',
      desc: 'Construção automatizada e reproduzível de imagens VDA em AWS (AMIs) utilizando Packer e WinRM.',
      theory: [
        'Packer elimina o "drift" de configuração manual das Gold Images.',
        'Instalação silenciosa do Citrix VDA, WEM Agent, FSLogix e atualizações do Windows de forma idempotente.',
        'Integração com testes de fumo (smoke tests) antes de promover a AMI para produção.',
      ],
      command: `packer build -var "aws_region=us-east-1" citrix-vda-windows2022.pkr.hcl`,
      scenario: {
        q: 'Porquê usar Packer em vez de atualizar manualmente uma VM na consola AWS?',
        a: 'Garante rastreabilidade total (Infrastructure as Code), auditabilidade e elimina erros humanos na preparação da imagem.',
      },
    },
    'terraform-citrix': {
      title: 'Terraform Provider Citrix',
      desc: 'Gestão declarativa do site Citrix DaaS: Zonas, Hypervisores AWS, Catálogos MCS e Delivery Groups.',
      theory: [
        'O provider oficial da Citrix permite gerir toda a infraestrutura de virtualização via código.',
        'O objetivo após importar um site existente é atingir um `terraform plan` limpo (0 to add, 0 to change).',
        'Armazenamento seguro do state e integração com pipelines de CI/CD.',
      ],
      command: `terraform plan -out=tfplan && terraform apply tfplan`,
      scenario: {
        q: 'Como migrar um site Citrix configurado à mão há 2 anos para Terraform sem downtime?',
        a: 'Inventariar via PowerShell SDK, escrever os recursos em HCL correspondentes e executar `terraform import` recurso a recurso.',
      },
    },
    'pipeline-gitlab': {
      title: 'Pipeline GitLab CI/CD para VDI',
      desc: 'Automação completa do ciclo de vida: validate da imagem (Packer) e apply da infraestrutura (Terraform).',
      theory: [
        'Pipelines em fases: Validate → Plan → Manual Approval → Apply.',
        'Proteção de branches de produção e variáveis secretas mascaradas para credenciais Citrix Cloud e AWS.',
        'Feedback imediato em caso de falha de sintaxe ou erro de configuração no site.',
      ],
      command: `gitlab-ci-local --job validate-terraform`,
      scenario: {
        q: 'Uma mudança no Terraform quebrava o catálogo em produção. Como a pipeline evitou o incidente?',
        a: 'A fase de `terraform plan` correu automaticamente no Merge Request, mostrando o impacto destrutivo antes do merge.',
      },
    },
  };

  const item = contentMap[tab] || contentMap['daas-mcs'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-[20px] font-bold text-white">{item.title}</h2>
          <p className="text-[13px] text-slate-400 mt-1">{item.desc}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === 'theory' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Teoria & Conceitos
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === 'interactive' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Comando Prático
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === 'troubleshoot' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Caso Real / Entrevista
          </button>
        </div>
      </div>

      {/* Content Body */}
      {activeTab === 'theory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-start gap-3">
            <BookOpen className="text-violet-400 shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="text-[14px] font-semibold text-violet-200">Conceitos-Chave de Produção</h3>
              <p className="text-[12px] text-violet-300/80 mt-0.5">Fundamentos essenciais para arquitetos e engenheiros Citrix.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {item.theory.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                <span className="text-[13px] text-slate-300 leading-relaxed">{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'interactive' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="text-violet-400" size={16} />
                <span className="text-[13px] font-mono text-slate-200">Terminal / PowerShell / CLI</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">Pronto a executar</span>
            </div>
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-[12px] text-emerald-400 overflow-x-auto">
              {item.command}
            </div>
            <p className="text-[12px] text-slate-400">
              💡 Dica de Sénior: Execute este comando com privilégios adequados no seu ambiente de laboratório para validar o estado real dos componentes.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'troubleshoot' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h3 className="text-[14px] font-semibold text-amber-200">Desafio de Produção / Entrevista</h3>
                <p className="text-[13px] text-amber-100 font-medium mt-1">{item.scenario.q}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-[12px] font-semibold">
                <Lightbulb size={14} />
                <span>Abordagem de Resposta Sénior:</span>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed">{item.scenario.a}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
