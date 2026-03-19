import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeMedicalImage = async (base64Image: string, mimeType: string) => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            text: "You are a highly experienced radiologist. Analyze this medical image. Provide a detailed report including: 1. Type of image (X-ray, MRI, CT, etc.), 2. Key findings, 3. Potential abnormalities, 4. Suggested next steps. IMPORTANT: Include a strong disclaimer that this is an AI-generated analysis and must be verified by a human professional.",
          },
          {
            inlineData: {
              data: base64Image.split(",")[1],
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
  });

  return response.text;
};

export const summarizePatientRecord = async (record: string) => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          {
            text: `You are a medical assistant. Summarize the following patient record into a concise, professional clinical summary. Highlight: 1. Chief Complaint, 2. Relevant Medical History, 3. Current Medications, 4. Recent Lab Results (if any), 5. Assessment and Plan. Record: ${record}`,
          },
        ],
      },
    ],
  });

  return response.text;
};
