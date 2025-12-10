import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
      Create ${numQuestions} multiple-choice vocabulary questions specifically centered around the word/phrase: "${theme}".
      
      The questions should test aspects like:
      1. The meaning/definition of "${theme}".
      2. The correct usage of "${theme}" in a sentence.
      3. Synonyms, antonyms, or specific context related to "${theme}".

      IMPORTANT LANGUAGE INSTRUCTIONS:
      - The explanation field MUST be in English to help the learner understand.
      - If the question contains a Chinese sentence, you MUST include the English translation (and Pinyin if helpful) within the question text.
      - The goal is to help an English speaker learn the Chinese word "${theme}".

      The output should be in JSON format as follows:
      [
        {
          "question": "Question text (include English translation if the question is in Chinese)",
          "options": {
            "a": "Option A",
            "b": "Option B",
            "c": "Option C",
            "d": "Option D"
          },
          "answer": "a",
          "explanation": "Explanation in English explaining why the answer is correct."
        }
      ]

      Ensure the questions are strictly relevant to the word "${theme}". Randomly assign the correct answer to one of the options ('a', 'b', 'c', or 'd').
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

export interface AIExampleResponse {
  sentence: string;
  pinyin: string;
  translation: string;
}

export const generateGeminiExamples = async (word: string, meaning: string): Promise<AIExampleResponse[]> => {
  const prompt = `
      Create 3 example sentences in Chinese using the word "${word}" (Meaning: ${meaning}).
      
      The output should be in JSON format as follows:
      [
        {
          "sentence": "Chinese sentence using the word",
          "pinyin": "Pinyin of the sentence",
          "translation": "English translation"
        }
      ]
      
      KEY CONCEPTS TO INCLUDE:
      1.AspectParticles (了/过): Use sentences demonstrating 'le' (completion) and 'guo' (experience).
      2.MeasureWords (个/本): Use sentences demonstrating 'gè' and 'běn'.
      3.ModalVerbs (会/想): Use sentences demonstrating 'huì' (ability/future) and 'xiǎng' (want).
      4.TimeAdverbs (昨天/明天): Use sentences demonstrating 'zuótiān' (yesterday) and 'míngtiān' (tomorrow).
      5.PossessionStructure (的): Use sentences demonstrating 'de' (possession/attribute).
      Ensure the sentences are simple and helpful for learners.
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
    console.error('Error generating examples with Gemini:', error);
    return [];
  }
};
