
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

export const getMusicRecommendations = async (theme: string): Promise<Song[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    당신은 버스나 지하철을 이용하는 사람들을 위한 음악 전문 큐레이터입니다.
    사용자가 입력한 테마나 장르에 맞춰 정확히 7곡의 노래를 추천하세요.
    비율은 반드시 한국 노래 5곡, 해외 노래 2곡(약 7:3 비율)으로 구성해야 합니다.
    각 노래에 대해 왜 이 곡이 출퇴근 길에 적합한지 한국어로 따뜻하고 친근하게 설명(reason)을 적어주세요.
    예: "만원 지하철에서도 마음을 차분하게 해주는 곡입니다", "아침 버스 안에서 활기찬 에너지를 채워줄 거예요".
    결과는 반드시 지정된 JSON 형식으로 출력하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 테마에 맞는 7곡을 추천해줘: "${theme}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '노래 제목' },
                  artist: { type: Type.STRING, description: '가수 이름' },
                  isKorean: { type: Type.BOOLEAN, description: '한국 노래면 true, 해외 노래면 false' },
                  reason: { type: Type.STRING, description: '출퇴근에 어울리는 이유 (한국어)' },
                  genre: { type: Type.STRING, description: '음악 장르' }
                },
                required: ['title', 'artist', 'isKorean', 'reason', 'genre']
              }
            }
          },
          required: ['songs']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from Gemini API");
    
    const parsed = JSON.parse(resultText);
    return parsed.songs;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
