# ============================================================
# Dockerfile - Frontend Next.js Alquileres Hub
# Contexto de build: directorio front-alquileres-hub-pucem/
# ============================================================

FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

# ============================================================
# STAGE: deps - Instalar dependencias
# ============================================================
FROM base AS deps

COPY package*.json ./
RUN npm ci

# ============================================================
# STAGE: builder - Compilar Next.js
# ============================================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para el build de Next.js
# NEXT_PUBLIC_* se incrustan en el bundle del cliente
# Cambia estas URLs segun tu entorno (usa el host publico en produccion)
ARG NEXT_PUBLIC_API_URL=http://localhost:8001
ARG NEXT_PUBLIC_API_PREFIX=/api/v1
ARG NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_PREFIX=$NEXT_PUBLIC_API_PREFIX
ENV NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL

# Deshabilitar telemetria de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# STAGE: runner - Imagen de produccion minima
# ============================================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos necesarios para produccion
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
