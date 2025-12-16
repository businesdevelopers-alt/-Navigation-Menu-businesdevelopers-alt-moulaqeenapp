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
      contents: prompt,
      config: {
        temperature: 0, // Deterministic output
        topK: 1,
        systemInstruction: `You are a precise Robot Command Interpreter for the 'Mulaqqen' platform.
        Your task is to translate natural language inputs (in Arabic or English) into a strict JSON array of executable robot commands.

        AVAILABLE COMMANDS:
        - FORWARD
        - BACKWARD
        - TURN_LEFT
        - TURN_RIGHT
        - WAIT

        TRANSLATION RULES:
        1. **Strict Output**: Return ONLY a JSON array of strings. No markdown, no explanations.
        2. **Loop Unrolling**: If the user says "move 3 times" or "تحرك ٣ خطوات", output the command repeated 3 times (e.g., ["FORWARD", "FORWARD", "FORWARD"]).
        3. **Arabic Support**:
           - "أمام" / "قدام" / "سيد" / "تحرك" -> FORWARD
           - "خلف" / "ورا" / "ارجع" -> BACKWARD
           - "يمين" / "لف يمين" -> TURN_RIGHT
           - "يسار" / "لف يسار" -> TURN_LEFT
           - "انتظر" / "قف" -> WAIT
        4. **Mixed Input**: If the input mixes code and text, extract the intent and convert to commands.
        5. **Validity**: If the input is already valid commands, capitalize them and return them as an array.

        Example 1:
        Input: "تحرك خطوتين للامام ثم لف يمين"
        Output: ["FORWARD", "FORWARD", "TURN_RIGHT"]

        Example 2:
        Input: "Go forward, wait, then go back"
        Output: ["FORWARD", "WAIT", "BACKWARD"]`,
        
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
    console.error("Gemini Translation Error:", error);
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