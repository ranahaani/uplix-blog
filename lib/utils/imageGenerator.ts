import { GoogleGenAI } from "@google/genai";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateBlogImage = async (
  title: string,
  style: string = "modern, professional, tech",
  ratio: AspectRatio = "16:9"
): Promise<string | null> => {
  try {
    const prompt = `Design a high-quality, professional blog cover image for an article titled: "${title}". 
    The visual style should be: ${style}. 
    Create a compelling composition that represents the subject matter abstractly or symbolically. 
    Make it suitable for a web header. 
    Ensure high visual fidelity and aesthetic appeal.
    Use vibrant greens (#32B028) as accent colors where appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: ['image', 'text'],
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      console.error("No candidates in response");
      return null;
    }

    const parts = candidates[0].content?.parts;
    if (!parts) {
      console.error("No parts in response");
      return null;
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64EncodeString = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64EncodeString}`;
      }
    }

    console.error("Response contained no image data");
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    return null;
  }
};

