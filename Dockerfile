# ==========================================
# Stage 1: Build the React Application
# ==========================================
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do contentor
WORKDIR /app

# Copia os ficheiros de dependências primeiro (aproveitar a cache do Docker)
COPY package.json package-lock.json ./

# Instala as dependências de forma exata e limpa
RUN npm ci

# Copia o resto do código da aplicação
COPY . .

# Constrói a aplicação para produção (gera a pasta dist/)
RUN npm run build

# ==========================================
# Stage 2: Serve the App using NGINX
# ==========================================
FROM nginx:alpine

# Remove a página predefinida do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia a configuração costumizada do NGINX para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os ficheiros de build do Stage 1 para a pasta do NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe o porto 80
EXPOSE 80

# Inicia o NGINX
CMD ["nginx", "-g", "daemon off;"]
