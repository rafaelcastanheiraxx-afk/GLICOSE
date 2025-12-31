import { GoogleGenAI, Type } from "@google/genai";
import { VitalReading, VitalType } from "../types.ts";

export const getHealthObservations = async (readings: VitalReading[], lang: 'pt' | 'en') => {
  const apiKey = process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT';
  if (!apiKey || readings.length === 0) return lang === 'pt' ? "Adicione dados para anÃ¡lise inteligente." : "Add data for smart analysis.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const summary = readings.slice(0, 5).map(r => `${r.type}: ${r.value} (${r.moodEmoji})`);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estes dados de saÃºde de forma Ã©tica e curta em ${lang === 'pt' ? 'PortuguÃªs' : 'InglÃªs'}: ${summary.join(', ')}. NÃ£o diagnostique.`,
      config: { temperature: 0.5, maxOutputTokens: 100 }
    });
    return response.text || "PadrÃµes normais detectados.";
  } catch (e) {
    return lang === 'pt' ? "Insights disponÃ­veis apenas online." : "Insights available online only.";
  }
};

export const getDailyVerse = async (isOnline: boolean, lang: 'pt' | 'en') => {
  if (!isOnline || !process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT') {
    return lang === 'pt' 
      ? { verse: "O Senhor Ã© o meu pastor, nada me faltarÃ¡.", reference: "Salmos 23:1" }
      : { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" };
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Um versÃ­culo bÃ­blico curto em ${lang === 'pt' ? 'PortuguÃªs' : 'InglÃªs'}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { verse: { type: Type.STRING }, reference: { type: Type.STRING } },
          required: ["verse", "reference"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return { verse: "Seja forte e corajoso.", reference: "JosuÃ© 1:9" };
  }
};