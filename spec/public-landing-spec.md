# Especificación de Feature: Página de Inicio Pública (Landing Page) y Generador Protegido

## Qué hace
Permite que la ruta raíz (`/`) de la aplicación sea accesible públicamente para usuarios no autenticados, mostrándoles una página de presentación (landing page) atractiva que explica el producto y sus beneficios. El acceso al generador de especificaciones técnicas (el constructor) queda restringido exclusivamente a usuarios autenticados: al iniciar sesión, la misma ruta raíz (`/`) cargará dinámicamente el panel completo del constructor con el formulario de generación y su historial.

## Por qué
- **Contexto al Visitante:** El usuario no autenticado debe entender qué es Tocino AI SPEC Builder y cuál es su propuesta de valor antes de que se le solicite iniciar sesión o registrarse.
- **Flujo sin fricción:** Al utilizar una sola ruta raíz (`/`) que cambia dinámicamente según el estado de autenticación, el usuario que inicia sesión entra directamente al constructor sin redirecciones complejas ni cambio de URLs.
- **Seguridad en la Generación:** Se asegura que el backend `/api/generate-spec` y el consumo de tokens de la IA de Gemini queden estrictamente reservados para usuarios que han iniciado sesión.

## Criterios de aceptación

- [ ] **Ruta Raíz Pública (`/`):**
  - La ruta raíz no debe requerir inicio de sesión en el archivo de proxy ([proxy.ts](file:///c:/Develop/ProyectoClaude/src/proxy.ts)).
- [ ] **Renderizado Dinámico según Autenticación:**
  - En la página principal ([page.tsx](file:///c:/Develop/ProyectoClaude/src/app/page.tsx)), se debe verificar el estado de autenticación del usuario mediante los hooks del cliente de Clerk (como `useUser` o `SignedIn`/`SignedOut`).
  - **Usuario No Autenticado (`SignedOut`):**
    - Se debe mostrar una landing page atractiva y moderna (hero section, propuesta de valor, listado de características del builder, y llamados a la acción claros).
    - Debe incluir botones prominentes de **"Comenzar"** o **"Iniciar Sesión"** que abran el flujo de autenticación de Clerk.
  - **Usuario Autenticado (`SignedIn`):**
    - Se debe mostrar la interfaz completa del constructor de especificaciones (Header Toolbar, Sidebar de historial, formulario y visualizador del resultado) que ya está desarrollada.
- [ ] **Header Simplificado para Visitantes:**
  - Si el usuario no ha iniciado sesión, el Header de la landing page debe mostrar el logotipo de la aplicación y un botón de "Iniciar Sesión" en la esquina superior derecha.
- [ ] **Protección del Generador y la API:**
  - El backend `/api/generate-spec` en [route.ts](file:///c:/Develop/ProyectoClaude/src/app/api/generate-spec/route.ts) debe seguir estrictamente protegido mediante sesión (retornando `401 Unauthorized` si no hay sesión).
  - El archivo de configuración de proxy ([proxy.ts](file:///c:/Develop/ProyectoClaude/src/proxy.ts)) se debe actualizar para excluir la ruta raíz `/` de la redirección automática, pero seguir protegiendo las APIs y rutas privadas si las hubiera.

## No incluye
- [ ] **Rutas secundarias protegidas:** No se crearán subrutas separadas como `/dashboard` o `/app` en esta fase; toda la lógica se gestiona de forma dinámica en la ruta raíz `/` para mantener el sistema simple y liviano.
- [ ] **Personalización de la Landing según el usuario:** El contenido de la landing page es estático e idéntico para todos los visitantes anónimos.
