# Especificación de Feature: Historial de Specs en LocalStorage

## Qué hace
Permite al usuario conservar y consultar un historial de las especificaciones técnicas que ha generado anteriormente. Las especificaciones se guardan de forma automática e inmediata en el almacenamiento local del navegador (`localStorage`) del cliente. La interfaz incorporará una barra lateral izquierda (sidebar) responsiva y colapsable que listará los títulos de los proyectos guardados junto con su fecha de creación. Al hacer clic en cualquier elemento de la lista, la especificación guardada se cargará instantáneamente en el panel de visualización principal. También se proveerán opciones para eliminar elementos individuales o vaciar todo el historial.

## Por qué
- **Persistencia sin Complejidad**: Al no contar con base de datos ni sistema de autenticación en esta fase (MVP), `localStorage` ofrece una solución de persistencia ideal, rápida y 100% en el cliente.
- **Iteración y Comparación**: Los usuarios (emprendedores) a menudo exploran varias ideas de producto o iteran sobre una misma idea. Poder alternar rápidamente entre especificaciones anteriores sin tener que regenerarlas ahorra tiempo de cómputo (costos de API de Gemini) y mejora drásticamente la experiencia de usuario.
- **Privacidad Total**: Al guardarse todo localmente en el navegador del usuario, sus ideas de negocio no se transmiten ni almacenan en ningún servidor ajeno, reforzando la seguridad y confidencialidad.

## Criterios de aceptación
- [ ] **Barra Lateral Izquierda (Sidebar)**:
  - Debe mostrarse a la izquierda del contenido principal en pantallas grandes (desktop).
  - Debe ser colapsable para maximizar el espacio de trabajo.
  - En dispositivos móviles (mobile/tablet), debe comportarse como un panel deslizante (drawer) que se abre mediante un botón de menú ("hamburguesa").
  - Cada elemento del historial debe mostrar el título del proyecto (derivado de la visión) y la fecha/hora de generación formateada elegantemente.
- [ ] **Guardado Automático**:
  - Cada vez que una especificación técnica sea generada con éxito a través de la IA, se debe agregar automáticamente al historial de `localStorage`.
  - El objeto guardado debe incluir los datos completos de la spec (`vision`, `users`, `features`, `flows`, `architecture`, `requirements`, `timestamp` e `id` único).
- [ ] **Navegación e Interacción**:
  - Al hacer clic en un elemento del historial en la barra lateral, su contenido completo se renderizará de inmediato en el panel principal (`SpecOutput`).
  - El elemento seleccionado debe mostrar un estado visual "activo" o destacado en la barra lateral.
- [ ] **Gestión de Historial**:
  - Cada elemento de la lista del historial debe incluir un botón discreto de eliminación (icono de papelera) para borrar esa especificación individual de forma inmediata con confirmación visual.
  - Debe existir un botón para "Vaciar historial" en la parte inferior de la barra lateral, eliminando todos los registros locales de la aplicación.
- [ ] **Límites y Cuota**:
  - Para evitar exceder la cuota máxima de `localStorage` (5MB), la app limitará el historial a un máximo de **20 especificaciones** guardadas simultáneamente, eliminando de forma automática la spec más antigua si se supera este límite (principio FIFO: First In, First Out).

## No incluye
- [ ] **Autenticación de Usuarios**: No requiere registro, inicio de sesión (Google, GitHub, email) ni administración de cuentas.
- [ ] **Base de Datos Remota**: No se conectará a servicios de backend como PostgreSQL, MongoDB, Firebase o Supabase para almacenar la información.
- [ ] **Sincronización Multidispositivo**: El historial es exclusivo del navegador y dispositivo físico en el que se generó la especificación técnica (no se sincroniza entre celular y computadora).
- [ ] **Exportación Masiva**: No incluye la funcionalidad de descargar todo el historial en un lote único (p. ej., un archivo comprimido `.zip` de todas las especificaciones).
