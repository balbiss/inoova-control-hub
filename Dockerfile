# Estágio de Build
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o resto do código
COPY . .

# Build do projeto
RUN npm run build

# Estágio de Produção
FROM node:20-slim AS runner

WORKDIR /app

# Copiar apenas o necessário do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Porta que o app vai rodar
EXPOSE 3000

# Comando para iniciar o servidor do TanStack Start
CMD ["node", "dist/server/index.js"]
