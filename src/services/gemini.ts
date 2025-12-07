import { GoogleGenAI } from "@google/genai";

const API_KEY = 'AIzaSyAJRE584JtNu3MkhafFA2Ej7kT9e_hw378';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface AIQuizResponse {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
  explanation: string;
}

export const generateGeminiQuiz = async (theme: string, numQuestions: number): Promise<AIQuizResponse[]> => {
  const prompt = `
      Create ${numQuestions} multiple-choice questions based on the following summary:
      "${theme}".

      The output should be in JSON format as follows:
      [
        {
          "question": "Question 1",
          "options": {
            "a": "Option A",
            "b": "Option B",
            "c": "Option C",
            "d": "Option D"
          },
          "answer": "a",
          "explanation": "Explanation for the correct answer."
        }
      ]
      Ensure the questions are clear and relevant to the summary provided. Randomly assign the correct answer to one of the options ('a', 'b', 'c', or 'd').
      Do NOT include any markdown formatting like \`\`\`json. Return ONLY the raw JSON string.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textResult = response.text || '[]';

    // Clean up potential markdown formatting just in case
    const cleanText = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error('Error generating quiz with Gemini:', error);
    // Fallback or re-throw could be handled here
    return [];
  }
};
