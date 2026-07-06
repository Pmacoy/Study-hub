import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type View = 'concepts' | 'structure' | 'cpe' | 'commands';

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
        {code.split('\n').map((line, i) => <div key={i} className={line.startsWith('#') ? 'text-slate-600' : line.match(/^(terraform|provider|resource|module|variable|output|locals|data)\b/) ? 'text-violet-400' : line.match(/^\s+(source|version|count|for_each)\s*=/) ? 'text-sky-300' : line.startsWith('$') ? 'text-emerald-300' : 'text-slate-300'}>{line}</div>)}
      </pre>
    </div>
  );
}

const TERRAFORM_MAIN = `# main.tf — Serverless Cross-Cloud Connectivity
terraform {
  required_version = ">= 1.8.0"
  required_providers {
    azurerm    = { source = "hashicorp/azurerm", version = "~> 3.0" }
    databricks = { source = "databricks/databricks", version = "~> 1.29" }
  }
}

locals {
  env = lower(var.env_name)
  # SKU por ambiente — FinOps!
  vmss_sku = {
    "DEV"  = "Standard_B2s"      # ~€0.04/h
    "TEST" = "Standard_B2ms"     # ~€0.08/h
    "PROD" = "Standard_D2s_v3"   # ~€0.10/h
  }[var.env_name]

  vmss_instances = { "DEV" = 2, "TEST" = 2, "PROD" = 3 }[var.env_name]

  Tags = merge(var.additional_tags, {
    Environment = var.env_name
    Project     = var.tag_project_name
    ManagedBy   = "Terraform"
  })
}

# Módulo principal — conectividade Oracle via Private Link
module "serverless_connectivity" {
  source     = "./modules/serverless-connectivity"
  env_name   = var.env_name
  vmss_sku   = local.vmss_sku
  vmss_instances = local.vmss_instances
  common_tags = local.Tags

  oracle_popm_host  = var.oracle_popm_host
  oracle_erpp_host  = var.oracle_erpp_host
  oracle_pjda_host  = var.oracle_pjda_host
  oracle_jdage_host = var.oracle_jdage_host
}

# Módulo NCC — Databricks Network Connectivity Config
module "ncc" {
  source                 = "./modules/ncc"
  databricks_account_id  = var.databricks_account_id
  databricks_workspace_id = var.databricks_workspace_id
  ncc_name               = var.databricks_ncc_name
  pls_alias              = module.serverless_connectivity.private_link_service_alias
}`;

const HAPROXY_SNIPPET = `# haproxy_cfg.tpl — Template renderizado pelo Terraform
# templatefile() injeta as variáveis do environment
global
    maxconn 65536
    user haproxy
    group haproxy
    daemon

defaults
    mode tcp
    option tcplog
    timeout connect 10s
    timeout client  300s
    timeout server  300s

# Oracle POPM (port 1521)
frontend fe_popm
    bind *:1521
    default_backend be_popm

backend be_popm
    option tcp-check
    server popm-01 \${oracle_popm_host}:1521 check inter 5s

# Health Check para Azure ILB probe
listen health_check
    bind *:9000
    mode http
    monitor-uri /health`;

const TF_COMMANDS = [
  { cmd: 'terraform init', desc: 'Inicializa providers e backend. Sempre primeiro.' },
  { cmd: 'terraform init -backend-config=backend.tfvars', desc: 'Init com backend remoto (Azure Blob/S3/GCS)' },
  { cmd: 'terraform fmt -recursive', desc: 'Formatar todo o código HCL' },
  { cmd: 'terraform validate', desc: 'Validar sintaxe e tipos' },
  { cmd: 'terraform plan -out=tfplan', desc: 'Gerar plano (guardar para apply)' },
  { cmd: 'terraform apply tfplan', desc: 'Aplicar plano guardado (sem prompt)' },
  { cmd: 'terraform apply -var-file=profiles/work.tfvars', desc: 'Apply com variáveis de ficheiro' },
  { cmd: 'terraform state list', desc: 'Listar todos os recursos no state' },
  { cmd: 'terraform state show module.ncc.databricks_mws_network_connectivity_config.this', desc: 'Detalhes de recurso no state' },
  { cmd: 'terraform import azurerm_resource_group.rg /subscriptions/.../rg-name', desc: 'Importar recurso existente' },
  { cmd: 'terraform workspace new dev', desc: 'Criar workspace para ambiente DEV' },
  { cmd: 'TF_LOG=DEBUG terraform plan 2>&1 | head -50', desc: 'Debug detalhado' },
];

export default function TerraformSimulator() {
  const [view, setView] = useState<View>('concepts');
  const [snippet, setSnippet] = useState<'main' | 'haproxy'>('main');

  const views = [
    { id: 'concepts' as View, label: '🏗️ Conceitos' },
    { id: 'structure' as View, label: '📁 Estrutura' },
    { id: 'cpe' as View, label: '⚡ Projecto Cross-Cloud' },
    { id: 'commands' as View, label: '⌨️ Comandos' },
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

      {view === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'IaC — Infrastructure as Code', c: 'violet', items: ['Infra versionada em Git — auditável e reproducível', 'Terraform usa HCL (HashiCorp Configuration Language)', 'Estado (tfstate) mapeia HCL → recursos reais na cloud', 'Plan = diff antes de aplicar mudanças', 'Multi-cloud: Azure, AWS, GCP, Databricks, etc.'] },
            { t: 'State Management', c: 'sky', items: ['State local — só para testes locais, nunca em equipa', 'State remoto — Azure Blob, S3, GCS com locking', 'terraform.tfstate contém IPs, IDs, secrets — nunca commitar!', 'State locking previne conflitos em pipelines paralelas', 'Workspaces para separar state por ambiente (dev/stg/prod)'] },
            { t: 'Módulos', c: 'amber', items: ['Reutilização de código HCL (como funções)', 'Source: local path, Git repo, Terraform Registry', 'Inputs = variables, Outputs = valores exportados', 'Versionar módulos com Git tags (ref = "v1.2.0")', 'Estrutura: modules/{networking,compute,security}/{aws,azure,gcp}'] },
            { t: 'Boas Práticas', c: 'emerald', items: ['backend.tfvars separado — nunca hardcoded', 'profiles/work.tfvars em .gitignore', 'locals{} para lógica condicional por ambiente', 'templatefile() para configs dinâmicos (haproxy_cfg.tpl)', 'Outputs para passar valores entre módulos'] },
          ].map(g => (
            <div key={g.t} className={`p-5 rounded-2xl border ${g.c === 'violet' ? 'border-violet-500/20 bg-violet-500/5' : g.c === 'sky' ? 'border-sky-500/20 bg-sky-500/5' : g.c === 'amber' ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
              <div className={`text-[11px] font-black uppercase tracking-widest mb-3 ${g.c === 'violet' ? 'text-violet-400' : g.c === 'sky' ? 'text-sky-400' : g.c === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`}>{g.t}</div>
              {g.items.map(i => <div key={i} className="flex items-start gap-2 text-[12px] text-slate-400 py-0.5"><span className={`${g.c === 'violet' ? 'text-violet-500' : g.c === 'sky' ? 'text-sky-500' : g.c === 'amber' ? 'text-amber-500' : 'text-emerald-500'} shrink-0`}>·</span>{i}</div>)}
            </div>
          ))}
        </div>
      )}

      {view === 'structure' && (
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 font-mono text-[11px] space-y-0.5">
          {[
            ['cpe-multicloud-infra/', 'slate', 0],
            ['├── main.tf', 'violet', 1],
            ['├── variables.tf', 'violet', 1],
            ['├── outputs.tf', 'violet', 1],
            ['├── backend.tfvars          ← state remoto', 'sky', 1],
            ['├── local.auto.tfvars.example ← NÃO commitar versão real', 'amber', 1],
            ['├── modules/', 'slate', 1],
            ['│   ├── serverless-connectivity/', 'violet', 2],
            ['│   │   ├── main.tf', 'slate', 3],
            ['│   │   ├── haproxy_cfg.tpl  ← Template HAProxy', 'violet', 3],
            ['│   │   ├── variables.tf', 'slate', 3],
            ['│   │   └── outputs.tf', 'slate', 3],
            ['│   └── ncc/', 'violet', 2],
            ['│       ├── main.tf', 'slate', 3],
            ['│       └── variables.tf', 'slate', 3],
            ['├── profiles/', 'rose', 1],
            ['│   ├── work.tfvars.example  ← Template (commitar)', 'emerald', 2],
            ['│   └── work.tfvars          ← NUNCA commitar!', 'rose', 2],
            ['└── scripts/', 'slate', 1],
            ['    ├── approve-pls-connection.sh', 'amber', 2],
            ['    ├── validate-connectivity.sh', 'amber', 2],
            ['    └── import-dev-state.sh', 'amber', 2],
          ].map(([line, color, depth], i) => (
            <div key={i} style={{ paddingLeft: `${(depth as number) * 16}px` }}
              className={`py-0.5 ${color === 'violet' ? 'text-violet-300' : color === 'sky' ? 'text-sky-300' : color === 'amber' ? 'text-amber-300' : color === 'emerald' ? 'text-emerald-300' : color === 'rose' ? 'text-rose-300' : 'text-slate-400'}`}>
              {line}
            </div>
          ))}
        </div>
      )}

      {view === 'cpe' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {([['main', '📋 main.tf', 'violet'], ['haproxy', '⚙️ haproxy_cfg.tpl', 'amber']] as const).map(([id, label, color]) => (
              <button key={id} onClick={() => setSnippet(id)}
                className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${snippet === id ? color === 'violet' ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300' : 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'border border-slate-800 text-slate-500'}`}>
                {label}
              </button>
            ))}
          </div>
          <Code code={snippet === 'main' ? TERRAFORM_MAIN : HAPROXY_SNIPPET} lang={snippet === 'main' ? 'main.tf' : 'modules/serverless-connectivity/haproxy_cfg.tpl'} />
        </div>
      )}

      {view === 'commands' && (
        <div className="space-y-2">
          {TF_COMMANDS.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <code className="text-[11px] font-mono text-violet-300 flex-1">{c.cmd}</code>
              <span className="text-[11px] text-slate-500 shrink-0 text-right max-w-[250px]">{c.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
