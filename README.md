# Frontend - Alquileres Hub (PortoViejo360)

## 📋 Descripción

Esta es la aplicación cliente principal del ecosistema PortoViejo360. Construida com **Next.js 16**, ofrece una experiencia de usuario rápida, reactiva y optimizada para SEO. Permite a los usuarios buscar propiedades, gestionar sus arriendos y contactar con soporte.

## 🛠️ Stack Tecnológico

- **Core**: React 19, Next.js 16 (App Router).
- **Estilos**: TailwindCSS v4.
- **Mapas**: Leaflet / React-Leaflet.
- **Estado Global**: Zustand.
- **Real-time**: Socket.io-client.
- **Iconos**: Lucide React / Heroicons.

## 📂 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/             # Rutas y páginas (App Router)
│   ├── components/      # Componentes UI reutilizables
│   ├── lib/             # Utilidades y configuración
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # Cliente API y funciones de fetch
│   └── store/           # Estados globales (Zustand)
├── public/              # Assets estáticos
└── ...config files
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js (v20 Recomendado)
- npm o yarn

### Pasos

1. **Instalar dependencias**:

   ```bash
   npm install
   # o
   yarn install
   ```

2. **Configurar variables de entorno**:
   Crea un archivo `.env.local` en la raíz.

   ```bash
   cp .env.example .env.local
   ```

   Define `NEXT_PUBLIC_API_URL` apuntando a tu API Gateway (usualmente `http://localhost:3000` o puerto similar).

3. **Ejecutar servidor de desarrollo**:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔑 Características Principales

- **Búsqueda en Mapa**: Integra Leaflet para ver propiedades geolocalizadas.
- **SSR & SEO**: Renderizado del lado del servidor para mejor indexación.
- **Dashboard de Usuario**: Vistas protegidas para inquilinos y propietarios.
- **Diseño Responsivo**: Adaptado a móviles y escritorio con Tailwind.

## 📦 Scripts Disponibles

- `npm run dev`: Modo desarrollo con Turbopack (si está habilitado) o Webpack.
- `npm run build`: Compila la aplicación para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run lint`: Ejecuta ESLint para verificar calidad de código.
