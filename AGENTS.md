<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# REGLAS Y CONVENCIONES PERMANENTES DE DESARROLLO — NUVIAX (RSD SOLUTIONS)

Estas directivas deben ser respetadas estrictamente por todo agente de IA y desarrollador en cada ejecución o iteración:

---

## 1. Regla de Control de Versiones (Git Commit Sí, Git Push NO)
- **Repositorio Remoto Oficial:** `https://github.com/rsdsolutionsec/Nuviax`
- **Commit Obligatorio:** Al finalizar cualquier fase, tarea o conjunto de modificaciones, se debe realizar un `git add .` y un `git commit` descriptivo para mantener el árbol de cambios limpio y versionado.
- **PROHIBIDO EL PUSH:** **BAJO NINGUNA CIRCUNSTANCIA SE DEBE EJECUTAR `git push`**. El comando de subida remota queda reservado de manera manual y exclusiva para el usuario / desarrollador principal.

---

## 2. Documentos Vivos Obligatorios de Mantenimiento (`auditoria.md` y `analisis.md`)
En **CADA** nueva implementación, refactorización o cambio de funcionalidades, se deben mantener sincronizados y actualizados los dos siguientes documentos en la raíz del proyecto:

1. **`auditoria.md`:**
   - Registro técnico del estado actual de la plataforma.
   - Seguridad (RLS, validación de permisos en servidor, protección de rutas y endpoints).
   - Estado de migraciones en Supabase PostgreSQL.
   - Estado de compilación de producción (`npm run build`).
   - Dependencias y variables de entorno documentadas.
   - Riesgos mitigados y pendientes.

2. **`analisis.md`:**
   - Desglose exhaustivo de todas las vistas, rutas públicas, rutas privadas del cliente y panel administrativo.
   - Detalle de cada formulario, modal, botón, opción interactiva y su comportamiento.
   - Catálogo de funciones de backend, rutas API y llamadas RPC en base de datos.
   - Modelo de roles (`admin`, `customer`, `support`) y permisos por plan (Esencial, Interactiva, Evento Pro).
   - Arquitectura del motor declarativo de plantillas y flujo de confirmaciones RSVP.

---

## 3. Seguridad de Credenciales y Secretos
- **Archivos `.env*`:** `.env.local` y cualquier archivo con tokens reales nunca deben ser agregados al control de versiones. Solo `.env.example` está permitido en el repositorio.
- **Service Role:** `SUPABASE_SERVICE_ROLE_KEY` jamás debe exponerse al frontend o en Client Components de React.
- **Tokens de Invitación:** Los enlaces de invitados utilizan tokens aleatorios de 32 caracteres hexadecimales no correlativos ni predecibles.
