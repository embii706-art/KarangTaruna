import { GoogleGenAI, Type } from "@google/genai";

// Initialize lazily to prevent crash on load if API key is missing
const getAi = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateEventIdeas = async (topic: string): Promise<string[]> => {
  try {
    const ai = getAi();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 creative and realistic event ideas for a youth organization (Karang Taruna) based on this theme: "${topic}". Keep descriptions short and punchy. Return only the JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    return ["Community Clean Up", "Charity Concert", "Youth Sports Day"]; // Fallback
  }
};

export const refineProposal = async (title: string, roughNotes: string): Promise<{ description: string, estimatedBudget: number }> => {
  try {
    const ai = getAi();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a professional secretary for a Karang Taruna. Write a formal 2-sentence description for an event titled "${title}" based on these notes: "${roughNotes}". Also estimate a realistic budget in IDR (Indonesian Rupiah) for a small local event.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            estimatedBudget: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return { description: roughNotes, estimatedBudget: 1000000 };
  } catch (error) {
    console.error("Error refining proposal:", error);
    return { description: roughNotes, estimatedBudget: 0 };
  }
};