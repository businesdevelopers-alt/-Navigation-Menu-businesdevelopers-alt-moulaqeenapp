import { GoogleGenAI, Type } from "@google/genai";

export const translateCommands = async (
  prompt: string,
  context?: {
    robotState: { x: number; y: number; direction: number };
    target: { x: number; y: number };
    obstacles: { x: number; y: number }[];
    gridSize: number;
  }
): Promise<string[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key provided");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    let contextInstruction = "";
    if (context) {
      contextInstruction = `
      CURRENT SIMULATION CONTEXT:
      - Grid Size: ${context.gridSize}x${context.gridSize} (0-indexed).
      - Robot Position: x=${context.robotState.x}, y=${context.robotState.y}, Facing=${context.robotState.direction}° (0=Up, 90=Right, 180=Down, 270=Left).
      - Target Flag Position: x=${context.target.x}, y=${context.target.y}.
      - Static Obstacles at: ${JSON.stringify(context.obstacles)}.

      INTELLIGENT NAVIGATION RULES:
      1. **Pathfinding**: If the user asks to "reach the target", "go to flag", "solve the maze", or "win" (in English or Arabic), you MUST calculate a valid path from the current robot position to the target, avoiding all obstacles.
      2. **Orientation**: Consider the robot's current facing direction. If it needs to move East but is facing North, issue a TURN_RIGHT command first.
      3. **Spatial Queries**: If the user says "move to (x,y)", calculate the path to that specific cell.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1, // Highly deterministic for code generation
        topK: 1,
        systemInstruction: `You are a precise Robot Command Interpreter for the 'Mulaqqen' platform.
        Your task is to translate natural language inputs (in Arabic or English) into a strict JSON array of executable robot commands.

        ${contextInstruction}

        AVAILABLE COMMANDS:
        - FORWARD (Moves 1 step in current direction)
        - BACKWARD (Moves 1 step opposite to current direction)
        - TURN_LEFT (Rotates 90° counter-clockwise)
        - TURN_RIGHT (Rotates 90° clockwise)
        - WAIT (Pauses execution)

        TRANSLATION RULES:
        1. **Strict Output**: Return ONLY a JSON array of strings. No markdown, no explanations.
        2. **Loop Unrolling**: If the user says "move 3 times", output ["FORWARD", "FORWARD", "FORWARD"].
        3. **Arabic Support**:
           - "أمام" / "قدام" / "سيد" / "تحرك" -> FORWARD
           - "خلف" / "ورا" / "ارجع" -> BACKWARD
           - "يمين" / "لف يمين" -> TURN_RIGHT
           - "يسار" / "لف يسار" -> TURN_LEFT
           - "انتظر" / "قف" -> WAIT
           - "وصلني للعلم" / "حل المتاهة" -> [Use Pathfinding Logic]
        4. **Mixed Input**: Extract intent from mixed code/text.

        Example 1 (Relative):
        Input: "تحرك خطوتين للامام ثم لف يمين"
        Output: ["FORWARD", "FORWARD", "TURN_RIGHT"]

        Example 2 (Contextual - assuming robot at 0,0 facing Right, Target at 2,0):
        Input: "اذهب للهدف"
        Output: ["FORWARD", "FORWARD"]`,
        
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
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are "Mulaqqen AI", a friendly and expert robotics engineer for the Mulaqqen platform.
  Your goal is to help students learn robotics programming, debug their code, and understand hardware concepts.

  PLATFORM SPECIFICATIONS:
  - **Commands**: FORWARD, BACKWARD, TURN_LEFT, TURN_RIGHT, WAIT.
  - **Sensors**: Lidar (distance), Thermal (temp), Camera (vision), Battery (power).
  - **Environment**: A grid-based simulation where the robot must navigate obstacles to reach a target.

  YOUR RESPONSIBILITIES:
  1. **Debugger**: When asked to fix code, analyze the [Current Code] below. Look for syntax errors, logical traps (like infinite loops), or missing logic. Provide the corrected code in a code block.
  2. **Architect**: If asked about design, analyze the [Robot State]. If the robot lacks motors, warn the user. If they crash often, suggest sensors.
  3. **Teacher**: Explain concepts simply. Use emojis to make it engaging.
  4. **Language**: Respond primarily in Arabic, but use English for code keywords and technical terms.

  CONTEXT:
  [Current Code]:
  ${currentCode || "// No code provided"}

  [Robot State & Config]:
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