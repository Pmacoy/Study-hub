import type { TerminalSession } from '../../types/terminal';

export const azCliRbacSession: TerminalSession = {
  id: 'az-cli-rbac',
  domain: 'azure',
  title: 'az CLI · quem tem acesso ao Key Vault?',
  hook: 'O auditor perguntou "quem consegue ler os segredos do Key Vault kv-prod-secrets?" Descobre-o.',
  shell: 'az',
  prompt: 'user@cloudshell:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 7,
  tags: ['azure', 'rbac', 'identity', 'key-vault'],

  briefing: `Tenant: acme.onmicrosoft.com · Subscrição: sub-prod
Resource: /subscriptions/sub-prod/resourceGroups/rg-shared/providers/Microsoft.KeyVault/vaults/kv-prod-secrets

Vais precisar de: az login (feito), az account, az keyvault, az role assignment.
Escreve 'hint' para uma pista ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-sub', label: 'Confirmar em que subscrição estás', hint: 'az account show', goalTag: 'account-show' },
    { id: 'obj-vault', label: 'Ver a configuração do Key Vault', hint: 'az keyvault show --name <nome>', goalTag: 'kv-show' },
    { id: 'obj-rbac', label: 'Listar as role assignments no Key Vault', hint: 'az role assignment list --scope <resource-id>', goalTag: 'role-list' },
    { id: 'obj-user', label: 'Ver o utilizador/grupo por trás de um objectId', hint: 'az ad user show ou az ad group show', goalTag: 'ad-show' },
  ],

  handlers: [
    {
      id: 'account-show',
      tokens: [['az'], ['account'], ['show']],
      flags: [{ names: ['--output', '-o'], valueRequired: true, valueEnum: ['json', 'table', 'yaml', 'tsv'] }],
      goalTag: 'account-show',
      teachingNote: 'Regra: verificar sempre `az account show` antes de operações destrutivas — para não estar no tenant errado.',
      output: (ctx) => {
        const fmt = ctx.flagValues['-o'] ?? ctx.flagValues['--output'] ?? 'json';
        if (fmt === 'table') {
          return `Name              CloudName    SubscriptionId                        TenantId
sub-prod          AzureCloud   d4c8...9271                            9a1b...8f70`;
        }
        return `{
  "environmentName": "AzureCloud",
  "id": "d4c8a7f6-1234-5678-9abc-def012349271",
  "isDefault": true,
  "name": "sub-prod",
  "state": "Enabled",
  "tenantId": "9a1b2c3d-4e5f-6789-abcd-ef1234568f70",
  "user": {
    "name": "you@acme.onmicrosoft.com",
    "type": "user"
  }
}`;
      },
    },
    {
      id: 'kv-show',
      tokens: [['az'], ['keyvault'], ['show']],
      flags: [
        { names: ['--name', '-n'], valueRequired: true },
        { names: ['--resource-group', '-g'], valueRequired: true },
      ],
      goalTag: 'kv-show',
      teachingNote: 'Repara em `enableRbacAuthorization: true` — este KV usa RBAC (não access policies). Muda como investigas acesso.',
      output: (ctx) => {
        const name = ctx.flagValues['--name'] ?? ctx.flagValues['-n'];
        if (name === 'kv-prod-secrets') {
          return `{
  "id": "/subscriptions/d4c8.../resourceGroups/rg-shared/providers/Microsoft.KeyVault/vaults/kv-prod-secrets",
  "location": "westeurope",
  "name": "kv-prod-secrets",
  "properties": {
    "enableRbacAuthorization": true,
    "enableSoftDelete": true,
    "softDeleteRetentionInDays": 90,
    "networkAcls": { "defaultAction": "Deny" },
    "publicNetworkAccess": "Disabled"
  }
}

# enableRbacAuthorization: true → usa role assignments, não access policies.
# publicNetworkAccess: Disabled → só via Private Endpoint.`;
        }
        return `The Vault '${name}' not found in resource group.`;
      },
    },
    {
      id: 'role-list',
      tokens: [['az'], ['role'], ['assignment'], ['list']],
      flags: [
        { names: ['--scope'], valueRequired: true },
        { names: ['--output', '-o'], valueRequired: true, valueEnum: ['json', 'table', 'yaml', 'tsv'] },
        { names: ['--include-inherited'] },
      ],
      goalTag: 'role-list',
      teachingNote: '"Inherited" = herdado do RG ou subscrição. Papéis herdados aparecem só com --include-inherited. Muitas vezes é aí que está a resposta.',
      output: (ctx) => {
        const scope = ctx.flagValues['--scope'];
        const fmt = ctx.flagValues['-o'] ?? ctx.flagValues['--output'] ?? 'json';
        if (typeof scope === 'string' && scope.includes('kv-prod-secrets')) {
          if (fmt === 'table') {
            return `Principal                                RoleDefinitionName          Scope
────────────────────────────────────────  ──────────────────────────  ──────────────────────
you@acme.onmicrosoft.com             Key Vault Administrator     kv-prod-secrets
group-platform-team                       Key Vault Secrets Officer   kv-prod-secrets
sp-checkout-api-prod                      Key Vault Secrets User      kv-prod-secrets
group-security-audit                      Key Vault Reader            kv-prod-secrets (inherited)`;
          }
          return `[
  {
    "principalName": "you@acme.onmicrosoft.com",
    "principalType": "User",
    "roleDefinitionName": "Key Vault Administrator",
    "scope": ".../vaults/kv-prod-secrets"
  },
  {
    "principalId": "b1c2d3e4-...",
    "principalName": "group-platform-team",
    "principalType": "Group",
    "roleDefinitionName": "Key Vault Secrets Officer",
    "scope": ".../vaults/kv-prod-secrets"
  },
  {
    "principalId": "sp-a1b2c3d4-...",
    "principalName": "sp-checkout-api-prod",
    "principalType": "ServicePrincipal",
    "roleDefinitionName": "Key Vault Secrets User",
    "scope": ".../vaults/kv-prod-secrets"
  }
]`;
        }
        return `# scope inválido ou vazio. Exemplo: --scope "/subscriptions/.../vaults/kv-prod-secrets"`;
      },
    },
    {
      id: 'ad-user-show',
      tokens: [['az'], ['ad'], ['user'], ['show']],
      flags: [{ names: ['--id'], valueRequired: true }],
      goalTag: 'ad-show',
      output: (ctx) => {
        const id = ctx.flagValues['--id'];
        return `{
  "displayName": "Alex Kim",
  "givenName": "Alex",
  "surname": "Kim",
  "mail": "${id}",
  "userType": "Member"
}`;
      },
    },
    {
      id: 'ad-group-show',
      tokens: [['az'], ['ad'], ['group'], ['show']],
      flags: [{ names: ['--group'], valueRequired: true }],
      goalTag: 'ad-show',
      output: (ctx) => {
        const g = ctx.flagValues['--group'] ?? '';
        if (typeof g === 'string' && g.includes('platform')) {
          return `{
  "displayName": "group-platform-team",
  "description": "Platform Engineering team — Acme Corp",
  "id": "b1c2d3e4-....",
  "securityEnabled": true,
  "members@count": 8
}`;
        }
        return `{ "displayName": "${g}", "description": null }`;
      },
    },
    {
      id: 'ad-group-members',
      tokens: [['az'], ['ad'], ['group'], ['member'], ['list']],
      flags: [{ names: ['--group'], valueRequired: true }, { names: ['-o', '--output'], valueRequired: true }],
      teachingNote: 'Segurança 101: se um utilizador tem acesso via GRUPO, "quem tem acesso" precisa desta chamada — não confies só na role assignment.',
      output: (ctx) => {
        return `Alex Kim
Priya Patel
Marcus Chen
Nadia Rahman
Julien Dubois
Emma Schmidt
Yuki Tanaka
Diego Torres
# 8 members in group-platform-team`;
      },
    },
    {
      id: 'keyvault-secret-list',
      tokens: [['az'], ['keyvault'], ['secret'], ['list']],
      flags: [{ names: ['--vault-name'], valueRequired: true }],
      output: (ctx) => {
        const v = ctx.flagValues['--vault-name'];
        if (v === 'kv-prod-secrets') {
          return `[
  { "id": ".../secrets/oracle-db-password", "attributes": { "enabled": true } },
  { "id": ".../secrets/stripe-api-key",     "attributes": { "enabled": true } },
  { "id": ".../secrets/databricks-pat",     "attributes": { "enabled": true } }
]`;
        }
        return `Vault ${v} not found or you do not have access.`;
      },
    },
    {
      id: 'role-definition-list',
      tokens: [['az'], ['role'], ['definition'], ['list']],
      flags: [
        { names: ['--name'], valueRequired: true },
        { names: ['-o', '--output'], valueRequired: true },
      ],
      output: (ctx) => {
        const n = ctx.flagValues['--name'];
        if (typeof n === 'string' && n.toLowerCase().includes('key vault')) {
          return `Name                       Actions
──────────────────────  ──────────────────────────────────
Key Vault Administrator    Microsoft.KeyVault/*
Key Vault Secrets Officer  Microsoft.KeyVault/vaults/secrets/*
Key Vault Secrets User     Microsoft.KeyVault/vaults/secrets/getSecret/action
Key Vault Reader           Microsoft.KeyVault/vaults/*/read`;
        }
        return `# usa --name "Key Vault Secrets Officer" por exemplo`;
      },
    },
    {
      id: 'az-version',
      tokens: [['az'], ['version']],
      output: `{
  "azure-cli": "2.63.0",
  "azure-cli-core": "2.63.0",
  "extensions": {}
}`,
    },
    {
      id: 'az-login',
      tokens: [['az'], ['login']],
      output: `# Já estás autenticado como you@acme.onmicrosoft.com`,
    },
  ],

  stuckHints: [
    'Confirma primeiro em que sub estás: az account show',
    'Vê o KV: az keyvault show --name kv-prod-secrets --resource-group rg-shared',
    'Este KV usa RBAC. Lista role assignments: az role assignment list --scope <resource-id>',
    'Um dos principals é um grupo. Para saber quem lá está: az ad group member list --group <nome>',
  ],

  debrief: {
    lesson: 'Investigar acesso a um recurso Azure com RBAC: `az role assignment list --scope <id>` — mas os principals podem ser Users, Groups ou Service Principals. Se for grupo, tens de expandir com `az ad group member list`. Não te esqueças de --include-inherited para papéis herdados do RG ou sub.',
    keyCommands: [
      'az account show                                  # sub actual',
      'az keyvault show -n <name> -g <rg>               # config do KV',
      'az role assignment list --scope <id>             # quem tem que role',
      'az role assignment list --scope <id> --include-inherited  # com heranças',
      'az ad group member list --group <name>           # membros do grupo',
      'az role definition list --name "Key Vault Reader" # o que a role permite',
    ],
  },
};
