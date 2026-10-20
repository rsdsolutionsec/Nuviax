# ANÁLISIS INTEGRAL DEL SISTEMA Y ARQUITECTURA FUNCIONAL — NUVIAX

**Plataforma SaaS de Invitaciones Digitales Personalizadas**  
**Desarrollado para:** RSD SOLUTIONS  
**Fecha de Actualización:** 19 de Octubre de 2026  
**Versión:** v1.2.0 (Producción / Verificado)  

---

## 1. Visión del Producto y Principios de Diseño

Nuviax es una plataforma SaaS moderna diseñada para permitir que cualquier persona cree, personalice, publique y administre invitaciones digitales interactivas para celebraciones personales (bodas, quinceañeras, cumpleaños, baby showers, aniversarios, bautizos, graduaciones y eventos corporativos) sin requerir conocimientos técnicos ni contratar diseñadores externos.

### Propuesta de Valor Central
> *"Elige un diseño, personaliza tu invitación, compártela con un enlace privado de demostración y actívala cuando contrates el plan que necesitas."*

### Identidad Visual RSD SOLUTIONS
El diseño de la plataforma equilibra la sofisticación tecnológica con la calidez emocional de las celebraciones:
- **Colores de Superficie:** Fondos oscuros profundos (`#070510`, `#090714`, `#0B081A`, `#0C091C`) con acentos de cristal y desenfoque (`backdrop-blur-xl`).
- **Gradientes y Resplandores:** Tonos violeta neón (`#7C3AED`), magenta brillante (`#EC4899`) y dorado champán (`#D4AF37`).
- **Tipografía y Legibilidad:** Jerarquía tipográfica blanca nítida (`#F8FAFC`) con etiquetas en mayúsculas de espaciado amplio y fuentes acordes a cada plantilla (Cinzel, Playfair Display, Montserrat, Outfit).
- **Tarjetas y Botones:** Esquinas redondeadas amplias (`rounded-2xl`, `rounded-3xl`), bordes sutiles con resplandor púrpura (`rsd-glow-card`) y botones con gradientes reactivos al cursor (`rsd-glow-button`).

---

## 2. Modelo de Usuarios y Roles de Seguridad (RBAC)

El sistema implementa autorización en servidor a través de PostgreSQL Row Level Security (RLS) y comprobación de permisos en componentes de servidor Next.js.

### 2.1. Roles Disponibles
1. **`customer` (Anfitrión / Cliente):**
   - Rol predeterminado para todo usuario registrado.
   - Capacidad: Crear eventos, editar borradores, generar y compartir enlaces de demo privada (`/preview/[token]`), comprar planes, gestionar la lista de invitados de sus propios eventos, descargar reportes CSV y consultar estadísticas de sus invitaciones.
   - Restricción: No puede consultar ni modificar eventos, órdenes ni invitados pertenecientes a otros usuarios.
2. **`advisor` (Asesor Comercial):**
   - Acceso exclusivo de **solo lectura** a la lista de clientes registrados y al estado general de sus eventos.
   - Capacidad: Acompañar comercialmente al cliente, verificar qué plantilla eligió, comprobar el estado del pago y la vigencia contratada.
   - Restricciones estrictas: **NO puede editar invitaciones**, no puede modificar precios ni planes, no puede alterar transacciones, no puede gestionar roles y **NO tiene acceso a la tabla de invitados ni a datos médicos/alergias**.
3. **`admin` (Operador / Administrador RSD SOLUTIONS):**
   - Asignado explícitamente en la tabla `user_roles`.
   - Capacidad: Control total de la plataforma en `/admin`, métricas ejecutivas en tiempo real, gestión del directorio de usuarios, equipo de asesores, ciclo de vida de las 18 plantillas, eventos y vigencias, órdenes de compra, finanzas operativas, excepciones auditadas y logs del sistema.
   - Seguridad: La comprobación de rol se ejecuta en el servidor mediante la función `public.is_admin()`; nunca se confía en parámetros enviados por el navegador.
4. **`support` (Soporte Técnico):**
   - Rol reservado para atención al cliente y resolución de incidencias con permisos de solo lectura operativa.

---

## 3. Matriz de Planes Comerciales y Entitlements

El acceso a las funcionalidades está regulado por el módulo centralizado de permisos [src/lib/entitlements/index.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/lib/entitlements/index.ts) y respaldado por la tabla `plans` en PostgreSQL con snapshots históricos en la tabla `orders`.

| Característica / Capacidad | Plan Esencial ($19.99) | Plan Interactiva ($29.99) | Plan Evento Pro ($49.99) |
| :--- | :---: | :---: | :---: |
| **Vigencia de Publicación** | 30 días post-evento | 90 días post-evento | 180 días post-evento |
| **Enlace único personalizado (`/[slug]`)** | Sí | Sí | Sí |
| **Ubicaciones y Enlaces Google Maps** | Sí (Principal) | Sí (Ceremonia + Fiesta) | Sí (Ceremonia + Fiesta) |
| **Portada Optimizada para WhatsApp (OG)** | Sí | Sí | Sí |
| **Demostración Privada Gratuita (`/preview/[token]`)** | Sí | Sí | Sí |
| **Cuenta Regresiva en Tiempo Real** | No | Sí | Sí |
| **Música de Fondo Ambiental (Con Pausa)** | No | Sí | Sí |
| **Galería Fotográfica** | Portada única | Hasta 8 fotos | Hasta 24 fotos |
| **Confirmación de Asistencia (RSVP)** | No | Formulario básico | RSVP Avanzado + Acompañantes |
| **Panel de Invitados y Métricas** | No | Conteo básico | Panel VIP (Filtros, Notas, Pases) |
| **Control de Acompañantes Autorizados**| No | No | Sí (Pases nominales) |
| **Restricciones y Alergias Dietarias** | No | No | Sí (Protección reforzada) |
| **Exportación de Lista a CSV/Excel** | No | No | Sí |
| **Remoción de Marca de Agua** | No | No | Sí (Sin mención discreta) |

---

## 4. Flujo de Demostración Privada, Compra y Activación

El ciclo de vida comercial garantiza que el cliente experimente el valor antes de desembolsar dinero:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. Explorar     │ ────> │ 2. Probar Demo  │ ────> │ 3. Crear Cuenta │
│    Catálogo     │       │    Funcional    │       │    y Borrador   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 6. Contratar    │ <──── │ 5. Compartir    │ <──── │ 4. Personalizar │
│    Plan Único   │       │    Demo Privada │       │    en Editor    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 7. Orden con    │ ────> │ 8. Verificación │ ────> │ 9. Publicación  │
│    Snapshot     │       │    de Pago      │       │    Oficial      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Arquitectura de la Demo Privada (`/preview/[token]`)
- **Token no deducible:** Generado mediante `md5(random()::text || clock_timestamp()::text)`.
- **Ruta dedicada:** `src/app/preview/[token]/page.tsx` independiente del slug público.
- **Acceso seguro:** Vista de solo lectura. No permite editar, ni ver paneles administrativos, ni leer la lista de invitados.
- **RSVP Simulado / Bloqueado:** Muestra un modal informativo aclarando que es una demostración y no altera la base de datos real.
- **Protección SEO:** Encabezado y etiqueta `noindex, nofollow` para evitar que Google rastree el borrador.
- **Revocación y Regeneración:** El anfitrión puede revocar el token o generar uno nuevo en cualquier momento desde la pestaña "Demo Privada" del editor.

---

## 5. Biblioteca de 18 Plantillas y Distribución Técnica

La plataforma cuenta con 18 plantillas activas estructuradas bajo un contrato técnico común ([src/lib/templates/contract.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/lib/templates/contract.ts)), distribuidas entre 3 frentes de desarrollo:

### Frente A — Programador A (Bodas, Aniversarios y Parejas)
1. **`BOD-001` (Boda Imperial Gold):** Gala tradicional, detalles dorados, tipografía romana clásica.
2. **`BOD-002` (Boda Jardín Botánico):** Estilo campestre chic, acuarela de eucalipto, caligrafía orgánica.
3. **`BOD-003` (Boda Minimalista Noir):** Blanco y negro editorial, arquitectura gráfica depurada.
4. **`BOD-004` (Boda Bohemia Terracota):** Tonos terracota cálidos, pampas secas y romance al atardecer.
5. **`PAR-001` (Aniversario Bodas de Plata & Oro):** Festejo de décadas de unión con acentos de plata noble.
6. **`PAR-002` (Compromiso & Velada Romántica):** Cena íntima, luz de velas y propuesta de matrimonio.

### Frente B — Programador B (Cumpleaños Adultos/Infantiles y Quinceañeras)
7. **`CUM-001` (Cumpleaños Midnight Glam):** Cóctel nocturno VIP, bengalas, open bar y DJ.
8. **`CUM-002` (Neon Party Retro Wave):** Cyberpunk juvenil, luces cian y magenta neón.
9. **`CUM-003` (Tropical Sunset Celebration):** Pool party, atardecer playero y estética caribeña.
10. **`QUI-001` (Quinceañera Princesa Rosé):** Cuento de hadas, oro rosa, vals solemne y dedicatorias familiares.
11. **`QUI-002` (Quinceañera Midnight Star):** Noche estrellada en azul zafiro, constelaciones y tiara brillante.
12. **`KIS-001` (Aventura Galáctica Kids):** Cohetes, planetas ilustrados y juegos para niños.

### Frente C — Programador C (Baby Showers, Bautizos y Graduaciones)
13. **`BAB-001` (Baby Shower Dulce Nube):** Nubes acuarela, estrellas sonrientes y tonos pastel suaves.
14. **`BAB-002` (Baby Shower Safari Acuarela):** Pequeños animales de la selva en tonos salvia y arena.
15. **`BAU-001` (Bautizo Ángeles & Olivo):** Ramas de olivo doradas, espiritualidad y bendición de padrinos.
16. **`BAU-002` (Bautizo Celeste Luz):** Blanco marfil, celeste sereno y tipografía angelical.
17. **`GRA-001` (Graduación Magna Cum Laude):** Birrete académico, diploma dorado y azul marino formal.
18. **`GRA-002` (Graduación Vanguardia Moderna):** Estética tecnológica para egresados universitarios.

### 5.1. Creador y Editor Visual de Plantillas (`/admin/templates/new` y `/admin/templates/[id]/edit`)
La plataforma incorpora una herramienta para que los administradores y desarrolladores (incluyendo a Robin) creen y editen plantillas directamente desde la consola operativa sin requerir cambios de código:
- **Identificación:** Código único (ej. `ROB-001`, `BOD-005`), nombre comercial, categoría asociada, desarrollador asignado y dirección artística.
- **Tipografía Dinámica:** Selección de fuentes para títulos (`Cinzel`, `Playfair Display`, `Cormorant Garamond`, `Montserrat`, `Syne`, `Outfit`, `Plus Jakarta Sans`) y cuerpo, con previsualización en vivo.
- **Paleta de Colores Exclusiva:** Color primario, secundario, fondo base y acento de resplandor mediante color pickers interactivos.
- **Estructura y Capacidades:** Habilitación modular de secciones (hero, cuenta regresiva, ceremonia, recepción, itinerario, vestimenta, regalos, galería, música, RSVP).
- **Ciclo de Vida:** Control de estado (`draft`, `in_review`, `approved`, `published`, `archived`) y versionado semántico incremental.
- **Endpoint Backend:** `POST /api/admin/templates` y `PUT /api/admin/templates` con validación Zod ([src/lib/templates/contract.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/lib/templates/contract.ts)), protección de rol `admin` y registro en `audit_logs`.

---

## 6. Consola Administrativa Modular (`/admin`)

La consola de administración está dividida en 9 submódulos independientes bajo el layout unificado `src/app/(admin)/admin/layout.tsx`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CONSOLA OPERATIVA RSD SOLUTIONS                       │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ 1. Dashboard Ejecutivo│ /admin                                              │
│ 2. Clientes & Usuarios│ /admin/users                                        │
│ 3. Equipo & Asesores  │ /admin/team                                         │
│ 4. Gestión Plantillas │ /admin/templates                                    │
│ 5. Eventos & Vigencias│ /admin/events                                       │
│ 6. Órdenes & Pagos    │ /admin/orders                                       │
│ 7. Finanzas & Métricas│ /admin/finances                                     │
│ 8. Planes & Excepción │ /admin/plans                                        │
│ 9. Auditoría Sistema  │ /admin/audit                                        │
└───────────────────────┴─────────────────────────────────────────────────────┘
```

### 6.1. Detalle de Módulos Administrativos
- **Dashboard Ejecutivo (`/admin`):** Ventas brutas acumuladas, ingresos netos operativos con fórmula visible, invitaciones publicadas vs borradores, tasa de conversión porcentual y tabla de actividad reciente.
- **Clientes & Usuarios (`/admin/users`):** Directorio de perfiles, búsqueda por correo y nombre, roles asignados, conteo de eventos creados y estado de cuenta.
- **Equipo & Asesores (`/admin/team`):** Gestión de usuarios con privilegios (`admin`, `advisor`, `support`), tabla de directivas de seguridad para asesores y auditoría de permisos.
- **Gestión de Plantillas (`/admin/templates`):** Inventario de las 18 plantillas, trazabilidad por desarrollador asignado, estilos artísticos, número de versión, estado (`published`, `in_review`) y botón de apertura de demo.
- **Eventos & Vigencias (`/admin/events`):** Buscador global por título, slug o cliente, filtros por estado (`published`, `draft`), verificación de fecha de expiración post-evento y acceso directo a la demo privada y publicación online.
- **Órdenes & Pagos (`/admin/orders`):** Registro transaccional completo, IDs de orden, cliente comprador, plan contratado, importe en USD y estado del cobro (`completed`, `pending`).
- **Finanzas & Métricas (`/admin/finances`):** Desglose financiero con fórmula transparente: `Ingreso Neto Operativo = Ventas Brutas - Comisión Pasarela (3.99% + $0.30 USD)`. Distribución de facturación por plan comercial (Esencial, Interactiva, Evento Pro).
- **Planes & Excepciones (`/admin/plans`):** Matriz de límites y precios, política de inmutabilidad de compras históricas y registro auditable de la tabla `admin_exceptions` para extensiones de vigencia autorizadas.
- **Registro de Auditoría (`/admin/audit`):** Trazabilidad inmutable de las últimas 50 operaciones sensibles con marca de tiempo, usuario responsable, acción ejecutada, entidad afectada, dirección IP y payload sanitizado.

---

## 7. Desglose de Vistas del Cliente y Editor

### 7.1. Dashboard del Cliente (`/dashboard`)
- Tarjetas de métricas personales (Eventos Creados, Publicados, Visitas Totales).
- Lista de eventos con insignias de estado (Publicada, Borrador, Expirada).
- Acceso directo:
  - Ver Demo Privada (`/preview/[token]`).
  - Editar Invitación (`/dashboard/events/[id]/edit`).
  - Gestionar Invitados RSVP (`/dashboard/events/[id]/guests`).
  - Activar Plan / Pagar (`/dashboard/events/[id]/checkout`).
  - Ver Online (`/[slug]`).

### 7.2. Editor en Vivo (`/dashboard/events/[id]/edit`)
- **Pestaña 1 (Datos Principales):** Título, subtítulo, nombres de anfitriones, fecha/hora y frase célebre.
- **Pestaña 2 (Ubicaciones & Mapa):** Nombres, direcciones, horas y enlaces a Google Maps tanto para la Ceremonia como para la Recepción.
- **Pestaña 3 (Regalos & Vestimenta):** Código de vestimenta (Dress Code), mensaje de lluvia de sobres y datos bancarios.
- **Pestaña 4 (Demo Privada & Compartir):**
  - Indicador de estado del enlace (Activo / Revocado).
  - Caja de URL protegida con botón de copiado rápido y apertura en nueva pestaña.
  - Botón de regeneración de token criptográfico.
  - Botón de revocación de acceso.
  - Tarjeta de garantías de seguridad RSD.
  - Llamada a la acción para contratar plan cuando el evento es un borrador.
- **Columna Derecha (Vista Previa Móvil):** Maqueta interactiva contenida dentro del bisel de un smartphone que refleja los cambios en tiempo real.

---

## 8. Confirmación de Asistencia (RSVP) y Privacidad de Invitados

- **Endpoint Seguro:** `/api/rsvp` validado con Zod y canalizado a las funciones RPC de PostgreSQL `submit_guest_rsvp` y `submit_open_rsvp`.
- **Acompañantes Controlados:** El servidor valida que el número de acompañantes confirmados no supere el cupo asignado en el pase del invitado.
- **Protección de Datos Sensibles:** Las restricciones alimentarias y alergias solo pueden ser leídas por el anfitrión del evento y administradores; los asesores comerciales y visitantes anónimos tienen acceso denegado por RLS.
- **Exportación CSV:** Genera archivos compatibles con Microsoft Excel y Google Sheets, disponible exclusivamente para eventos con plan Evento Pro activo.

---

## 9. Arquitectura del Motor de Plantillas en Código (Modular Template Engine)

Para permitir que el equipo de desarrollo cree plantillas altamente personalizadas mediante código React, TypeScript, animaciones CSS y elementos interactivos complejos, se implementó una arquitectura modular desacoplada:

### 9.1. Contrato Técnico Unificado (`src/templates/types.ts`)
Define la interfaz `InvitationTemplateProps` implementada por cada plantilla:
- **`event`:** Identificador, título, slug, fecha del evento y estado.
- **`content`:** Datos editables (anfitriones, cita/quote, ceremonia, recepción, itinerario cronológico, código de vestimenta, datos bancarios/regalos, fotos de galería y música).
- **`theme`:** Paleta de colores (`primary_color`, `secondary_color`, `accent_color`, `background_color`) y tipografías artísticas (`Cinzel`, `Playfair Display`, `Cormorant Garamond`, `Montserrat`, `Syne`, `Outfit`, `Plus Jakarta Sans`).
- **`plan`:** Restricciones comerciales (`allow_music`, `allow_countdown`, `max_gallery_photos`, `max_companions_per_guest`).
- **`guest`:** Datos de personalización para el invitado (nombre, cupos reservados en pase).

### 9.2. Registro de Plantillas (`src/templates/registry.ts`)
Mapea los códigos únicos de plantilla (`BOD-001`, `XV-001`, etc.) o sus slugs con el componente React correspondiente. Si un código no tiene componente específico, el sistema utiliza de manera automática y resiliente la plantilla declarativa universal `UniversalBaseTemplate`.

### 9.3. Despachador Universal (`src/templates/TemplateRenderer.tsx`)
Unifica la renderización en las 4 vistas del ciclo de vida del producto:
1. `/[slug]` (Vista oficial para invitados y anfitriones)
2. `/preview/[token]` (Vista previa privada protegida en modo solo lectura)
3. `/demo/[template]` (Demostración pública del catálogo)
4. `/dashboard/events/[id]/edit` (Previsualización en tiempo real dentro del mock móvil)

### 9.4. Componentes Interactivos y Multimedia Integrados
- **Reproductor de Música (`BackgroundMusicPlayer`):** Control flotante no intrusivo (nunca autoplay con sonido), disco de vinilo animado en giro durante reproducción y botón de pausa/reanudación accesible.
- **Contador Regresivo (`CountdownTimer`):** Reloj dinámico de días, horas, minutos y segundos sincronizado con la fecha del evento.
- **Confirmación RSVP (`PublicRsvpModal`):** Modal interactivo con selector de acompañantes y animación de confeti mediante `canvas-confetti`.
- **Integración de Mapas:** Enlaces directos a Google Maps para navegación GPS de invitados a ceremonias y recepciones.
- **Mesa de Regalos & Transferencias:** Caja con botón de copiado rápido al portapapeles (`navigator.clipboard.writeText`) con confirmación visual de copiado.
- **Guía de Desarrollo Base:** Documentada paso a paso en [docs/GUIA_CREACION_PLANTILLAS.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/docs/GUIA_CREACION_PLANTILLAS.md).

### 9.5. Catálogo de Diseños Codificados Especializados
1. **`BodaImperialGoldTemplate` (`boda-elegance-gold` / `BOD-001`):**
   - Temática de boda elegante clásica: Paleta oro champán y blanco marfil, tipografía Cinzel y Great Vibes, separadores de filigrana dorada, galería de fotos con zoom hover y confirmación RSVP.
2. **`CumpleMidnightGlamTemplate` (`cumple-midnight-glam` / `CUM-001`):**
   - Temática de cumpleaños moderna *Midnight Glam & Neon Velvet*:
   - Paleta cromática: Fondo terciopelo oscuro (`#080415` a `#120924`), acentos magenta neón (`#F43F5E`, `#EC4899`), violeta eléctrico (`#8B5CF6`) y oro resplandeciente (`#F59E0B`).
   - Orbes de resplandor ambiental flotantes con animación CSS `@keyframes float-slow`.
   - Micro-animaciones de destellos, badges festivos con pulso y tarjetas con elevación hover (`hover:-translate-y-1.5`).
   - Contador regresivo en tiempo real integrado condicionalmente por plan (`allow_countdown`).
   - Reproductor flotante de música de fondo con disco de vinilo en rotación continua y control play/pause accesible (`allow_music`).
   - Tarjetas de ubicación con badges de horario y enlaces GPS directos a Google Maps.
   - Itinerario cronológico interactivo de la fiesta con iconos luminosos.
   - Caja de regalos y transferencias bancarias con botón de copiado rápido (`navigator.clipboard.writeText`) y confirmación visual.
   - Modal de confirmación RSVP (`PublicRsvpModal`) con lluvia de confeti dinámico (`canvas-confetti`).

### 9.6. Documentación Operativa y Guías de Creación
- **Guía para Asesores Comerciales y Diseñadores ([docs/GUIA_ASESOR_SUBIR_PLANTILLAS.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/docs/GUIA_ASESOR_SUBIR_PLANTILLAS.md)):**
  - Protocolo para personal no programador: cómo recolectar activos, estructurar el JSON de contenido, dar de alta la plantilla en la Consola Administrativa (`/admin/templates`), probar en `/demo/[template]` y brindar soporte a clientes.
- **Guía de Especificación Técnica para Agentes de IA ([docs/GUIA_AGENTE_IA_PLANTILLAS.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/docs/GUIA_AGENTE_IA_PLANTILLAS.md)):**
  - Estándar técnico estricto para que un Agente de IA construya nuevas plantillas en código: cumplimiento del contrato `InvitationTemplateProps`, estructura atómica de carpetas, reglas de Tailwind CSS 4 / CSS puro sin dependencias externas pesadas, integración con `PublicRsvpModal`, `BackgroundMusicPlayer` y verificación obligatoria mediante `npm run build`.

---

## 10. Flujo de Autenticación, Separación de Roles y Creación Segura de Invitaciones

### 10.1. Mapeo Canónico de Plantillas (`TEMPLATE_CODE_MAP`)
Para garantizar compatibilidad retroactiva total entre los códigos de catálogo (`BOD-001`, `QUI-001`, `CUM-001`), enlaces publicitarios y la tabla `templates` en PostgreSQL, el módulo [src/templates/registry.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/templates/registry.ts) centraliza la normalización a través de la función `normalizeTemplateCode`.
- La creación de invitaciones (`/dashboard/events/new`) y la vista demo (`/demo/[template]`) resuelven de forma segura contra la columna `code` de la base de datos sin referenciar columnas inexistentes.
- Fallback defensivo: Si una plantilla o plan solicitado no existe en base de datos, el sistema toma automáticamente el primer registro activo disponible, impidiendo errores de clave foránea (`events_template_id_fkey` o `events_plan_id_fkey`).

### 10.2. Registro Directo sin Confirmación de Correo
- El formulario de registro (`/register`) ejecuta `supabase.auth.signUp()` e inmediatamente inicia sesión activa en el cliente.
- Se eliminó la pantalla intermedia de verificación de correo electrónico. El cliente es redirigido de inmediato a `/dashboard` para empezar a crear su invitación.

### 10.3. Separación de Contextos Estricta (Administrador vs Cliente)
- **Aislamiento Total de la Interfaz Pública:** La barra de navegación pública (`Navbar.tsx`), el pie de página y la página de inicio no contienen ningún enlace, botón o referencia a la consola administrativa ni a asesores.
  - Visitantes anónimos: Muestra únicamente "Iniciar Sesión" y "Crear Invitación".
  - Clientes autenticados: Muestra "Mi Panel" (`/dashboard`) y "Cerrar Sesión".
- **Panel de Control del Cliente (`/dashboard`):** Diseñado exclusivamente para anfitriones y clientes. Permite crear eventos, ver planes, elegir plantillas y gestionar invitados, sin banners de aviso administrativo ni enlaces hacia `/admin`.
- **Acceso Exclusivo a `/admin`:** La consola administrativa es accesible únicamente navegando de forma directa a la URL `/admin` y requiere autorización estricta en servidor. Se eliminó cualquier bypass de entorno local (`NODE_ENV`); solo las cuentas registradas con rol `admin` o `advisor` en PostgreSQL `user_roles` pueden ingresar. Si un cliente (como `rsdsolutions.ec@gmail.com`) intenta acceder a `/admin`, el middleware y el layout del servidor lo redirigen de inmediato a `/dashboard`.
- **Registro Exclusivo de Clientes (`/register`):** Todo usuario creado desde la web pública se registra únicamente con rol `customer`. Los administradores y asesores comerciales se designan manualmente y de manera interna por la dirección.

### 10.4. Organización de Plantillas por Tipo de Invitación y Catálogo Dinámico
- **Consola de Plantillas por Categoría (`/admin/templates`):** Reestructurada completamente para clasificar el inventario bajo los 9 Tipos de Invitaciones del sistema (Bodas & Compromisos, Quinceañeras & Sweet 16, Cumpleaños Infantiles, Cumpleaños de Adultos, Graduaciones & Logros, Baby Showers & Revelación, Bautizos & Primera Comunión, Aniversarios y Eventos Especiales).
  - Incluye métricas de inventario global (Total categorías, Total plantillas, Disponibles para clientes y Borradores).
  - Cada tarjeta presenta el estado real (`DISPONIBLE CLIENTES` vs `BORRADOR / EN DESARROLLO`), el tipo de motor (`Código React Especializado` vs `Motor Declarativo Universal`) y un botón de activación en 1 clic que actualiza inmediatamente la base de datos vía API.
  - Botón directo `+ Agregar Plantilla a este Tipo` que precarga la categoría en `/admin/templates/new?category_id=...`.
- **Catálogo Público en Tiempo Real (`/catalog`):**
  - Consulta en Supabase únicamente las plantillas activas (`is_active = true` y `status = 'published'`).
  - Muestra actualmente las plantillas completamente operativas (`boda-elegance-gold` y `cumple-midnight-glam`).
  - A medida que el equipo directivo y asesores den de alta o activen nuevas plantillas, estas aparecen automáticamente en el catálogo y en el selector de creación de eventos (`/dashboard/events/new`).



