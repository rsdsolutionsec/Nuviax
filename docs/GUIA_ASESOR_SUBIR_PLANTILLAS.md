# GUÍA PRÁCTICA PARA ASESORES COMERCIALES Y DISEÑADORES
## Cómo Crear, Configurar y Subir una Plantilla a Nuviax (RSD SOLUTIONS)

**Plataforma:** Nuviax SaaS  
**Audiencia:** Asesores comerciales, diseñadores y equipo de soporte de RSD SOLUTIONS  
**Objetivo:** Permitir que cualquier asesor prepare los recursos de una nueva plantilla y la publique exitosamente en la plataforma, ya sea desde la Consola Administrativa o en colaboración con desarrollo.

---

## 1. ¿Cómo Funciona una Plantilla en Nuviax?

En Nuviax, cada plantilla que ve el cliente se compone de tres capas conectadas:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FICHA EN CATÁLOGO Y BASE DE DATOS                           │
│    Nombre, categoría, foto de portada, descripción y código.    │
├─────────────────────────────────────────────────────────────────┤
│ 2. DATOS DE EJEMPLO EDITABLES POR EL CLIENTE                    │
│    Título, anfitriones, fecha, lugares, música, regalos.        │
├─────────────────────────────────────────────────────────────────┤
│ 3. DISEÑO VISUAL Y ANIMACIONES (Código React / Declarativo)     │
│    Colores, tipografías, destellos, música y modales.           │
└─────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> Cuando un cliente elige una plantilla, el sistema crea una **copia de los datos de ejemplo** en su cuenta. A partir de ese momento, el cliente puede cambiar textos, fechas y fotos desde su panel sin alterar la plantilla original de la tienda.

---

## 2. Preparación de Recursos (Qué Debe Definir el Asesor)

Antes de registrar una plantilla en el sistema, reúne la siguiente información:

### 2.1. Información Comercial
| Campo | Ejemplo para Boda | Ejemplo para Cumpleaños |
| :--- | :--- | :--- |
| **Nombre de la Plantilla** | Boda Imperial Gold | Midnight Glam VIP |
| **Código Único (Sin espacios)** | `boda-imperial-gold` | `cumple-midnight-glam` |
| **Categoría** | `bodas` | `cumpleanos-adultos` |
| **Estilo Artístico** | Gala Clásica Romana & Oro | Fiesta Nocturna Neón & Cóctel |
| **Descripción Breve** | Acentos dorados, tipografía romana clásica, itinerario formal y confirmación de asistencia. | Noche sofisticada de cóctel con destellos neón, alfombra roja y cronograma interactivo. |

### 2.2. Imagen de Portada (Thumbnail)
- **Resolución:** Formato horizontal o vertical de alta calidad (mínimo 800x600 px).
- **Fuente recomendada:** Unsplash con optimización WebP automática:
  ```
  https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80
  ```

### 2.3. Música de Fondo (Opcional pero Recomendada)
- Archivo de audio en formato **MP3** alojado en CDN seguro (HTTPS), libre de derechos de autor (ej. Pixabay Music, Freesound).
- Enlace directo al archivo terminado en `.mp3`:
  ```
  https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3
  ```

### 2.4. Paleta de Colores de la Plantilla
- **Color Primario (Acentos y botones):** Ej. `#EC4899` (Magenta Neón) o `#D4AF37` (Dorado Oro).
- **Color Secundario (Resplandores):** Ej. `#8B5CF6` (Púrpura Eléctrico).
- **Color de Fondo:** Fondo oscuro profundo recomendado para estética RSD (`#070510` o `#080512`).

---

## 3. Método 1: Subir la Plantilla desde la Consola Administrativa (Sin Tocar Código)

Si eres asesor o administrador y deseas publicar una nueva plantilla sin editar archivos de código:

1. **Inicia sesión** en [Nuviax](file:///c:/Users/Robin/Desktop/RSD%20Solutions/Nuviax) con tu correo de administrador autorizado (`robinsonsolorzano99@gmail.com` o el correo autorizado para el asesor).
2. Dirígete a la **Consola Operativa:** ingresa directamente a la URL:
   ```
   https://nuviax.com/admin/templates (o http://localhost:3000/admin/templates en desarrollo)
   ```
3. Haz clic en el botón **"+ Nueva Plantilla"** (ubicado en la esquina superior derecha).
4. Completa el formulario de alta:
   - **Código:** Escríbelo en minúsculas y separado por guiones (ej. `cumple-glam-vip`).
   - **Nombre:** Nombre legible comercial (ej. *Midnight Glam VIP*).
   - **Categoría:** Selecciona la categoría adecuada (Bodas, Cumpleaños, Quinceañeras, etc.).
   - **URL de Portada:** Pega el enlace de la imagen de Unsplash o CDN.
   - **Planes Compatibles:** Marca los planes que permiten usar este diseño (Esencial, Interactiva, Evento Pro).
   - **Datos de Ejemplo:** Rellena los textos que verá el cliente por primera vez (título de ejemplo, hora, lugar, dirección, código de vestimenta).
5. Haz clic en **"Guardar y Publicar Plantilla"**.
6. ¡Listo! La plantilla aparecerá inmediatamente en el catálogo público y en el selector de creación de eventos.

---

## 4. Método 2: Crear una Plantilla con Código Personalizado (Junto al Desarrollador o Agente IA)

Cuando se requiere un diseño ultra-personalizado con animaciones únicas, destellos específicos o interactividad especial:

1. **Solicita al Desarrollador o Agente IA:**  
   Pásale los datos del punto 2 y pídele:
   > *"Crea el componente React para la plantilla `cumple-midnight-glam` en `src/templates/designs/` y regístrala en `src/templates/registry.ts` siguiendo la Guía de Agentes IA."*
2. **El Desarrollador creará:**
   - La carpeta: `src/templates/designs/<codigo-plantilla>/index.tsx`.
   - El registro en: `src/templates/registry.ts`.
3. **El Asesor Verifica:**
   - Abre el navegador en: `/demo/<codigo-plantilla>` para comprobar el diseño en vivo.

---

## 5. Protocolo de Pruebas y Validación (Checklist del Asesor)

Antes de anunciar una nueva plantilla a los clientes o en redes sociales, verifica los siguientes 6 puntos:

- [ ] **1. Prueba en Celular:** Abre la vista previa en tu teléfono o usa el inspector del navegador (modo responsive 375px). Verifica que los textos no se desborden.
- [ ] **2. Cuenta Regresiva:** Comprueba que el reloj de días, horas y minutos esté activo y centrado.
- [ ] **3. Reproductor de Música:** Pulsa el botón flotante del vinilo para verificar que la canción suene y que el botón de pausa funcione.
- [ ] **4. Botón de Google Maps:** Haz clic en *"Abrir en Google Maps"* o *"Cómo Llegar"* y verifica que abra la app o el navegador correctamente.
- [ ] **5. Copiado de Cuenta Bancaria:** Si la plantilla tiene datos de regalos, haz clic en *"Copiar Datos Bancarios"* y verifica que aparezca la confirmación *"¡Copiado con Éxito!"*.
- [ ] **6. Modal de RSVP:** Haz clic en *"Confirmar Asistencia"* y confirma que se despliegue el formulario interactivo sin errores.

---

## 6. Preguntas Frecuentes y Solución de Problemas (FAQ)

### ¿Por qué mi plantilla no aparece en el selector de "Crear Invitación"?
Asegúrate de que en la base de datos el campo `is_active` esté en `true` y que el código esté registrado en `src/templates/registry.ts` dentro de `TEMPLATE_CODE_MAP`.

### ¿El cliente puede cambiar la música si no le gusta la canción predeterminada?
Sí. El cliente puede pegar cualquier enlace MP3 en el campo correspondiente del editor de su invitación siempre que cuente con un plan *Interactiva* o *Evento Pro*.

### ¿Qué pasa si el cliente no llena la galería de fotos?
La plantilla cuenta con fotos de respaldo automáticas de alta calidad para que la invitación nunca se vea vacía ni rota mientras el cliente sube sus propias imágenes.

---
**RSD SOLUTIONS — Documentación Operativa Nuviax SaaS**
