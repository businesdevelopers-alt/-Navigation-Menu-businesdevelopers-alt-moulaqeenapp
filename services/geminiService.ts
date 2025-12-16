import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const translateCommands = async (prompt: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following natural language robot instructions (in Arabic or English) into a JSON array of commands. 
      Available commands: "FORWARD", "BACKWARD", "TURN_LEFT", "TURN_RIGHT", "WAIT".
      Example Input: "تحرك خطوتين للامام ثم لف يمين"
      Example Output: ["FORWARD", "FORWARD", "TURN_RIGHT"]
      Input: ${prompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            enum: ["FORWARD", "BACKWARD", "TURN_LEFT", "TURN_RIGHT", "WAIT"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const streamAssistantHelp = async (
  query: string, 
  currentCode?: string, 
  robotState?: any
) => {
  if (!apiKey) throw new Error("API Key not found");

  const systemInstruction = `You are "Mulaqqen AI", an expert robotics engineer and coding tutor for the Mulaqqen platform.

  PLATFORM CONTEXT:
  - Commands: FORWARD, BACKWARD, TURN_LEFT, TURN_RIGHT, WAIT.
  - Sensors: Lidar (distance), Thermal (temp), Camera (vision), Battery (power).
  - The user uses a code editor to control a simulated robot on a grid.

  YOUR CAPABILITIES:
  1. 🛠️ ERROR CORRECTION: If the user asks to fix code or find errors, analyze the "Current Code" context carefully. Identify syntax errors or logical issues. Return the FIXED code inside a markdown code block (\`\`\`).
  2. 📐 DESIGN HELP: If the user asks about robot design/configuration, analyze the "Robot State" (battery, components). Suggest adding sensors or upgrading motors if the state shows weaknesses.
  3. ℹ️ SYMBOL EXPLANATION: Explain the available commands (FORWARD, etc.) clearly in Arabic with examples.

  TONE:
  - Technical yet friendly.
  - Use "Industrial SaaS" style formatting (bullet points, bold text).
  - Language: Arabic (Primary). Use English for technical terms/commands.

  CONTEXT DATA:
  [Current Code]:
  ${currentCode || "// No code provided"}

  [Robot State]:
  ${JSON.stringify(robotState || {}, null, 2)}
  `;

  return await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};