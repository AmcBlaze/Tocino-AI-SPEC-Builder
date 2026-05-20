# Plantilla Spec-First para Claude / Gemini
Estructura tu proyecto antes de escribir una línea de código o prompt

## SECCIÓN 1 — Visión del producto
La descripción más corta y clara de lo que construyes. Una o dos oraciones. Si no puedes explicarlo en dos oraciones, aún no está claro.

Preguntas guía:
¿Qué hace exactamente este producto?
¿Para quién es?
¿Qué problema resuelve en una frase?

Ejemplo:
"Una herramienta para que freelancers gestionen sus proyectos y facturas desde un solo lugar, sin necesidad de usar hojas de cálculo separadas."

**Tu visión:**
Tocino AI SPEC Builder es el puente entre tu idea y tu primer desarrollador: describe tu producto en palabras simples y obtén al instante una especificación técnica completa y lista para construir.

## SECCIÓN 2 — Usuarios y casos de uso
Quién usa el producto y para qué. No perfiles de marketing — acciones concretas que realiza cada tipo de usuario.

Preguntas guía:
¿Quién es el usuario principal?
¿Hay usuarios con roles diferentes? (admin, usuario estándar, visitante)
¿Cuáles son las 3 acciones principales que hace cada usuario?

Ejemplo:
Usuario freelancer: crea proyectos, registra horas trabajadas, genera facturas.
Usuario cliente: ve el progreso del proyecto, aprueba facturas.

**Tus usuarios y casos de uso:**
Aquí los casos de uso principales para ese perfil:
**Usuario principal:** Emprendedor no técnico con una idea de producto digital (app, plataforma, SaaS, etc.)

**Casos de uso principales:**
- **Generar una spec desde cero** — Describe su idea en lenguaje natural y obtiene un documento técnico estructurado listo para compartir.
- **Solicitar cotizaciones** — Adjunta la spec a un proceso de contratación (freelancer, agencia) para obtener presupuestos más precisos.
- **Validar el alcance del producto** — Entiende qué tan complejo es lo que quiere construir antes de comprometer tiempo o dinero.
- **Iterar sobre la idea** — Refina la descripción y regenera la spec hasta que refleje exactamente su visión.

## SECCIÓN 3 — Funcionalidades
La lista completa de lo que hace el sistema, organizada por módulos. Escribe cada funcionalidad como "El usuario puede..." o "El sistema permite..." Esto te fuerza a pensar desde el comportamiento, no desde el código.

**Tus funcionalidades:**

### Input
- El usuario puede describir su idea de producto en lenguaje natural, sin tecnicismos.
- El usuario puede especificar el tipo de producto (app móvil, plataforma web, SaaS, etc.).
- El usuario puede indicar su público objetivo y contexto del negocio.
- El usuario puede refinar o editar su descripción antes de generar la spec.

### Output
- El sistema genera una especificación técnica completa y estructurada a partir de la descripción.
- El usuario puede exportar la spec en un formato listo para compartir con desarrolladores o agencias.
- El usuario puede copiar la spec directamente al portapapeles.
- El sistema genera una estimación del nivel de complejidad del producto descrito.

### Estados
- El usuario puede iterar sobre su descripción y regenerar la spec cuantas veces necesite.
- El sistema permite comparar versiones anteriores de la spec para ver cómo evolucionó la idea.
- El sistema guarda el progreso del usuario para que pueda retomar donde lo dejó.

## SECCIÓN 4 — Flujos de usuario
Los pasos exactos que sigue un usuario para completar cada acción principal. Incluye el flujo cuando todo funciona (happy path) y qué pasa cuando algo falla.

**Tus flujos principales:**

### Flujo principal — Tocino AI SPEC Builder

**1. Apertura de la app**
El usuario abre la herramienta y ve una pantalla de bienvenida con una breve explicación de qué hace y un único botón de llamada a la acción: **"Crear mi spec"**.

**2. Input de la idea**
El sistema presenta un formulario simple con tres campos:
- ¿Qué hace tu producto? *(descripción libre)*
- ¿Para quién es? *(público objetivo)*
- ¿Qué tipo de producto es? *(app móvil, web, SaaS, otro)*

**3. Revisión antes de generar**
El usuario revisa lo que escribió y puede editar antes de continuar. El sistema valida que los campos mínimos estén completos y muestra un aviso si falta información clave.

**4. Generación de la spec**
El usuario presiona **"Generar spec"**. El sistema muestra un estado de carga con feedback visual mientras procesa la solicitud a través de la IA.

**5. Entrega del resultado**
La spec aparece estructurada en pantalla con secciones claras. El sistema muestra además el nivel de complejidad estimado del producto.

**6. Acciones sobre la spec**
El usuario puede exportar, copiar al portapapeles, o volver a editar su descripción para regenerar una nueva versión.

### Flujos de error

| Situación | Qué ve el usuario |
|---|---|
| Campos vacíos o muy cortos | Mensaje inline: *"Agrega un poco más de detalle para obtener mejores resultados"* |
| Falla en la llamada a la IA | Mensaje claro: *"Algo salió mal, intenta de nuevo"* + botón de reintento |
| Timeout por lentitud | Aviso de espera + opción de cancelar y reintentar |
| Resultado vacío o incompleto | El sistema detecta la respuesta inválida y reintenta automáticamente una vez antes de mostrar error |

## SECCIÓN 5 — Arquitectura
La estructura técnica del sistema. Qué componentes necesita, cómo se comunican, qué tecnologías usar.

**Tu arquitectura:**

**Decisiones tecnológicas**
- **Frontend:** Next.js 16 con React maneja la UI, el routing y el renderizado. Tailwind CSS se encarga del diseño visual con clases utilitarias, sin necesidad de escribir CSS personalizado.
- **Backend:** Una API Route de Next.js (`/api/generate-spec`) actúa como capa intermedia entre el cliente y la IA. Esto mantiene la lógica del servidor separada del frontend y protege las credenciales del SDK.
- **IA:** El Google Generative AI SDK se importa directamente en la API Route para llamar a Gemini. El prompt del sistema define cómo estructurar la especificación técnica; el input del usuario se pasa como mensaje de usuario.
- **Deploy:** Vercel detecta automáticamente proyectos Next.js y gestiona el entorno, las variables de entorno (como `GEMINI_API_KEY`) y el escalado sin configuración adicional.

## SECCIÓN 6 — Requisitos no funcionales
Las restricciones que el sistema debe cumplir aunque el usuario no las vea directamente. Muchos proyectos los ignoran hasta que el problema aparece en producción.

**Tus requisitos:**

### Rendimiento
- La spec debe generarse y mostrarse en menos de 30 segundos bajo condiciones normales.
- El formulario debe responder al input del usuario en menos de 100ms (sin lag perceptible).
- La app debe ser utilizable en conexiones móviles estándar (4G).
- No se requiere optimización para miles de usuarios simultáneos en esta etapa.

### Seguridad
- La `GEMINI_API_KEY` vive exclusivamente en variables de entorno del servidor (Vercel), nunca expuesta al cliente.
- Toda comunicación con la API de Gemini ocurre desde la API Route del servidor, no desde el navegador.
- Se valida el input del usuario en el servidor antes de pasarlo al SDK para evitar prompts maliciosos o abusivos.
- No se almacena información del usuario ni sus ideas de producto en ninguna base de datos.

### Accesibilidad
- La interfaz debe ser navegable con teclado (tab, enter, escape).
- Contraste de colores mínimo WCAG AA en todos los textos.
- Los estados de carga y error deben comunicarse con texto, no solo con color o iconos.
- Formulario con labels explícitos asociados a cada campo.

### Fuera del alcance
Esta es la sección más importante: define los límites del producto y protege el foco del equipo.

| Qué | Por qué no |
|---|---|
| **Autenticación y cuentas de usuario** | Añade complejidad significativa; en esta etapa no es necesario identificar a los usuarios |
| **Guardado y persistencia de specs** | Sin base de datos en v1; el usuario exporta y guarda por su cuenta |
| **Historial de versiones de specs** | Requiere storage y autenticación; fuera del alcance por ahora |
| **Modo colaborativo / compartir specs** | Funcionalidad multiusuario que no aplica al caso de uso central |
| **Integración con herramientas externas** | No se conecta con Notion, Jira, Google Docs, ni similares en v1 |
| **Pagos o modelo freemium** | Monetización es una decisión de negocio posterior al MVP |
| **App móvil nativa** | La web responsive cubre el caso de uso; no se construye app iOS/Android |
| **Soporte multilingüe** | La app opera en español; no hay internacionalización en v1 |
| **Templates o specs prediseñadas** | El valor está en la generación dinámica, no en plantillas estáticas |
| **Estimaciones de costo o tiempo de desarrollo** | Requiere lógica de negocio compleja y datos externos; fuera del scope |

### Features
Exportar como Markdown
Exportar como PDF

La regla de oro para este proyecto: **si no está en los casos de uso definidos, no se construye.** Cualquier feature nueva pasa primero por validación con usuarios reales.
