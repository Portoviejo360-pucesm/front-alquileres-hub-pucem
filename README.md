# Frontend — Alquileres Hub PUCEM

Interfaz web del sistema **Portoviejo360** de gestion de arriendos. Panel de busqueda de propiedades con mapa interactivo, filtros en tiempo real y actualizaciones via Socket.io.

[![Docker](https://img.shields.io/badge/Docker-sketox%2Fportoviejo360--frontend-blue?logo=docker)](https://hub.docker.com/r/sketox/portoviejo360-frontend)

---

## Stack

| Tecnologia | Version |
|-----------|---------|
| Next.js | ^16.1.1 (App Router) |
| React | 19.2.0 + React Compiler |
| TypeScript | ^5.x |
| Tailwind CSS | ^4.x |
| Zustand | ^5.x (estado global) |
| Leaflet + react-leaflet | ^1.9 / ^5.0 (mapas) |
| socket.io-client | ^4.8.1 (tiempo real) |

---

## Inicio Rapido — Desarrollo Local

### Requisitos
- Node.js >= 18
- Backend unificado corriendo en `http://localhost:8001`

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local   # o crear manualmente (ver abajo)

# 3. Arrancar en modo desarrollo
npm run dev
```

Abre `http://localhost:3000` en el navegador.

---

## Variables de Entorno

Crea `.env.local` en la raiz del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001
```

---

## Comandos

```bash
npm run dev      # Servidor de desarrollo (Turbopack, port 3000)
npm run build    # Build de produccion
npm run start    # Servidor de produccion
npm run lint     # ESLint
```

---

## Rutas Principales

| Ruta | Descripcion | Acceso |
|------|-------------|--------|
| `/mapa` | Panel de busqueda: propiedades + filtros + mapa Leaflet | Todos |
| `/login` | Inicio de sesion | Publico |
| `/register` | Registro de usuario | Publico |
| `/dashboard` | Panel del arrendador verificado | Auth |
| `/propiedades` | Mis propiedades (arrendador) | Auth + Verificado |
| `/propiedades/new` | Crear propiedad | Auth + Verificado |
| `/propiedades/:id/detalles` | Detalle publico de propiedad | Todos |
| `/propiedades/:id/reservar` | Reservar propiedad | Auth |
| `/alquileres` | Mis alquileres | Auth |
| `/incidencias` | Reporte de incidencias | Auth |
| `/admin/verificaciones` | Panel admin | Admin |

---

## Arquitectura del Modulo de Disponibilidad

```
/mapa (page)
  │
  ├── PropertyFilters    → sidebar filtros (texto, precio, amenidades)
  ├── PropertyCard[]     → grid de propiedades
  └── MapWrapper         → Leaflet (Portoviejo, markers con precio)
       │
       ├── usePropiedades()           GET /api/v1/propiedades
       └── usePropiedadesSocket()     WS: propiedad:estado-cambiado
```

**Flujo de datos:**
1. `usePropiedades` carga todas las propiedades al montar
2. `usePropiedadesSocket` escucha cambios de estado en tiempo real
3. Filtros son **client-side** (sobre los datos ya cargados)
4. El mapa filtra adicionalmente por bounds geograficos visibles

---

## Docker

### Correr el proyecto completo

```bash
# Desde la raiz del proyecto (portoviejo360/)
cp .env.docker.example .env
# Edita .env con tus credenciales
docker compose up --build
```

### Imagen en DockerHub

```bash
docker pull sketox/portoviejo360-frontend:latest
```

> **Importante:** La imagen del frontend tiene la URL del backend **baked en el build**. Al hacer `docker pull` se usa la URL configurada al momento de construir la imagen (`http://localhost:8001` por defecto).

Ver [`DOCKER_README.md`](../DOCKER_README.md) para instrucciones completas.

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── (public)/          # /login, /register
│   └── (protected)/       # Rutas autenticadas
│       ├── mapa/          # Panel principal de busqueda
│       ├── propiedades/   # CRUD propiedades
│       └── dashboard/
├── components/
│   ├── Map.js             # Leaflet (markers con precio)
│   ├── PropertyFilters.tsx # Sidebar Amazon-style
│   ├── propiedades/PropertyCard.tsx
│   └── ui/PriceSlider.tsx
├── hooks/
│   ├── usePropiedades.ts
│   └── usePropiedadesSocket.ts
├── lib/api/
│   ├── client.ts          # fetch wrapper con JWT
│   └── propiedades.api.ts
├── context/
│   └── PropiedadesContext.tsx
└── store/
    └── auth.store.ts      # Zustand
```
