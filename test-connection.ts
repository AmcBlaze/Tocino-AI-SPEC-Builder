import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY no se encontró en las variables de entorno.");
  process.exit(1);
}

// Inicializamos el cliente de Gemini usando la API Key
const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  try {
    // Usamos el modelo gemini-1.5-flash que es rápido y excelente para texto general
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "¿Cuál es la capital de Francia?";
    console.log(`Preguntando a Gemini: "${prompt}"...\n`);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("--- Respuesta de Gemini ---");
    console.log(text);
    console.log("---------------------------");
  } catch (error) {
    console.error("Ocurrió un error al conectar con Gemini:", error);
  }
}

main();
