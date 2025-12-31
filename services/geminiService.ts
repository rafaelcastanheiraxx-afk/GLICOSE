import { GoogleGenAI, Type } from "@google/genai";
import { VitalReading, VitalType } from "../types.ts";

export const getHealthObservations = async (readings: VitalReading[], lang: 'pt' | 'en') => {
  const apiKey = process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT';
  if (!apiKey || readings.length === 0) return lang === 'pt' ? "Adicione dados para anÃÂÃÂ¡lise inteligente." : "Add data for smart analysis.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const summary = readings.slice(0, 5).map(r => `${r.type}: ${r.value} (${r.moodEmoji})`);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise estes dados de saÃÂÃÂºde de forma ÃÂÃÂ©tica e curta em ${lang === 'pt' ? 'PortuguÃÂÃÂªs' : 'InglÃÂÃÂªs'}: ${summary.join(', ')}. NÃÂÃÂ£o diagnostique.`,
      config: { temperature: 0.5, maxOutputTokens: 100 }
    });
    return response.text || "PadrÃÂÃÂµes normais detectados.";
  } catch (e) {
    return lang === 'pt' ? "Insights disponÃÂÃÂ­veis apenas online." : "Insights available online only.";
  }
};

export const getDailyVerse = async (isOnline: boolean, lang: 'pt' | 'en') => {
  if (!isOnline || !process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT') {
    return lang === 'pt' 
      ? { verse: "O Senhor ÃÂÃÂ© o meu pastor, nada me faltarÃÂÃÂ¡.", reference: "Salmos 23:1" }
      : { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" };
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Um versÃÂÃÂ­culo bÃÂÃÂ­blico curto em ${lang === 'pt' ? 'PortuguÃÂÃÂªs' : 'InglÃÂÃÂªs'}.`,
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
    return { verse: "Seja forte e corajoso.", reference: "JosuÃÂÃÂ© 1:9" };
  }
};