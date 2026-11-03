# Citrix VDI como código — percurso de estudo e labs

Percurso prático para operar e automatizar um ambiente **Citrix DaaS / Virtual Apps and Desktops** numa Platform Team: entrega de desktops com MCS, ambiente do utilizador com WEM, perfis com Citrix Profile Management e FSLogix, gold images com Packer e o site Citrix gerido com Terraform.

O foco não é clicar na consola. É responder às perguntas que aparecem em produção:

- como atualizo a imagem de 300 desktops sem partir nada, e como volto atrás?
- porque é que o logon passou a demorar mais 30 segundos?
- porque é que este utilizador recebeu um perfil temporário?
- como ponho o catálogo, as políticas e a imagem sob controlo de versões?

## Módulos

| # | Módulo | O que fica a saber fazer | Lab |
|---|---|---|---|
| 01 | [Citrix DaaS e MCS](01-daas-mcs/) | Arquitetura DaaS, machine catalogs, delivery groups, update de imagem e rollback | Inventário e update de imagem com o Remote PowerShell SDK |
| 02 | [Citrix WEM](02-wem/) | Actions, assignments, filtros, system optimization, agent e cache | Health check do agent e diagnóstico de logon |
| 03 | [Citrix Profile Management](03-profile-management/) | File-based vs container, sessões concorrentes, logs | Configurar o UPM por política e diagnosticar |
| 04 | [FSLogix](04-fslogix/) | Profile vs ODFC container, locks, perfis temporários, coexistência com UPM | Configurar o FSLogix por registo e ler os logs |
| 05 | [Gold image com Packer](05-packer-gold-image/) | Imagem VDA reproduzível em AWS | Template Packer com instalação silenciosa do VDA |
| 06 | [Terraform provider citrix](06-terraform-citrix/) | Zona, hypervisor AWS, catálogo MCS, delivery group, políticas UPM, WEM | Site Citrix descrito em Terraform |
| 07 | [Pipeline GitLab CI](07-pipeline-gitlab/) | Imagem e infraestrutura com validate → plan → apply | `.gitlab-ci.yml` com aprovação manual |
| — | [Cenários de entrevista](cenarios-entrevista.md) | Troubleshooting explicado como um sénior | Perguntas e respostas |

Ordem recomendada: 01 → 05 → 06 → 07 dá a espinha dorsal (imagem → catálogo → pipeline). Os módulos 02, 03 e 04 podem ser feitos em paralelo, porque só precisam de uma VM Windows e de um AD.

## Ambiente de lab

```
AWS (uma VPC, uma região)
├─ subnet privada A
│   ├─ DC01           Windows Server 2022 · AD DS + DNS (lab.local)
│   ├─ FS01           Windows Server 2022 · shares \\FS01\UPM$ e \\FS01\FSLogix$
│   └─ VDA de teste   Windows Server 2022 · VDA, WEM agent, UPM, FSLogix
├─ subnet privada B
│   └─ CC01 / CC02    Citrix Cloud Connectors (só se tiveres tenant Citrix Cloud)
└─ subnet pública
    └─ NAT gateway ou bastion (acesso de administração)
```

**O que precisa de quê:**

| Módulo | Precisa de tenant Citrix Cloud? | Precisa de downloads Citrix (conta myCitrix)? |
|---|---|---|
| 01 Citrix DaaS e MCS | Sim | Sim (Remote PowerShell SDK, VDA) |
| 02 WEM | Sim para o WEM service; on-prem só com licença | Sim (agent) |
| 03 Profile Management | Não | Sim (o instalador vem com o VDA / ISO CVAD) |
| 04 FSLogix | Não | Não (download gratuito da Microsoft) |
| 05 Packer | Não para construir a imagem | Sim para o instalador do VDA |
| 06 Terraform | Não para `init`/`validate`; sim para `plan`/`apply` | Não |
| 07 GitLab CI | Não para validate | Não |

Sem tenant Citrix, ainda consegues fazer 03, 04, 05 (até ao AMI) e 06–07 em modo `validate`. É isso que distingue "li sobre" de "construí".

## Custos e limpeza

- Instâncias Windows pagam licença à hora. Desliga tudo no fim de cada sessão de lab.
- Instâncias paradas não pagam compute, mas os volumes EBS e os snapshots dos AMIs continuam a pagar.
- No fim de cada módulo há uma secção **Limpeza**. Cumpre-a.
- Cria um AWS Budget com alerta antes de começar.

## Registo de progresso

- [ ] 01 — Inventário do site e update de imagem MCS
- [ ] 02 — Health check do WEM agent e cenário de logon lento
- [ ] 03 — UPM com container em perfil completo e leitura do log
- [ ] 04 — FSLogix com ODFC e cenário de VHDX bloqueado
- [ ] 05 — AMI VDA construído com Packer
- [ ] 06 — `terraform validate` do site Citrix (e `plan` se houver tenant)
- [ ] 07 — Pipeline GitLab a correr validate/plan

## Referências principais

- Citrix DaaS: https://docs.citrix.com/en-us/citrix-daas
- Workspace Environment Management service: https://docs.citrix.com/en-us/workspace-environment-management/service
- Profile Management: https://docs.citrix.com/en-us/profile-management/current-release
- FSLogix: https://learn.microsoft.com/fslogix/
- Terraform provider citrix: https://github.com/citrix/terraform-provider-citrix
- Packer + Citrix (Tech Zone): https://community.citrix.com/tech-zone/build/deployment-guides/master-images-with-packer/
