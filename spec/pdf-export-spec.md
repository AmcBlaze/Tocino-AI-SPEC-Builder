# Especificación de Feature: Exportación a PDF

## Qué hace
Permite al usuario descargar de forma instantánea la especificación técnica generada en formato PDF directamente desde su navegador. Al hacer clic en el botón "Exportar a PDF", la aplicación genera un documento HTML optimizado y estilizado en segundo plano, lo inyecta en un iframe oculto e invoca la ventana de impresión nativa (`window.print()`), permitiendo al usuario guardarlo como PDF o imprimirlo.

## Por qué
- **Universalidad**: El formato PDF es el estándar predilecto para compartir especificaciones formales con desarrolladores, agencias y clientes sin alterar el formato.
- **Cero Dependencias**: Al evitar el uso de librerías externas pesadas (como `jsPDF` o `html2pdf.js`), mantenemos el tamaño del bundle del frontend extremadamente liviano, rápido y libre de dependencias frágiles que se rompen con actualizaciones de React o fuentes personalizadas.
- **Estilo Dedicado**: Permite definir una estructura visual impecable exclusiva para la versión impresa sin perturbar el diseño web interactivo original.

## Criterios de aceptación
- [ ] El botón "Exportar a PDF" debe aparecer junto al botón de "Exportar a Markdown" existente (tanto en la cabecera como en el pie de página del componente de salida).
- [ ] La acción de exportar debe invocar el cuadro de diálogo de impresión nativo del navegador utilizando un iframe invisible, sin abrir pestañas vacías adicionales.
- [ ] El PDF exportado debe tener un formato limpio e impecable:
  - **H1** para el nombre del proyecto (extraído dinámicamente de la visión).
  - **H2** para cada sección de la especificación.
  - **Listas estructuradas** para las funcionalidades principales y flujos de usuario.
  - **Caja destacada** para los flujos alternativos o de error.
- [ ] En la impresión (PDF), no deben aparecer elementos de interfaz interactiva de la web (botones "Copiar", "Exportar", menús o pie de página del sitio).
- [ ] Cero dependencias externas agregadas al `package.json`.
- [ ] Evitar cortes huérfanos de texto en páginas consecutivas usando reglas CSS de control de saltos de página (`page-break-inside: avoid`).

## No incluye
- [ ] Generación del archivo PDF en el servidor/backend (p. ej. usando Node.js, Puppeteer o APIs de terceros).
- [ ] Almacenamiento persistente o guardado de los PDFs generados en servicios de la nube (AWS S3, Supabase, etc.).
- [ ] Editor o personalizador visual del PDF antes de descargarlo (cambiar colores, fuentes o subir logotipos).
- [ ] Integración con flujos de firma digital, contraseñas o encriptación de seguridad en el archivo exportado.
- [ ] Envío automático del PDF generado por correo electrónico, Slack o canales externos.
