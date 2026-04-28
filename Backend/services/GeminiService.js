const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// We will use the standard Gemini 1.5 Flash model as it is fast and perfect for text
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Function to generate a room description using Gemini
 * @param {string} style - The style of the room (e.g., "Minimalista", "Industrial")
 * @param {string} unit - The measurement unit (e.g., "Metros cuadrados")
 * @returns {Promise<string>} - The generated description
 */

async function generateCoachAdvice(views, contacts, shares, topRoomName, topRoomLocation, topRoomPrice) {
  try {
    const prompt = `
      Eres un Coach Inmobiliario experto en optimización de conversiones trabajando para la plataforma RoomIA.
      Analiza las estadísticas del mes de un propietario:
      - Vistas Totales: ${views}
      - Contactos (Leads): ${contacts}
      
      Datos de su propiedad más popular:
      - Estilo: ${topRoomName}
      - Ubicación: ${topRoomLocation}
      - Precio: ${topRoomPrice}

      Instrucciones:
      1. Evalúa la proporción entre vistas y contactos.
      2. Toma en cuenta el precio y la ubicación de su mejor propiedad para darle un consejo accionable y altamente motivador (máximo 4 líneas).
      3. Usa un tono amigable, profesional y directo. Usa emojis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error con Gemini Coach:", error);
    throw new Error("No se pudo generar el consejo del coach");
  }
}

async function generateRoomDescription(style, area, location, imageBase64) {
  try {
    // THIS IS YOUR MASTER PROMPT
    const prompt = `
      Eres un experto diseñador de interiores y agente de bienes raíces trabajando para la plataforma RoomIA.
      Tu trabajo es escribir una descripción atractiva, profesional y emocionante para esta habitación.
      
      DATOS DE LA PROPIEDAD:
      - Título/Estilo: ${style}
      - Ubicación: ${location}
      - Tamaño: ${area}

      INSTRUCCIONES:
      1. Observa la imagen adjunta detalladamente y describe lo que ves (colores, muebles, iluminación, ambiente).
      2. Integra la ubicación y el tamaño en la descripción para hacerla más vendedora.
      3. Escribe un solo párrafo de máximo 4 a 5 líneas.
      4. Usa un tono inspirador y sofisticado. No uses saludos ni despedidas.
    `;

    const mimeType = imageBase64.substring(imageBase64.indexOf(":") + 1, imageBase64.indexOf(";"));
    const base64Data = imageBase64.split(",")[1];

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    // Send the prompt to Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error con Gemini:", error);
    throw new Error("No se pudo generar la descripción con IA");
  }
}

module.exports = { generateRoomDescription, generateCoachAdvice };