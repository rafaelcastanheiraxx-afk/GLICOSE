import { GoogleGenAI, Type } from "@google/genai";
import { VitalReading, VitalType } from "../types";

// Inicialização conforme diretrizes
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthObservations = async (readings: VitalReading[], lang: 'pt' | 'en') => {
  if (readings.length === 0) {
    return lang === 'pt' ? "Adicione leituras para análise." : "Add readings for analysis.";
  }

  const summary = readings.slice(0, 10).map(r => ({
    t: r.type,
    v: r.type === VitalType.BLOOD_PRESSURE ? `${r.systolic}/${r.value}` : r.value,
    m: r.moodEmoji,
    s: r.symptoms.join(',')
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise brevemente (máx 80 palavras) em ${lang === 'pt' ? 'Português' : 'Inglês'}: ${JSON.stringify(summary)}. Foco em tendências observacionais, sem diagnóstico.`,
      config: {
        temperature: 0.4,
        topP: 0.8,
      }
    });
    return response.text || (lang === 'pt' ? "Padrão estável observado." : "Stable pattern observed.");
  } catch (e) {
    console.error("AI Error:", e);
    return lang === 'pt' ? "Insights indisponíveis no momento." : "Insights currently unavailable.";
  }
};

export const getDailyVerse = async (isOnline: boolean, lang: 'pt' | 'en') => {
  if (!isOnline) {
    return lang === 'pt' 
      ? { verse: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" }
      : { verse: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um versículo bíblico encorajador em ${lang === 'pt' ? 'Português' : 'Inglês'}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING },
            reference: { type: Type.STRING },
          },
          required: ["verse", "reference"],
        },
      }
    });
    return JSON.parse(response.text || '{}');
  } catch {
    return { verse: "Seja forte e corajoso.", reference: "Josué 1:9" };
  }
};