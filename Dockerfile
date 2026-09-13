# --- deps: install once, reused by dev and builder ---
FROM node:22.18.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install

# --- dev: local hot-reload target used by docker-compose.yml ---
FROM node:22.18.0-alpine AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- builder: production build ---
FROM node:22.18.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- runner: slim production image (Next.js standalone output) ---
FROM node:22.18.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
