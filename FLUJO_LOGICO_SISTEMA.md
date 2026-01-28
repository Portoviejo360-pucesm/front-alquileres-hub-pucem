# 🏗️ Estructura Lógica del Sistema - Portoviejo360

## 📊 Análisis del Sistema Actual

### Tipos de Usuario

#### 1. **Usuario Público** (Sin Autenticación)
- ✅ Puede ver propiedades disponibles
- ✅ Puede buscar y filtrar propiedades
- ✅ Puede ver detalles de propiedades
- ❌ NO puede hacer reservas
- ❌ NO puede acceder al dashboard

#### 2. **Usuario Común** (Autenticado - rolId: 2)
- ✅ Puede convertirse en arrendador
- ✅ Puede hacer reservas de propiedades
- ✅ Acceso a dashboard personal
- ✅ Ver sus reservas activas
- ⚠️ Convertirse en Arrendador requiere verificación:
  - Solicitar verificación de perfil
  - Subir documentación (cédula/RUC)
  - Esperar aprobación del admin

#### 3. **Arrendador** (Usuario Verificado - rolId: 2 + perfilVerificado.estaVerificado: true)
- ✅ Todas las funcionalidades de Usuario Común
- ✅ Crear propiedades
- ✅ Editar sus propiedades
- ✅ Ver estadísticas de sus propiedades
- ✅ Gestionar reservas de sus propiedades
- ✅ Dashboard de arrendador

#### 4. **Administrador** (rolId: 1)
- ✅ Acceso completo al sistema
- ✅ Ver todos los arrendadores registrados
- ✅ Aprobar/rechazar solicitudes de verificación
- ✅ Gestionar todas las propiedades
- ✅ Ver estadísticas globales
- ✅ Gestionar usuarios

---

## 🔄 Flujos de Usuario

### Flujo 1: Usuario Público → Registro → Usuario Común

```
1. Usuario accede a la página principal (/)
   └─ Ve listado de propiedades
   └─ Puede filtrar y buscar
   └─ Puede ver detalles

2. Usuario hace clic en "Regístrate"
   └─ Redirige a /register
   └─ Completa formulario:
      - Nombres completos
      - Correo
      - Contraseña
      - rolId: 2 (por defecto, Usuario Común)

3. Registro exitoso
   └─ Redirige a /login
   └─ Usuario inicia sesión
   └─ Redirige a /dashboard
```

### Flujo 2: Usuario Común → Convertirse en Arrendador

```
1. Usuario autenticado accede a /perfil
   └─ Ve opción "Convertirme en Arrendador"
   └─ Si no está verificado, muestra formulario

2. Usuario completa solicitud de verificación:
   - Cédula/RUC
   - Teléfono de contacto
   - Biografía corta
   - Subir foto de documento

3. Sistema crea solicitud pendiente
   └─ perfilVerificado.estaVerificado: false
   └─ Muestra mensaje: "Solicitud en revisión"

4. Administrador revisa y aprueba
   └─ perfilVerificado.estaVerificado: true
   └─ Usuario recibe notificación

5. Usuario ya es Arrendador
   └─ Puede acceder a /mis-propiedades
   └─ Puede crear propiedades nuevas
```

### Flujo 3: Arrendador → Crear Propiedad

```
1. Arrendador accede a /mis-propiedades
   └─ Ve botón "Publicar Propiedad"
   └─ Clic en botón

2. Redirige a /propiedades/new
   └─ Formulario completo:
      - Título del anuncio
      - Descripción
      - Tipo de propiedad
      - Precio mensual
      - Ubicación (mapa)
      - Amenidades
      - Fotos
      - Servicios incluidos

3. Usuario envía formulario
   └─ Validación de datos
   └─ Crea propiedad con estado: "Disponible"
   └─ Redirige a /mis-propiedades

4. Propiedad visible en:
   └─ /mis-propiedades (vista de arrendador)
   └─ / (página pública para todos)
```

### Flujo 4: Usuario Común → Reservar Propiedad

```
1. Usuario autenticado ve propiedad en /
   └─ Clic en propiedad
   └─ Redirige a /propiedades/[id]/detalles

2. Usuario ve detalles completos
   └─ Fotos
   └─ Descripción
   └─ Amenidades
   └─ Ubicación en mapa
   └─ Precio

3. Usuario hace clic en "Reservar"
   └─ Redirige a /propiedades/[id]/reservar
   └─ Formulario de reserva:
      - Fecha de inicio
      - Fecha de fin
      - Notas adicionales

4. Usuario confirma reserva
   └─ Sistema crea reserva en BD
   └─ Notifica al arrendador
   └─ Redirige a /dashboard
   └─ Reserva visible en "Mis Reservas"
```

### Flujo 5: Administrador → Gestionar Arrendadores

```
1. Admin accede a /arrendadores
   └─ Ve lista completa de:
      - Arrendadores verificados
      - Solicitudes pendientes

2. Admin ve solicitud pendiente
   └─ Clic en solicitud
   └─ Redirige a /arrendadores/[id]
   └─ Ve documentación subida

3. Admin aprueba o rechaza
   └─ Si aprueba:
      - perfilVerificado.estaVerificado: true
      - Usuario recibe notificación
   └─ Si rechaza:
      - Se elimina solicitud
      - Usuario puede volver a solicitar

4. Admin ve estadísticas
   └─ Total de arrendadores
   └─ Total de propiedades
   └─ Total de reservas
```

---

## 🗂️ Estructura de Rutas Mejorada

### Rutas Públicas (/(public)/)

```
/(public)/
├── login/                    # Página de inicio de sesión
│   └── page.tsx
├── register/                 # Página de registro
│   └── page.tsx
└── layout.tsx               # Layout sin autenticación
```

### Rutas Protegidas (/(protected)/)

```
/(protected)/
├── dashboard/               # Dashboard según rol
│   └── page.tsx            # Muestra dashboard diferente por rol
│
├── perfil/                 # Perfil de usuario
│   └── page.tsx           # Ver/editar perfil + solicitar verificación
│
├── propiedades/           # Ver propiedades (todos)
│   ├── page.tsx          # Lista de todas las propiedades
│   ├── [id]/
│   │   ├── page.tsx     # Detalles de propiedad
│   │   ├── reservar/    # Reservar propiedad
│   │   │   └── page.tsx
│   │   └── edit/        # Editar propiedad (solo arrendador dueño)
│   │       └── page.tsx
│   └── new/             # Crear propiedad (solo arrendadores verificados)
│       └── page.tsx
│
├── mis-propiedades/       # Propiedades del arrendador (solo verificados)
│   └── page.tsx
│
├── alquileres/           # Mis reservas (usuarios comunes)
│   ├── page.tsx
│   └── [reservaId]/
│       └── contrato/
│           └── page.tsx
│
├── arrendadores/         # Gestión de arrendadores (SOLO ADMIN)
│   ├── page.tsx         # Lista de arrendadores
│   ├── [id]/
│   │   ├── page.tsx    # Detalles de arrendador
│   │   └── edit/       # Editar arrendador
│   │       └── page.tsx
│   └── new/            # Crear arrendador manualmente
│       └── page.tsx
│
└── layout.tsx           # Layout con autenticación + sidebar
```

### Página Principal (/)

```
/                          # Página pública de búsqueda
└── page.tsx              # Lista de propiedades con filtros
                          # Accesible para todos (público y autenticado)
```

---

## 🎨 Componentes por Rol

### Dashboard Dinámico

**Archivo:** `src/app/(protected)/dashboard/page.tsx`

```tsx
'use client';

import { useAuthStore } from '@/store/auth.store';
import DashboardAdmin from '@/components/dashboard/DashboardAdmin';
import DashboardArrendador from '@/components/dashboard/DashboardArrendador';
import DashboardUsuario from '@/components/dashboard/DashboardUsuario';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return <div>Cargando...</div>;

  // Admin (rolId: 1)
  if (user.rolId === 1) {
    return <DashboardAdmin />;
  }

  // Arrendador verificado (rolId: 2 + verificado)
  if (user.rolId === 2 && user.perfilVerificado?.estaVerificado) {
    return <DashboardArrendador />;
  }

  // Usuario común (rolId: 2, sin verificar)
  return <DashboardUsuario />;
}
```

### Sidebar Dinámico por Rol

**Archivo:** `src/components/layout/Sidebar.tsx` (mejorado)

```tsx
'use client';

import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  if (!user) return null;

  const isAdmin = user.rolId === 1;
  const isArrendadorVerificado = user.rolId === 2 && user.perfilVerificado?.estaVerificado;
  const isUsuarioComun = user.rolId === 2 && !user.perfilVerificado?.estaVerificado;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Portoviejo360</h2>
      </div>

      <nav className="sidebar-nav">
        {/* Todos los usuarios autenticados */}
        <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
          🏠 Dashboard
        </Link>

        <Link href="/propiedades" className={pathname === '/propiedades' ? 'active' : ''}>
          🔍 Buscar Propiedades
        </Link>

        <Link href="/perfil" className={pathname === '/perfil' ? 'active' : ''}>
          👤 Mi Perfil
        </Link>

        {/* Solo usuarios comunes (para ver sus reservas) */}
        {(isUsuarioComun || isArrendadorVerificado) && (
          <Link href="/alquileres" className={pathname === '/alquileres' ? 'active' : ''}>
            📋 Mis Reservas
          </Link>
        )}

        {/* Solo arrendadores verificados */}
        {isArrendadorVerificado && (
          <>
            <Link href="/mis-propiedades" className={pathname === '/mis-propiedades' ? 'active' : ''}>
              🏘️ Mis Propiedades
            </Link>
            <Link href="/propiedades/new" className={pathname === '/propiedades/new' ? 'active' : ''}>
              ➕ Publicar Propiedad
            </Link>
          </>
        )}

        {/* Solo administrador */}
        {isAdmin && (
          <>
            <Link href="/arrendadores" className={pathname === '/arrendadores' ? 'active' : ''}>
              👥 Arrendadores
            </Link>
            <Link href="/documentacion" className={pathname === '/documentacion' ? 'active' : ''}>
              📚 Documentación
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
```

---

## 📦 Datos Mock Estructurados

### Mock de Usuarios

**Archivo:** `src/lib/mockData/usuarios.mock.ts`

```typescript
import type { PerfilResponse } from '@/types/auth';

export const MOCK_USUARIOS: PerfilResponse[] = [
  // Usuario Administrador
  {
    id: '1',
    nombresCompletos: 'Admin Principal',
    correo: 'admin@portoviejo360.com',
    rolId: 1,
    fechaRegistro: '2024-01-01T00:00:00.000Z',
    rol: {
      nombre: 'Administrador'
    }
  },
  
  // Usuario Común (sin verificar)
  {
    id: '2',
    nombresCompletos: 'Juan Pérez',
    correo: 'juan@example.com',
    rolId: 2,
    fechaRegistro: '2024-06-15T00:00:00.000Z',
    rol: {
      nombre: 'Usuario'
    }
  },
  
  // Arrendador Verificado
  {
    id: '3',
    nombresCompletos: 'María González',
    correo: 'maria@example.com',
    rolId: 2,
    fechaRegistro: '2024-03-10T00:00:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '1234567890',
      telefonoContacto: '+593987654321',
      biografiaCorta: 'Arrendadora con 5 años de experiencia',
      estaVerificado: true,
      fechaSolicitud: '2024-03-12T00:00:00.000Z'
    },
    propiedades: [
      {
        id: '1',
        tituloAnuncio: 'Departamento en el centro',
        precioMensual: 350,
        estado: { nombre: 'Disponible' }
      }
    ]
  },
  
  // Arrendador con solicitud pendiente
  {
    id: '4',
    nombresCompletos: 'Carlos Rodríguez',
    correo: 'carlos@example.com',
    rolId: 2,
    fechaRegistro: '2024-07-20T00:00:00.000Z',
    rol: {
      nombre: 'Usuario'
    },
    perfilVerificado: {
      cedulaRuc: '0987654321',
      telefonoContacto: '+593912345678',
      biografiaCorta: 'Propietario de viviendas familiares',
      estaVerificado: false,
      fechaSolicitud: '2024-07-22T00:00:00.000Z'
    }
  }
];
```

### Mock de Reservas

**Archivo:** `src/lib/mockData/reservas.mock.ts`

```typescript
export interface Reserva {
  id: string;
  propiedadId: string;
  usuarioId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';
  precioTotal: number;
  notas?: string;
  createdAt: string;
}

export const MOCK_RESERVAS: Reserva[] = [
  {
    id: '1',
    propiedadId: '1',
    usuarioId: '2', // Juan Pérez
    fechaInicio: '2026-02-01',
    fechaFin: '2026-08-01',
    estado: 'Confirmada',
    precioTotal: 2100, // 350 x 6 meses
    notas: 'Necesito parqueadero',
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    propiedadId: '2',
    usuarioId: '2',
    fechaInicio: '2026-03-01',
    fechaFin: '2026-09-01',
    estado: 'Pendiente',
    precioTotal: 2400,
    createdAt: '2026-01-20T14:30:00.000Z'
  }
];
```

---

## 🔐 Guards y Middleware

### Guard de Rol en Layout Protegido

**Archivo:** `src/app/(protected)/layout.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import AppShell from '@/components/layout/AppShell';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading, loadUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
```

### Guard Específico para Arrendadores

**Archivo:** `src/components/guards/ArrendadorGuard.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface ArrendadorGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ArrendadorGuard({ children, fallback }: ArrendadorGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const isArrendadorVerificado = user?.rolId === 2 && user?.perfilVerificado?.estaVerificado;

  useEffect(() => {
    if (!loading && !isArrendadorVerificado) {
      router.push('/perfil'); // Redirige a perfil para que solicite verificación
    }
  }, [loading, isArrendadorVerificado, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isArrendadorVerificado) {
    return fallback || (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
        <p className="text-gray-600 mb-4">
          Necesitas ser un arrendador verificado para acceder a esta página.
        </p>
        <button 
          onClick={() => router.push('/perfil')}
          className="btn-primary"
        >
          Solicitar Verificación
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

### Guard para Admin

**Archivo:** `src/components/guards/AdminGuard.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const isAdmin = user?.rolId === 1;

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
```

---

## 🎯 Implementación de Páginas con Guards

### Mis Propiedades (Solo Arrendadores)

**Archivo:** `src/app/(protected)/mis-propiedades/page.tsx`

```tsx
import ArrendadorGuard from '@/components/guards/ArrendadorGuard';
import MisPropiedadesContent from '@/components/propiedades/MisPropiedadesContent';

export default function MisPropiedadesPage() {
  return (
    <ArrendadorGuard>
      <MisPropiedadesContent />
    </ArrendadorGuard>
  );
}
```

### Arrendadores (Solo Admin)

**Archivo:** `src/app/(protected)/arrendadores/page.tsx`

```tsx
import AdminGuard from '@/components/guards/AdminGuard';
import ArrendadoresContent from '@/components/arrendadores/ArrendadoresContent';

export default function ArrendadoresPage() {
  return (
    <AdminGuard>
      <ArrendadoresContent />
    </AdminGuard>
  );
}
```

---

## 📝 Próximos Pasos de Implementación

### Fase 1: Autenticación y Roles ✅
- [x] Sistema de login/registro
- [x] Tipos de usuario definidos
- [x] Store de autenticación

### Fase 2: Datos Mock y Testing 🔄
- [ ] Crear mocks de usuarios
- [ ] Crear mocks de reservas
- [ ] Implementar guards de roles
- [ ] Probar flujos completos con datos mock

### Fase 3: Vistas por Rol 📋
- [ ] Dashboard de Admin
- [ ] Dashboard de Arrendador
- [ ] Dashboard de Usuario Común
- [ ] Sidebar dinámico por rol

### Fase 4: Funcionalidades de Arrendador 🏘️
- [ ] Solicitar verificación de perfil
- [ ] Crear propiedades
- [ ] Editar propiedades
- [ ] Ver estadísticas

### Fase 5: Funcionalidades de Usuario Común 🔍
- [ ] Reservar propiedades
- [ ] Ver mis reservas
- [ ] Calificar propiedades

### Fase 6: Panel de Administrador 👨‍💼
- [ ] Gestionar arrendadores
- [ ] Aprobar/rechazar solicitudes
- [ ] Estadísticas globales
- [ ] Gestionar usuarios

### Fase 7: Integración con Backend Real 🌐
- [ ] Conectar con API real
- [ ] Remover datos mock
- [ ] Testing end-to-end

---

## 🚀 ¿Por dónde empezar?

1. **Crear Guards de Roles** → Archivos en `src/components/guards/`
2. **Actualizar Sidebar** → Mostrar opciones según rol
3. **Crear Dashboards** → Uno por tipo de usuario
4. **Implementar datos mock** → Para probar flujos sin backend
5. **Probar flujos completos** → Desde registro hasta funcionalidades específicas

---

**¿Necesitas ayuda con alguna de estas implementaciones?** 🚀
