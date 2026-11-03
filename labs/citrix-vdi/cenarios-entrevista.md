# Cenários de entrevista — Citrix Platform Engineer

Cada cenário tem a pergunta, como pensar, e o que uma resposta sénior inclui. Treina em voz alta antes de abrir a resposta.

---

## 1. Logon 30 segundos mais lento para todos depois de uma mudança

**Pergunta:** "Na segunda-feira, todos os utilizadores do pool multi-session têm logons 30 s mais lentos. Na sexta houve mudanças no WEM. Como investigas?"

<details>
<summary>Resposta sénior</summary>

- **Delimitar:** todos os utilizadores e todas as VDAs? Começou exatamente depois da mudança? Os 30 s são um número suspeito: é o *wait timeout* default de uma external task do WEM.
- **Evidência:** logon duration no Monitor/Director por fase; Windows Logon Analysis na VDA; lista de external tasks alteradas na sexta.
- **Hipótese mais provável:** external task a apontar para uma share inacessível (security group, DNS, máquina fora do domínio).
- **Mitigação imediata:** desativar a external task (ou restringir o assignment).
- **Correção:** o script vai para a imagem (Packer) ou passa a correr com process trigger, não no logon.
- **Prevenção:** mudanças de WEM testadas num configuration set de teste; changelog das mudanças.
</details>

---

## 2. Perfil temporário às 9h

**Pergunta:** "Um utilizador entra e o desktop aparece vazio, como se fosse a primeira vez. Usam FSLogix."

<details>
<summary>Resposta sénior</summary>

- **Hipótese 1:** o VHDX está em uso noutra sessão (sessão órfã noutra VDA). Logs do FSLogix (`%ProgramData%\FSLogix\Logs`) com "file is locked"; procurar a sessão no Monitor e terminá-la.
- **Hipótese 2:** permissões ou disponibilidade da share.
- **Hipótese 3:** perfil local antigo na VDA a impedir o container de montar.
- **Hipótese 4:** duas soluções de perfis ativas (GPO do Citrix UPM esquecida).
- **Decisão de política:** com `PreventLoginWithFailure` / `PreventLoginWithTempProfile`, o utilizador não entra em vez de entrar com perfil vazio. Troca perda silenciosa de dados por uma chamada para o helpdesk; a escolha é do negócio.
</details>

---

## 3. Update de imagem correu mal

**Pergunta:** "Publicaram uma imagem nova às 10h e os utilizadores reportam que uma aplicação crítica não abre. O que fazes?"

<details>
<summary>Resposta sénior</summary>

- **Parar a propagação:** as máquinas só usam a imagem nova depois do reboot. Suspender os reboots agendados.
- **Rollback:** publicar de novo a imagem anterior no provisioning scheme. Só é possível se não se usou `-DoNotStoreOldImage` e se a imagem anterior está identificada (tags no AMI, versão).
- **Máquinas já reiniciadas:** reiniciar de novo depois do rollback; maintenance mode para drenar.
- **Causa:** diff entre as duas versões da imagem; é por isso que a imagem é código (Packer) e tem smoke tests.
- **Prevenção:** catálogo de teste e rollout por fases; nunca publicar diretamente em produção em horário de trabalho.
</details>

---

## 4. VDAs "Unregistered" em massa

**Pergunta:** "Metade das VDAs aparece como Unregistered. Por onde começas?"

<details>
<summary>Resposta sénior</summary>

- **Padrão:** são todas da mesma subnet, AZ, catálogo ou imagem?
- **Cloud Connectors:** estão saudáveis e com saída para o Citrix Cloud? Um proxy ou firewall alterado parte também o WEM.
- **VDA:** DNS, hora (Kerberos), conta de computador no AD, event log do Citrix Desktop Service.
- **Comando para listar:** `Get-BrokerMachine -RegistrationState Unregistered -InMaintenanceMode $false -MaxRecordCount 5000`.
- **Comunicação:** dar estado aos stakeholders com o âmbito do impacto e o próximo update.
</details>

---

## 5. WEM: mudanças só aparecem depois de reboot

**Pergunta:** "O synchronization state do agent está OK, o `AgentCacheUtility -RefreshCache` não dá erro, mas as mudanças só chegam depois de reiniciar a VDA."

<details>
<summary>Resposta sénior</summary>

- Primeiro suspeito: a opção **Use Cache Even if Online** ativa no configuration set.
- Depois: sync bloqueado por proxy; cache corrompida após mudança de schema.
- Rebuild da cache: parar o agent e o Netlogon, apagar os `.db` em `Local Databases`, arrancar e fazer `-RefreshCache`.
</details>

---

## 6. Trazer um site existente para Terraform

**Pergunta:** "O site foi feito à mão há dois anos. Querem passá-lo para Terraform sem downtime."

<details>
<summary>Resposta sénior</summary>

- **Inventário primeiro** (Remote PowerShell SDK): catálogos, delivery groups, hypervisors, políticas.
- **Escrever o código** que descreve o que existe, e `terraform import` por GUID, recurso a recurso.
- **Objetivo: `plan` vazio.** Se o `plan` quer mudar ou recriar algo, o código ainda não descreve a realidade.
- **State remoto com lock**, credenciais em variáveis protegidas.
- **Só depois** as mudanças passam a ser feitas por MR.
</details>

---

## 7. UPM ou FSLogix?

**Pergunta:** "Para um ambiente Citrix novo em AWS, escolhes Citrix Profile Management ou FSLogix?"

<details>
<summary>Resposta sénior</summary>

- Não há resposta universal; o importante é **um só dono do perfil**.
- **Citrix UPM com container:** integrado com o Citrix, multi-session write-back nativo, gerível por Citrix policies (e Terraform), incluído na licença.
- **FSLogix:** forte com o Microsoft 365 (ODFC) e o padrão em AVD.
- **Padrão comum:** UPM para o perfil + FSLogix só ODFC.
- **Storage em AWS:** FSx for Windows File Server para as shares.
- **Na entrevista:** dizer o que perguntarias antes de decidir (apps, Office, multi-session, equipa).
</details>

---

## 8. "Fala-me de um lab que tenhas feito"

Usa este percurso. Estrutura em STAR curto:

- **Situação:** queria automatizar o ciclo de vida de uma imagem VDA e de um catálogo MCS em AWS.
- **Tarefa:** imagem reproduzível + catálogo como código + pipeline.
- **Ação:** Packer com instalação idempotente do VDA e smoke test; Terraform com o provider citrix; GitLab CI com plan revisto e apply manual.
- **Resultado:** o que aprendeste, o que partiu (sê honesto) e o que farias diferente em produção.
