# 🔄 INSTRUCCIONES PARA REVERTIR A BACKEND REAL

## ⚠️ Este proyecto está usando datos MOCK temporales para pruebas

### Archivos con datos temporales:

1. **`/src/lib/mockData.ts`** - ELIMINAR este archivo completo
2. **`/src/app/page.tsx`** - Descomentar líneas marcadas con 🚨 TEMPORAL
3. **`/src/app/propiedades/[id]/detalles/page.tsx`** - Descomentar líneas marcadas con 🚨 TEMPORAL

---

## 📝 Pasos para conectar con el backend real:

### 1. Eliminar archivo mock
```powershell
Remove-Item "c:\Users\samue\Documents\GitHub\front-alquileres-hub-pucem\src\lib\mockData.ts"
```

### 2. Restaurar `/src/app/page.tsx`

**CAMBIAR DE:**
```typescript
// 🚨 TEMPORAL: Comentar estas líneas cuando el backend esté listo
// import { usePropiedades } from '@/hooks/usePropiedades';
// import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';
import { MOCK_PROPIEDADES } from '@/lib/mockData';
// 🚨 FIN TEMPORAL

export default function Home() {
  // 🚨 TEMPORAL: Usar datos mock en lugar del hook
  // const { propiedades } = usePropiedades();
  const propiedades = MOCK_PROPIEDADES;
  // 🚨 FIN TEMPORAL
  
  // 🚨 TEMPORAL: Comentar socket mientras se prueban datos estáticos
  // usePropiedadesSocket();
  // 🚨 FIN TEMPORAL
```

**CAMBIAR A:**
```typescript
import { usePropiedades } from '@/hooks/usePropiedades';
import { usePropiedadesSocket } from '@/hooks/usePropiedadesSocket';

export default function Home() {
  const { propiedades } = usePropiedades();
  usePropiedadesSocket();
```

### 3. Restaurar `/src/app/propiedades/[id]/detalles/page.tsx`

**CAMBIAR DE:**
```typescript
// 🚨 TEMPORAL: Comentar API y usar datos mock
// import { propiedadesApi } from '@/lib/api/propiedades.api';
import { MOCK_PROPIEDADES } from '@/lib/mockData';
// 🚨 FIN TEMPORAL

// Dentro del useEffect:
// 🚨 TEMPORAL: Buscar en datos mock en lugar de API
// const data = await propiedadesApi.obtenerPorId(params.id as string);
const data = MOCK_PROPIEDADES.find(p => p.id === params.id);
if (!data) {
  throw new Error('Propiedad no encontrada');
}
// 🚨 FIN TEMPORAL
```

**CAMBIAR A:**
```typescript
import { propiedadesApi } from '@/lib/api/propiedades.api';

// Dentro del useEffect:
const data = await propiedadesApi.obtenerPorId(params.id as string);
```

---

## ✅ Verificación final

Después de hacer los cambios, asegúrate de que:
- [ ] El archivo `mockData.ts` está eliminado
- [ ] No hay imports de `MOCK_PROPIEDADES` en ningún archivo
- [ ] Los hooks `usePropiedades()` y `usePropiedadesSocket()` están activos
- [ ] La API `propiedadesApi.obtenerPorId()` está siendo usada en la página de detalles
- [ ] El backend está corriendo en `localhost:3001`
- [ ] Las variables de entorno están configuradas correctamente

---

## 📍 Datos de prueba incluidos:

Para referencia, los datos mock incluyen 4 propiedades:

1. **Portoviejo, Ecuador** (Departamento Moderno) - $350/mes
   - Lat: -1.0546, Lng: -80.4545
   - 3 hab, 2 baños, amoblado

2. **Cali, Colombia** (Casa Colonial) - $1,200,000 COP/mes
   - Lat: 3.4516, Lng: -76.5320
   - 4 hab, 3 baños, sin amoblar

3. **Portoviejo, Ecuador** (Vista al Río) - $280/mes
   - Lat: -1.0481, Lng: -80.4589
   - 2 hab, 1 baño, amoblado

4. **Manta, Ecuador** (Loft Moderno) - $550/mes
   - Lat: -0.9679, Lng: -80.7096
   - 2 hab, 2 baños, amoblado

Esto permite probar:
- ✅ Filtrado por área del mapa (alejarse/acercarse)
- ✅ Propiedades en diferentes países
- ✅ Diferentes rangos de precio
- ✅ Popup en mapa con información
- ✅ Página de detalles completa
- ✅ Galería de imágenes múltiples

---

**¡Todo está marcado claramente para que sea fácil revertir cuando tengas el backend listo!** 🚀
