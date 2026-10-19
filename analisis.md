# ANÁLISIS INTEGRAL DEL SISTEMA Y ARQUITECTURA FUNCIONAL — NUVIAX

**Plataforma SaaS de Invitaciones Digitales Personalizadas**  
**Desarrollado para:** RSD SOLUTIONS  
**Fecha de Actualización:** 19 de Octubre de 2026  
**Versión:** v1.0.0-rc1  

---

## 1. Visión del Producto y Principios de Diseño

Nuviax es una plataforma SaaS moderna diseñada para permitir que cualquier persona cree, personalice, publique y administre invitaciones digitales interactivas para celebraciones personales (bodas, quinceañeras, cumpleaños, baby showers, aniversarios y eventos corporativos) sin requerir conocimientos técnicos ni contratar diseñadores externos.

### Propuesta de Valor Central
> *"Elige un diseño, personaliza tu invitación, compártela con tu propio enlace y administra tus invitados desde un solo lugar".*

### Identidad Visual RSD SOLUTIONS
El diseño de la plataforma equilibra la sofisticación tecnológica con la calidez emocional de las celebraciones:
- **Colores de Superficie:** Fondos oscuros profundos (`#090714`, `#0C091C`) con acentos de cristal y desenfoque (`backdrop-blur-xl`).
- **Gradientes y Resplandores:** Tonos violeta neón (`#7C3AED`), magenta brillante (`#EC4899`) y dorado champán (`#D4AF37`).
- **Tipografía y Legibilidad:** Jerarquía tipográfica blanca nítida (`#F8FAFC`) con etiquetas en mayúsculas de espaciado amplio y fuentes clásicas según la plantilla (Cinzel, Playfair Display, Montserrat, Outfit).
- **Tarjetas y Botones:** Esquinas redondeadas amplias (`rounded-2xl`, `rounded-3xl`), bordes sutiles con resplandor púrpura (`rsd-glow-card`) y botones con gradientes reactivos al cursor (`rsd-glow-button`).

---

## 2. Modelo de Usuarios y Roles de Seguridad

El sistema implementa autorización en servidor a través de PostgreSQL Row Level Security (RLS) y comprobación de permisos en componentes de servidor Next.js.

### 2.1. Roles Disponibles
1. **`customer` (Anfitrión / Cliente):**
   - Rol predeterminado para todo usuario registrado.
   - Capacidad: Crear eventos, editar borradores, comprar planes, gestionar la lista de invitados de sus propios eventos, descargar reportes CSV y consultar estadísticas de sus invitaciones.
   - Restricción: No puede consultar ni modificar eventos, órdenes ni invitados pertenecientes a otros usuarios.
2. **`admin` (Operador / Administrador RSD SOLUTIONS):**
   - Asignado explícitamente en la tabla `user_roles`.
   - Capacidad: Acceso exclusivo a la consola `/admin`, visualización de métricas globales de plataforma, auditoría de eventos de todos los usuarios, supervisión de órdenes de compra y gestión del catálogo.
   - Seguridad: La comprobación de rol se ejecuta en el servidor mediante la función `public.is_admin()`; nunca se confía en parámetros enviados por el navegador.
3. **`support` (Soporte Técnico):**
   - Rol reservado para atención al cliente y resolución de incidencias con permisos de solo lectura operativa.

---

## 3. Matriz de Planes Comerciales y Entitlements

El acceso a las funcionalidades está regulado por el módulo centralizado de permisos [src/lib/entitlements/index.ts](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/src/lib/entitlements/index.ts).

| Característica / Capacidad | Plan Esencial ($19.99) | Plan Interactiva ($29.99) | Plan Evento Pro ($49.99) |
| :--- | :---: | :---: | :---: |
| **Vigencia de Publicación** | 30 días post-evento | 90 días post-evento | 180 días post-evento |
| **Enlace único personalizado (`/[slug]`)** | Sí | Sí | Sí |
| **Ubicaciones y Enlaces Google Maps** | Sí | Sí | Sí |
| **Portada Optimizada para WhatsApp** | Sí | Sí | Sí |
| **Cuenta Regresiva en Tiempo Real** | No | Sí | Sí |
| **Música de Fondo Ambiental** | No | Sí | Sí |
| **Galería Fotográfica** | Portada única | Hasta 8 fotos | Hasta 24 fotos |
| **Confirmación de Asistencia (RSVP)** | No | Formulario básico | RSVP Avanzado + Acompañantes |
| **Panel de Invitados y Métricas** | No | Conteo básico | Panel VIP (Filtros, Notas, Pases) |
| **Control de Acompañantes Autorizados**| No | No | Sí |
| **Restricciones y Alergias Dietarias** | No | No | Sí |
| **Exportación de Lista a CSV/Excel** | No | No | Sí |
| **Remoción de Marca de Agua** | No | No | Sí (Sin mención discreta) |

---

## 4. Desglose Exhaustivo de Vistas, Módulos y Rutas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             MAPA DE RUTAS NUVIAX                            │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ Rutas Comerciales     │ / · /catalog · /pricing · /faq · /contact           │
│ Rutas Legales         │ /legal/terms · /legal/privacy · /legal/retention    │
│ Rutas de Autenticación│ /login · /register · /reset-password                │
│ Rutas de Invitación   │ /[slug] (Invitación pública) · /demo/[template]     │
│ Portal del Cliente    │ /dashboard · /dashboard/events/new                  │
│                       │ /dashboard/events/[id]/edit                         │
│                       │ /dashboard/events/[id]/guests                       │
│                       │ /dashboard/events/[id]/checkout                     │
│ Consola Administrativa│ /admin                                              │
│ Endpoints de Servidor │ /api/rsvp                                           │
└───────────────────────┴─────────────────────────────────────────────────────┘
```

### 4.1. Portal Público y Comercial

#### A. Página de Inicio (`/`)
- **Hero Section:** Título de alto impacto visual con texto gradiente violeta/magenta (`rsd-gradient-text`), descripción del producto y dos botones principales de llamada a la acción: "Explorar Diseños Disponibles" (lleva a `/catalog`) y "Ver Planes & Precios" (lleva a `/pricing`).
- **Barra de Métricas:** Contadores rápidos de valor (100% Móvil, RSVP Instantáneo, URL Única, Cero apps para invitados).
- **Cuadrícula de Propuesta de Valor:** 3 tarjetas interactivas explicando:
  1. *URL Legible y Exclusiva:* Generación de slugs limpios para WhatsApp.
  2. *Confirmación RSVP en Vivo:* Respuestas desde el celular sin login.
  3. *Experiencia Interactiva Total:* Cuenta regresiva, mapas, itinerario y música.
- **Colección de Diseños Destacados:** Tarjetas con vista previa real de invitaciones para Bodas, Quinceañeras y Cumpleaños, con enlaces a demostraciones interactivas.
- **Comparativa de Planes:** Bloque de precios con el plan "Interactiva" destacado con borde fucsia neón y badge "Más Popular".
- **Banner de Acción:** Invitación directa al catálogo de diseño.

#### B. Catálogo de Plantillas (`/catalog`)
- **Pills de Filtrado por Categoría:** Botones redondeados para filtrar al instante por categoría: *Todas, Bodas, Quinceañeras, Cumpleaños Adultos, Cumpleaños Niños, Baby Showers*.
- **Tarjetas de Plantillas:** Cada tarjeta presenta:
  - Imagen de portada de alta resolución.
  - Badge de categoría y etiqueta de estado (*Popular, Nuevo*).
  - Título y descripción estética.
  - **Botón "Ver Demo":** Abre la demostración funcional interactiva en `/demo/[code]`.
  - **Botón "Personalizar":** Conduce al asistente de creación de evento en `/dashboard/events/new?template=[code]`.

#### C. Planes & Precios (`/pricing`)
- Desglose detallado de los 3 planes comerciales (Esencial, Interactiva, Evento Pro).
- Lista de funcionalidades con iconos de verificación esmeralda y morada.
- Enlace directo a seleccionar el plan para comenzar a diseñar.

#### D. Preguntas Frecuentes (`/faq`)
- Acordeones estructurados con respuestas claras sobre:
  - Cómo compartir por WhatsApp.
  - Ausencia de requisitos de registro para los invitados.
  - Control de pases y acompañantes autorizados.
  - Comportamiento de invitaciones expiradas.
  - Posibilidad de editar datos sin cambiar el enlace.

#### E. Contacto & Soporte (`/contact`)
- Tarjetas con información directa de soporte por correo electrónico corporativo (`soporte@rsdsolutions.com`) y canal de atención preferencial por WhatsApp para clientes de planes interactivos y pro.

#### F. Páginas Legales (`/legal/terms`, `/legal/privacy`, `/legal/retention`)
- Textos formales de términos de uso, no comercialización de datos personales y política de retención con período de gracia post-vencimiento.

---

### 4.2. Flujo de Autenticación

#### A. Inicio de Sesión (`/login`)
- **Campos:** Correo electrónico y contraseña.
- **Validaciones:** Control de formato y captura de errores de credenciales inválidas.
- **Soporte de Redirección:** Parámetro `?redirect=` para enviar al usuario de vuelta a la página que intentaba visitar (por ejemplo, `/dashboard/events/new`).
- **Enlace de Recuperación:** Acceso rápido a `/reset-password`.

#### B. Registro de Cuenta (`/register`)
- **Campos:** Nombre completo, correo electrónico y contraseña (validación de mínimo 6 caracteres).
- **Proceso:** Creación de cuenta en Supabase Auth y creación automática del registro en la tabla `profiles` mediante trigger PostgreSQL.
- **Feedback:** Pantalla de confirmación con estado de verificación por correo electrónico.

#### C. Restablecer Contraseña (`/reset-password`)
- Envío de correo seguro con token de recuperación de Supabase Auth.

---

### 4.3. Motor Dinámico de Invitación Pública (`/[slug]`)

Este es el módulo central del producto para los invitados del evento:

#### A. Metadatos SSR para Redes Sociales (`generateMetadata`)
- Se ejecuta directamente en el servidor de Next.js antes de enviar el HTML al navegador.
- Genera dinámicamente etiquetas:
  - `og:title`: "Boda de Ana & Carlos — Invitación Exclusiva".
  - `og:description`: Frase personalizada o dedicatoria del anfitrión.
  - `og:image`: Portada del evento optimizada en resolución 1200x630.
  - `twitter:card`: Formato tarjeta grande.
- **Resultado:** Al pegar el enlace en WhatsApp, Telegram o iMessage, la vista previa con foto y título aparece al instante sin depender de JavaScript en el cliente.

#### B. Manejo de Slugs Redirigidos y Eventos Expirados
- **Redirección Atómica:** Si el slug fue cambiado por el anfitrión, el sistema consulta la tabla `slug_redirects` y redirige automáticamente al nuevo enlace mediante `redirect(`/${newSlug}`)`.
- **404 Elegante:** Si el slug no existe, renderiza `not-found.tsx` con diseño corporativo.
- **Pantalla Conmemorativa de Expiración:** Si el evento concluyó su vigencia, muestra un mensaje sobrio y elegante de agradecimiento conmemorando la fecha del evento sin exponer datos privados ni formularios de asistencia.

#### C. Bloques Visuales de la Invitación
1. **Hero de Bienvenida:** Subtítulo, nombres de los anfitriones, tipografía de gala, fecha formateada en español y frase memorable.
2. **Cuenta Regresiva en Vivo (`<CountdownTimer />`):** Contador matemático animado por segundo mostrando días, horas, minutos y segundos restantes para el evento.
3. **Sección Ceremonia & Recepción:**
   - Tarjetas independientes con iconos temáticos.
   - Hora del evento, nombre del recinto y dirección.
   - **Botón "Cómo llegar en Google Maps":** Abre la aplicación de mapas o Waze en el celular del invitado.
4. **Itinerario del Evento:** Cronograma con horas destacadas en bloques tipográficos monoespaciados y títulos de cada momento de la fiesta.
5. **Código de Vestimenta (Dress Code):** Indicación del estilo de vestimenta formal o temática.
6. **Mesa de Regalos:** Información sobre lluvia de sobres o datos de cuenta bancaria.
7. **Llamado a la Confirmación RSVP:** Bloque inferior destacado con el botón de apertura del modal interactivo.

---

### 4.4. Módulo de Gestión de Invitados y Asistencia (RSVP)

#### A. Modal de Confirmación Pública (`<PublicRsvpModal />`)
- **Acceso:** Cualquier persona que reciba el enlace público puede abrirlo desde su celular.
- **Opciones de Asistencia:**
  - Botón "¡Sí, asistiré!" (activa campos de acompañantes y restricciones).
  - Botón "No podré asistir" (registra la respuesta declinada con agradecimiento).
- **Campos:**
  - *Nombre y Apellido:* Identifica a la persona o familia.
  - *Acompañantes adicionales:* Selector numérico que respeta el límite máximo asignado al pase.
  - *Restricciones dietarias:* Campo opcional (vegetariano, celíaco, alergias).
  - *Dedicatoria:* Mensaje de felicitación para los anfitriones.
- **Celebración Visual:** Al confirmar afirmativamente, se dispara un efecto de confetti multicolor en pantalla (`canvas-confetti`) con tonalidades magenta, violeta y dorado.
- **Aislamiento Técnico:** El formulario se comunica con `/api/rsvp`, el cual valida los datos con Zod y llama a procedimientos almacenados PostgreSQL con privilegios `SECURITY DEFINER`. Los invitados jamás tienen acceso de lectura sobre los datos de otros invitados.

#### B. Panel de Control de Invitados (`/dashboard/events/[id]/guests`)
- **Métricas de Asistencia en Tiempo Real:**
  1. *Registrados:* Total de invitados nominales en la base de datos.
  2. *Confirmados:* Personas titulares que marcaron asistencia positiva.
  3. *Pendientes:* Invitados que aún no han respondido.
  4. *No Asistirán:* Invitados que declinaron la invitación.
  5. *Asistentes Totales:* Suma matemática de anfitriones titulares confirmados + todos sus acompañantes confirmados.
- **Herramientas de Filtrado y Búsqueda:**
  - Búsqueda en vivo por nombre, apellido o nombre de grupo familiar.
  - Botones de filtro rápido por estado (Todos, Confirmados, Pendientes, No Asistirán).
- **Tabla de Gestión:**
  - Nombre completo y fragmento seguro del token de pase.
  - Nombre de familia o grupo.
  - Pases totales autorizados vs. confirmados.
  - Badge de estado coloreado (verde = confirmado, ámbar = pendiente, rojo = declinado).
  - Restricciones dietarias y notas privadas.
  - **Botón Copiar Enlace Personalizado:** Copia al portapapeles el enlace con token único (`nuviax.com/evento?t=token`) para enviar pases exclusivos con acompañantes predefinidos.
  - **Botón Eliminar:** Borra al invitado tras confirmación de seguridad en el navegador.
- **Exportación de Datos:**
  - Botón "Exportar CSV" que genera y descarga al instante un archivo `.csv` compatible con Microsoft Excel y Google Sheets conteniendo la lista de invitados completa, estados y restricciones alimentarias.

---

### 4.5. Asistente y Editor de Invitaciones

#### A. Asistente de Creación (`/dashboard/events/new`)
- **Generador Inteligente de Slugs:** Al escribir el título del evento (ej: "Boda de Ana & Carlos"), el sistema genera automáticamente el slug normalizado `ana-y-carlos`.
- **Verificador de Disponibilidad en Tiempo Real:** Consulta a la base de datos si la URL ya está tomada por otro usuario e informa con un indicador verde ("Enlace disponible") o rojo ("No disponible").
- **Bloqueo de Palabras Reservadas:** Impide registrar rutas críticas del sistema como `admin`, `api`, `login` o `pricing`.
- **Selector de Plantilla y Fecha:** Inicializa el registro en estado `'draft'`.

#### B. Editor en Vivo con Simulador Móvil (`/dashboard/events/[id]/edit`)
- **Pestaña 1: Datos Principales:** Título, subtítulo, nombres de homenajeados, fecha/hora y pensamiento especial.
- **Pestaña 2: Ubicaciones & Mapa:** Datos independientes para Ceremonia y Recepción con nombres de recintos, horarios, direcciones físicas y URLs de Google Maps.
- **Pestaña 3: Regalos & Vestimenta:** Dress code, mensaje de lluvia de sobres y datos bancarios.
- **Simulador Móvil Side-by-Side:** Marco de celular interactivo que renderiza los cambios de texto y diseño en vivo sin necesidad de recargar la página.
- **Acciones:** "Guardar Borrador" (guarda en base de datos) y "Publicar" (activa el estado público en línea).

---

### 4.6. Proceso de Pago y Activación (`/dashboard/events/[id]/checkout`)

- Selector interactivo de planes con actualización del monto total a pagar.
- Integración desacoplada mediante la interfaz `IPaymentProvider` y el adaptador `MockPaymentAdapter`.
- En modo desarrollo/pruebas (`PAYMENTS_MODE=test`), permite validar el flujo completo de compra:
  1. Crea el registro de orden en la tabla `orders` con estado `'completed'`.
  2. Actualiza el `plan_id` del evento en la tabla `events`.
  3. Calcula la fecha de expiración sumando los días de vigencia del plan (30, 90 o 180 días).
  4. Cambia el estado del evento a `'published'` y redirige al anfitrión a su invitación activa.

---

### 4.7. Consola Administrativa RSD SOLUTIONS (`/admin`)

- **Protección Server-Side:** Comprueba en el servidor de Next.js si el usuario autenticado tiene el rol `'admin'` en la tabla `user_roles`. Si no lo tiene, redirige automáticamente a `/dashboard`.
- **Panel de Métricas Globales:** Conteo en tiempo real de Total de Usuarios, Total de Eventos, Invitados Globales y Órdenes procesadas.
- **Tabla de Auditoría de Eventos Recientes:** Monitoreo de los últimos 10 eventos creados en la plataforma con título, slug, correo del propietario, plan contratado, estado de publicación, fecha de creación y enlace de visualización directa.

---

## 5. Esquema de Entidades y Base de Datos (PostgreSQL)

```
[auth.users] ────< [profiles] ────< [user_roles]
                       │
                       ├────< [orders] ────< [payments]
                       │         │
                       │         v
                       └────< [events] ────< [guests]
                                 │
                                 ├────< [slug_redirects]
                                 ├────< [event_domains]
                                 │
               [categories] ──< [templates]
               [plans] ───────< [events]
```

1. **`profiles`:** Extensión del perfil del usuario registrado (nombre, email, avatar).
2. **`user_roles`:** Roles de autorización administrativa (`admin`, `support`, `customer`).
3. **`categories`:** Categorías maestras de eventos con orden de despliegue e icono.
4. **`plans`:** Configuración de planes (Esencial, Interactiva, Evento Pro) con precios, días de vigencia y límites JSONB.
5. **`templates`:** Definición declarativa de plantillas con esquemas de secciones permitidas y configuración predeterminada.
6. **`events`:** Entidad central del evento con slug único, estado (`draft`, `published`, `expired`, `archived`), fechas y contenidos en JSONB.
7. **`guests`:** Registro de invitados con token único no predecible, acompañantes autorizados/confirmados, estado RSVP y notas.
8. **`orders` & `payments`:** Registro de transacciones comerciales desacopladas del proveedor de pago.
9. **`slug_redirects`:** Historial de slugs anteriores para preservar enlaces compartidos en caso de renombrado.
10. **`event_domains`:** Estructura preparada para conexión de dominios personalizados en fases posteriores.
11. **`audit_logs`:** Registro de seguridad para trazabilidad de operaciones críticas.

---

## 6. Procedimiento Obligatorio de Actualización

Conforme a las reglas permanentes registradas en [AGENTS.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/AGENTS.md):
- Este documento ([analisis.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/analisis.md)) y el informe de auditoría ([auditoria.md](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax/auditoria.md)) deben actualizarse obligatoriamente al incorporar nuevas características, plantillas o vistas en la plataforma.
- Toda ejecución debe concluir con un `git add .` y `git commit` descriptivo, dejando el comando `git push` reservado exclusivamente al usuario.
