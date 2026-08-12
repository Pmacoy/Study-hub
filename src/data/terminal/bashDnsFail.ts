import type { TerminalSession } from '../../types/terminal';

export const bashDnsFailSession: TerminalSession = {
  id: 'bash-dns-fail',
  domain: 'devops',
  title: 'bash · resolução DNS a falhar',
  hook: 'Uma aplicação começou a falhar chamadas a uma API externa com "could not resolve host". Fazes ping a um IP directo e funciona — mas resolver nomes não. O DNS está partido neste host. Encontra a causa.',
  shell: 'bash',
  prompt: 'user@worker-05:~$ ',
  difficulty: 'mid',
  timeEstimateMin: 6,
  tags: ['linux', 'bash', 'dns', 'networking', 'troubleshooting'],

  briefing: `Servidor: worker-05 (Ubuntu 22.04) · Alerta: "could not resolve host".
Ping a IPs directos funciona; resolver nomes não. Logo o problema é DNS, não conectividade.
Ferramentas: dig, nslookup, cat /etc/resolv.conf, systemd-resolve.
Escreve 'hint' para uma dica ou 'help' para comandos comuns.`,

  objectives: [
    { id: 'obj-dig', label: 'Testar a resolução de um nome', hint: 'dig api.external.com  (ou nslookup)', goalTag: 'dig-test' },
    { id: 'obj-resolv', label: 'Ver que servidores DNS o host usa', hint: 'cat /etc/resolv.conf', goalTag: 'resolv-conf' },
    { id: 'obj-verify', label: 'Testar directamente contra um DNS conhecido', hint: 'dig @8.8.8.8 api.external.com', goalTag: 'dig-direct' },
  ],

  handlers: [
    {
      id: 'dig-test',
      tokens: [['dig'], ['nslookup'], ['host']],
      flags: [{ names: ['+short'] }, { names: ['@'], valueRequired: true }],
      goalTag: 'dig-test',
      teachingNote: 'dig mostra o status da query. "SERVFAIL" ou "connection timed out" apontam para o resolver configurado; "NXDOMAIN" seria o nome não existir.',
      output: (ctx) => {
        const raw = ctx.raw;
        // dig @8.8.8.8 → handled by dig-direct
        if (raw.includes('@8.8.8.8') || raw.includes('@1.1.1.1')) {
          return `; <<>> DiG 9.18 <<>> @8.8.8.8 api.external.com
;; ANSWER SECTION:
api.external.com.   300   IN   A   203.0.113.42

;; Query time: 24 msec
;; SERVER: 8.8.8.8#53

# ✓ Contra o 8.8.8.8 resolve perfeitamente. Logo o nome existe e a rede funciona.
# O problema está no DNS configurado no host (/etc/resolv.conf).`;
        }
        return `; <<>> DiG 9.18 <<>> api.external.com
;; global options: +cmd
;; connection timed out; no servers could be reached

# ⚠️ "no servers could be reached" — o resolver configurado não responde.
# Não é o nome que falha; é o servidor DNS do host que está inacessível.`;
      },
    },
    {
      id: 'resolv-conf',
      tokens: [['cat']],
      flags: [],
      goalTag: 'resolv-conf',
      teachingNote: '/etc/resolv.conf lista os nameservers que o host usa. Se apontar para um DNS morto ou errado, toda a resolução falha mesmo com rede OK.',
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        if (path === '/etc/resolv.conf') {
          return `# This file is managed by systemd-resolved.
nameserver 10.0.0.53
search internal.acme

# ⚠️ O único nameserver é 10.0.0.53 (DNS interno).
# Se esse servidor está down ou inacessível deste host, nada resolve.`;
        }
        if (path === '/etc/hosts') {
          return `127.0.0.1   localhost
127.0.1.1   worker-05`;
        }
        return `cat: ${path}: No such file or directory`;
      },
    },
    {
      id: 'dig-direct',
      tokens: [['dig'], ['nslookup']],
      flags: [{ names: ['@'], valueRequired: true }, { names: ['+short'] }],
      goalTag: 'dig-direct',
      teachingNote: 'dig @8.8.8.8 força a query contra um DNS público específico, contornando o resolver do host. Se funciona, prova que o problema é o DNS configurado, não a rede nem o nome.',
      output: () => `; <<>> DiG 9.18 <<>> @8.8.8.8 api.external.com
;; ANSWER SECTION:
api.external.com.   300   IN   A   203.0.113.42

;; Query time: 24 msec
;; SERVER: 8.8.8.8#53

# ✓ Resolve contra 8.8.8.8. Confirma: o nameserver interno (10.0.0.53) é o problema.`,
    },
    {
      id: 'ping-ip',
      tokens: [['ping']],
      flags: [{ names: ['-c'], valueRequired: true }],
      teachingNote: 'Ping a um IP directo testa conectividade sem DNS. Se funciona mas resolver nomes não, isola o problema ao DNS.',
      output: (ctx) => {
        const target = ctx.positionalArgs[0] ?? '';
        if (target === '10.0.0.53') {
          return `PING 10.0.0.53: 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
--- 10.0.0.53 ping statistics ---
2 packets transmitted, 0 received, 100% packet loss

# ⚠️ O próprio servidor DNS (10.0.0.53) não responde. Aí está a causa.`;
        }
        if (/^\d+\.\d+\.\d+\.\d+$/.test(target)) {
          return `PING ${target}: 56 data bytes
64 bytes from ${target}: icmp_seq=0 ttl=54 time=22.1 ms
64 bytes from ${target}: icmp_seq=1 ttl=54 time=21.8 ms
--- ${target} ping statistics ---
2 packets transmitted, 2 received, 0% packet loss

# Conectividade a IPs directos funciona — o problema é só resolução de nomes.`;
        }
        return `ping: ${target}: Name or service not known`;
      },
    },
    {
      id: 'resolvectl',
      tokens: [['resolvectl'], ['systemd-resolve']],
      flags: [{ names: ['status'] }],
      output: () => `Global
       Protocols: -LLMNR -mDNS
Link 2 (eth0)
  Current DNS Server: 10.0.0.53
         DNS Servers: 10.0.0.53
          DNS Domain: internal.acme

# O systemd-resolved está a usar 10.0.0.53 — o servidor que não responde.`,
    },
  ],

  stuckHints: [
    'Confirma que é DNS e não rede: `ping 8.8.8.8` (IP directo) funciona? Se sim, a conectividade está OK.',
    'Testa a resolução: `dig api.external.com`. "connection timed out / no servers could be reached" aponta para o resolver configurado.',
    'Vê que DNS o host usa: `cat /etc/resolv.conf`. Repara nos nameservers listados.',
    'Prova que o nome existe contornando o resolver: `dig @8.8.8.8 api.external.com`. Se resolve, o problema é o DNS do host.',
    'Confirma que o nameserver interno está down: `ping <ip-do-nameserver>`. A correcção: repor o DNS interno, ou apontar temporariamente para um DNS alternativo.',
  ],

  debrief: {
    lesson: 'DNS partido isola-se em três passos. Primeiro, ping a um IP directo funciona mas resolver nomes não → é DNS, não rede. Segundo, `dig <nome>` devolve "no servers could be reached" → o resolver configurado está morto. Terceiro, `dig @8.8.8.8 <nome>` resolve na perfeição → prova que o nome existe e a rede funciona, isolando a falha ao nameserver do host (visto em /etc/resolv.conf). Aqui o DNS interno 10.0.0.53 estava inacessível. A correcção: repor o servidor DNS interno ou, como mitigação temporária, apontar o resolver para um DNS alternativo. Distinguir "timeout" de "NXDOMAIN" é fundamental — o primeiro é o servidor, o segundo é o nome.',
    keyCommands: [
      'dig <nome>  (status: SERVFAIL/timeout vs NXDOMAIN)',
      'cat /etc/resolv.conf  (que nameservers o host usa)',
      'dig @8.8.8.8 <nome>  (contornar o resolver do host)',
      'ping <ip-do-nameserver>  (o DNS está sequer up?)',
      'resolvectl status  (config do systemd-resolved)',
    ],
  },
};
