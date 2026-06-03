# Especificación de Feature: Autenticación con Clerk

## Qué hace
Permite proteger por completo la aplicación Tocino AI SPEC Builder requiriendo que los usuarios estén autenticados antes de poder interactuar con la interfaz de generación de especificaciones o consumir la API subyacente. La autenticación se realiza a través de Clerk, incorporando un botón de perfil de usuario (`UserButton`) en la barra de navegación superior (Header) que muestra la sesión activa y permite cerrar sesión.

## Por qué
- **Control de Acceso y Recursos:** El uso del SDK de Gemini tiene costes asociados de API. Limitar el acceso a usuarios registrados permite controlar quién puede realizar solicitudes al backend.
- **Preparación para futuras features:** Al identificar a cada usuario mediante un identificador único persistente y verificado (`userId`), se establece el cimiento técnico para asociar el historial y configuraciones a la cuenta del usuario en fases posteriores (p. ej., bases de datos en la nube).
- **Seguridad y Robustez:** El flujo de autenticación, almacenamiento de sesiones e inicio de sesión seguro se delegan a un servicio especializado (Clerk) que maneja las mejores prácticas de seguridad, reduciendo el riesgo de accesos no autorizados.

## Criterios de aceptación
- [ ] **Acceso Restringido Total (Opción B):**
  - Cualquier intento de acceder a la página de inicio `/` o subpáginas sin sesión activa debe ser interceptado y redirigido automáticamente a la página de inicio de sesión/registro de Clerk.
  - La redirección debe implementarse utilizando la convención de Proxy de Next.js 16 ([proxy.ts](file:///c:/Develop/ProyectoClaude/src/proxy.ts)).
- [ ] **Seguridad del Endpoint de API:**
  - El endpoint `/api/generate-spec` en [route.ts](file:///c:/Develop/ProyectoClaude/src/app/api/generate-spec/route.ts) debe verificar que el usuario tenga una sesión válida (`userId` no nulo) utilizando las funciones del servidor de Clerk (`auth()`).
  - Las peticiones sin autenticación válida deben ser denegadas inmediatamente con un código de respuesta HTTP `401 Unauthorized`.
- [ ] **Interfaz del Usuario (User Button):**
  - Se debe desplegar el componente `<UserButton />` de Clerk en la esquina superior derecha de la cabecera (Header Toolbar) al lado del indicador "ONLINE" en [page.tsx](file:///c:/Develop/ProyectoClaude/src/app/page.tsx).
  - Al hacer clic en el botón de usuario, se debe desplegar un menú modal nativo de Clerk que muestre la información del usuario y la opción "Cerrar sesión" (Sign out).
  - Al cerrar sesión, el usuario debe ser redirigido de forma segura fuera de la aplicación protegida.
- [ ] **Preservación del Historial local:**
  - Las especificaciones del historial local (almacenadas en `localStorage`) deben mantenerse intactas y accesibles antes y después de iniciar sesión en el mismo dispositivo físico, respetando el alcance definido para esta fase.

## No incluye
- [ ] **Guardado del historial en base de datos:** El historial de especificaciones técnicas no se sincroniza ni se guarda en bases de datos remotas en esta fase.
- [ ] **Gestión de roles y permisos:** Todos los usuarios autenticados tienen el mismo nivel de acceso y límites de rate-limiting genéricos del sistema.
- [ ] **Páginas de Login/Signup personalizadas dentro de la app:** Se utilizan las páginas estándar auto-hospedadas provistas por Clerk en lugar de construir layouts locales bajo `/sign-in` o `/sign-up`.
