import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Note, Insight, GeminiInsightResponse } from '../types';

// Define the expected response schema
const insightSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A short, catchy title for the insight." },
          description: { type: Type.STRING, description: "The detailed insight, historical context, or theological connection." },
          reference: { type: Type.STRING, description: "Scripture reference or historical source (e.g., 'Matthew 13', 'Josephus')." },
          type: { 
            type: Type.STRING, 
            enum: ['historical', 'theological', 'linguistic', 'application'],
            description: "The category of the insight." 
          }
        },
        required: ['title', 'description', 'type']
      }
    }
  },
  required: ['insights']
};

export const analyzeNote = async (note: Note): Promise<Insight[]> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a scholarly and spiritual scripture study assistant. 
      Analyze the following research notes. 
      Provide 3-5 deep insights that would be valuable for comparison or deeper understanding. 
      Focus on historical context, original language nuances (Greek/Hebrew), or cross-references.
      
      Note Title: ${note.title}
      Note Content: ${note.content}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: insightSchema,
        systemInstruction: "You are a helpful research assistant for theology and scripture study. Be objective, scholarly, yet accessible.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const parsed: GeminiInsightResponse = JSON.parse(jsonText);
    
    // Map to internal Insight type with IDs
    return parsed.insights.map((item) => ({
      id: crypto.randomUUID(),
      title: item.title,
      description: item.description,
      reference: item.reference,
      type: item.type as any
    }));

  } catch (error) {
    console.error("Error analyzing note with Gemini:", error);
    throw error;
  }
};