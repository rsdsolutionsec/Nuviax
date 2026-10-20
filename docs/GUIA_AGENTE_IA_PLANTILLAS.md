# GUÍA DE ESPECIFICACIÓN TÉCNICA PARA AGENTES DE IA
## Creación de Plantillas Creadas con Código en Nuviax (RSD SOLUTIONS)

**Rol del Agente:** Pair programmer y desarrollador Fullstack AI  
**Repositorio Oficial:** `https://github.com/rsdsolutionsec/Nuviax`  
**Directiva Primaria:** Esta guía contiene todas las reglas técnicas, contratos de tipos, restricciones de base de datos y patrones de interfaz para que un agente de IA cree e integre nuevas plantillas en Nuviax sin provocar regresiones, errores de TypeScript ni violaciones de integridad referencial.

---

## 1. REGLAS MANDATORIAS DE ENTORNO Y CONTROL DE VERSIONES

Todo agente de IA que opere en este repositorio DEBE cumplir de manera estricta:

1. **PROHIBIDO EL PUSH:** **BAJO NINGUNA CIRCUNSTANCIA SE DEBE EJECUTAR `git push`**. El comando remoto es exclusivo del usuario.
2. **COMMIT OBLIGATORIO:** Al finalizar cualquier tarea de creación o modificación de plantillas, se debe ejecutar un `git add .` y un `git commit` descriptivo local.
3. **DOCUMENTOS VIVOS DE MANTENIMIENTO:** En cada nueva plantilla o refactorización, se deben mantener actualizados:
   - `auditoria.md` (Registro técnico, estado de build, dependencias y riesgos).
   - `analisis.md` (Catálogo de plantillas, arquitectura de componentes, tablas y contratos).
4. **COMPILACIÓN LIMPIA:** Antes de dar por finalizada la tarea, es obligatorio validar el proyecto con `npm run build` garantizando cero errores de tipos TypeScript.

---

## 2. ARQUITECTURA DE ARCHIVOS DE UNA PLANTILLA

Cada plantilla basada en código debe ubicarse y registrarse exactamente en la siguiente jerarquía:

```
src/
├── templates/
│   ├── types.ts                    # Contrato universal InvitationTemplateProps
│   ├── registry.ts                 # Registry y diccionario de normalización de códigos
│   ├── TemplateRenderer.tsx        # Despachador universal en vistas públicas/privadas
│   ├── UniversalBaseTemplate.tsx   # Plantilla base declarativa de respaldo
│   └── designs/
│       ├── boda-imperial-gold/
│       │   └── index.tsx           # Plantilla Flagship de Bodas
│       └── <nombre-plantilla>/
│           └── index.tsx           # Componente principal de la nueva plantilla (Client Component)
```

---

## 3. CONTRATO OBLIGATORIO DE PROPS (`InvitationTemplateProps`)

El componente de la plantilla DEBE exportarse con nombre y tiparse estrictamente con `InvitationTemplateProps` importado de `@/templates/types`:

```tsx
'use client'

import { useState } from 'react'
import { InvitationTemplateProps } from '@/templates/types'
import { CountdownTimer } from '@/components/invitation/CountdownTimer'
import { PublicRsvpModal } from '@/components/invitation/PublicRsvpModal'
import { BackgroundMusicPlayer } from '@/components/invitation/BackgroundMusicPlayer'

export function MiNuevaPlantillaTemplate({
  event,
  content,
  theme,
  plan,
  isDemo = false,
  isReadOnly = false,
  invitationToken,
  guest,
}: InvitationTemplateProps) {
  // ... lógica y JSX
}
```

### Reglas Críticas del Contrato:
1. **Respeto a los Límites del Plan Comercial (`plan`):**
   - **`plan.allow_music`:** Solo renderizar `BackgroundMusicPlayer` si es `true`.
   - **`plan.allow_countdown`:** Solo renderizar `CountdownTimer` si es `true`.
   - **`plan.allow_rsvp`:** Solo mostrar botones de confirmación y modales de RSVP si es `true`.
2. **Pases VIP / Personalizados (`guest`):**
   - Si `guest` no es nulo, renderizar el listón o credencial de bienvenida con su nombre (`guest.name`) y cupos autorizados (`guest.authorizedCompanions`).
3. **Fallbacks Defensivos Obligatorios:**
   - Todo campo editable de `content` puede venir vacío en borradores iniciales.
   - Usar siempre coalescencia nula: `content.title || event.title || 'Texto Predeterminado'`.
   - **NUNCA** asumir que arreglos como `content.itinerary` o `content.gallery` están poblados sin comprobar longitud o proveer datos de respaldo.

---

## 4. REGISTRO EN EL SISTEMA (`src/templates/registry.ts`)

Para que la plantilla sea reconocida por el enrutador dinámico (`/[slug]`, `/demo/[template]`, `/preview/[token]` y el editor `/dashboard/events/[id]/edit`), el agente DEBE actualizar [src/templates/registry.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/templates/registry.ts):

### Paso A: Importar el Componente
```typescript
import { MiNuevaPlantillaTemplate } from '@/templates/designs/mi-nueva-plantilla'
```

### Paso B: Registrar en `TEMPLATE_REGISTRY`
Asociar tanto el código canónico como los códigos alfanuméricos de catálogo:
```typescript
export const TEMPLATE_REGISTRY: Record<string, ComponentType<InvitationTemplateProps>> = {
  // ...
  'COD-001': MiNuevaPlantillaTemplate,
  'mi-nueva-plantilla': MiNuevaPlantillaTemplate,
}
```

### Paso C: Mapear en `TEMPLATE_CODE_MAP`
Añadir las variantes en minúsculas y alias para evitar desajustes:
```typescript
export const TEMPLATE_CODE_MAP: Record<string, string> = {
  // ...
  'cod-001': 'mi-nueva-plantilla',
  'mi-nueva-plantilla': 'mi-nueva-plantilla',
}
```

---

## 5. REGLAS DE ORO DE BASE DE DATOS Y SUPABASE (ANTI-BUGS)

1. **PROHIBIDO CONSULTAR `templates.slug`:**  
   La tabla `templates` en PostgreSQL tiene como clave textual `code`. **NO TIENE COLUMNA `slug`**.  
   *Incorrecto:* `.or('code.eq...,slug.eq...')` ❌ (provoca error `42703 column does not exist`).  
   *Correcto:* `.eq('code', targetCode)` ✅.

2. **PROHIBIDO USAR UUIDs FICTICIOS (00000000-0000...):**  
   Si una consulta de plantilla o plan no devuelve resultados, **NUNCA** usar `'00000000-0000-0000-0000-000000000001'`. Esto viola la restricción de clave foránea `events_template_id_fkey` o `events_plan_id_fkey`.  
   *Patrón Correcto:*
   ```typescript
   if (!template) {
     const { data: fallback } = await supabase
       .from('templates')
       .select('id, default_config')
       .eq('is_active', true)
       .order('display_order', { ascending: true })
       .limit(1)
       .maybeSingle()
     template = fallback
   }
   ```

---

## 6. ESTÁNDARES ESTÉTICOS Y COMPONENTES VISUALES RSD

1. **Atmósfera Visual:**  
   - Fondo oscuro profundo (`#070510`, `#080512`, `#0B081A`).
   - Esferas de luz ambiental desenfocadas (`blur-[160px] pointer-events-none opacity-20`).
   - Tarjetas con esquinas amplias (`rounded-2xl`, `rounded-3xl`) con bordes reactivos (`hover:border-pink-500/50 transition-all duration-300`).
2. **Componentes Nativos Integrados:**
   - **`CountdownTimer` (`@/components/invitation/CountdownTimer`):** Reloj de cuenta regresiva en tiempo real.
   - **`PublicRsvpModal` (`@/components/invitation/PublicRsvpModal`):** Modal de confirmación con confeti animado y selector de acompañantes.
   - **`BackgroundMusicPlayer` (`@/components/invitation/BackgroundMusicPlayer`):** Control flotante de audio con disco animado.
3. **Interacciones Micro-UX:**
   - Botón de copiado de datos bancarios con feedback visual de 2.5s (`navigator.clipboard.writeText`).
   - Botones de navegación satelital (Google Maps) con `target="_blank"` y `rel="noopener noreferrer"`.
   - Galería de fotos con efecto de zoom suave al pasar el cursor (`group-hover:scale-110 transition-transform duration-500`).

---

## 7. PROTOCOLO DE VALIDACIÓN FINAL DEL AGENTE

Antes de responder al usuario, el agente debe verificar metódicamente:
1. `npm run build` ejecutado y finalizado con código de salida 0.
2. Comprobar que no se haya expuesto `SUPABASE_SERVICE_ROLE_KEY` al frontend.
3. Actualizar `auditoria.md` y `analisis.md`.
4. Ejecutar `git add .` y `git commit -m "feat(template): add <template-name> coded design and registry entry"`.
5. **No ejecutar `git push`**.
