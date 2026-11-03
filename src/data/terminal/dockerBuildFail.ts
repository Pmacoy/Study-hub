import type { TerminalSession } from '../../types/terminal';

export const dockerBuildFailSession: TerminalSession = {
  id: 'docker-build-fail',
  domain: 'devops',
  title: 'Docker · Imagem com 3GB no pipeline',
  hook: 'O CI pipeline está a demorar demasiado na build do contentor. A imagem resultante tem mais de 3GB. Inspeciona o Dockerfile e descobre o problema.',
  shell: 'bash',
  prompt: 'user@dev-machine:~/project$ ',
  difficulty: 'mid',
  timeEstimateMin: 10,
  tags: ['docker', 'optimization'],

  briefing: `O teu projeto tem um Dockerfile que está a gerar uma imagem de grandes dimensões.
Precisas de usar: 'cat', 'docker images', e compreender multi-stage builds.
Dica: Escreve 'cat Dockerfile' para ver como a imagem está a ser construída.`,

  objectives: [
    { id: 'obj-cat', label: 'Inspecionar o Dockerfile problemático', hint: 'cat Dockerfile', goalTag: 'cat-dockerfile' },
    { id: 'obj-images', label: 'Listar imagens para confirmar o tamanho', hint: 'docker images', goalTag: 'docker-images' },
    { id: 'obj-fix', label: 'Propor alteração para usar multi-stage build', hint: 'echo "multi-stage" > solution.txt', goalTag: 'multi-stage-fix' },
  ],

  handlers: [
    {
      id: 'cat-dockerfile',
      tokens: [['cat']],
      goalTag: 'cat-dockerfile',
      output: (ctx) => {
        const path = ctx.positionalArgs[0] ?? '';
        if (path === 'Dockerfile') {
          return `FROM ubuntu:22.04
RUN apt-get update && apt-get install -y curl build-essential git python3
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Note: The developer used Ubuntu base and installed a bunch of tools that remain in the final image.`;
        }
        return `cat: ${path}: No such file or directory`;
      },
    },
    {
      id: 'docker-images',
      tokens: [['docker', 'images'], ['docker', 'image', 'ls']],
      goalTag: 'docker-images',
      teachingNote: 'Sempre verifica o tamanho final das imagens. Imagens Node devem usar base alpine ou distroless.',
      output: `REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
my-node-app         latest    a1b2c3d4e5f6   5 minutes ago    3.1GB
ubuntu              22.04     b3c4d5e6f7a8   2 weeks ago      77.8MB`,
    },
    {
      id: 'docker-build',
      tokens: [['docker', 'build']],
      output: `Building my-node-app...
[+] Building 354.2s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 301B
 => [1/6] FROM docker.io/library/ubuntu:22.04
 => ... installing hundreds of megabytes of dev tools ...
 => exporting to image
 => => exporting layers
 => => writing image sha256:a1b2c3d4e5f6
 
# The build works, but the resulting image is huge! 
# In a real environment, you'd edit the Dockerfile to use 'node:18-alpine' and a multi-stage build.`,
    },
    {
      id: 'multi-stage-fix',
      tokens: [['echo']],
      goalTag: 'multi-stage-fix',
      output: (ctx) => {
        if (ctx.raw.includes('multi-stage') || ctx.raw.includes('alpine')) {
          return `Parabéns! Entendeste a teoria do Multi-stage build e imagens Alpine. Num terminal real irias editar o Dockerfile com 'vim' ou 'nano'.`;
        }
        return ctx.positionalArgs.join(' ');
      }
    },
    {
      id: 'ls',
      tokens: [['ls']],
      output: `Dockerfile  package.json  src/  node_modules/`
    }
  ],

  stuckHints: [
    'Usa `cat Dockerfile` para ver o que está errado com o ficheiro original.',
    'Vê o tamanho enorme com `docker images`.',
    'Para resolver este laboratório, basta simular que escreveste a solução: `echo "multi-stage e alpine" > solution.txt`.'
  ],

  debrief: {
    lesson: 'O problema de usar "ubuntu:22.04" como base para Node.js é que a imagem final contém pacotes (build-essential, git, python) desnecessários em produção. A solução é usar imagens oficiais menores (ex: node:18-alpine) e o padrão Multi-Stage Build, onde compilas numa fase e copias os binários gerados para uma nova fase "magra".',
    keyCommands: [
      'cat Dockerfile                    # Inspecionar imagem',
      'docker images                     # Avaliar tamanho e caching',
      'docker history my-node-app        # Ver que layer ocupa mais espaço',
    ],
  },
};
