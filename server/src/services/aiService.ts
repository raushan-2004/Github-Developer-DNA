import axios from 'axios';
import { AppError } from '../utils/errors';
import { CareerReviewResult } from '../types/ai';

export const generateCareerReview = async (profileData: any): Promise<CareerReviewResult> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AppError('Gemini API key is not configured', 500);
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

    const prompt = `
      You are an expert tech career advisor and senior engineering manager.
      Analyze the following developer profile data and provide a career review.
      
      Profile Data:
      ${JSON.stringify(profileData, null, 2)}
      
      Return a JSON object strictly matching this schema:
      {
        "careerSummary": "A short 2-sentence summary of their current career standing",
        "strengths": ["strength 1", "strength 2", "strength 3"],
        "weaknesses": ["area for improvement 1", "area for improvement 2"],
        "suggestedTechnologies": ["tech 1", "tech 2"],
        "suggestedCareerPath": "E.g., Senior Full Stack Engineer, Open Source Maintainer, etc.",
        "resumeRecommendations": ["recommendation 1", "recommendation 2"]
      }
      
      Do not include markdown blocks like \`\`\`json. Just return the raw JSON object.
    `;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      }
    });

    const textResult = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      throw new AppError('Invalid response from Gemini API', 502);
    }

    try {
      // Clean up potential markdown formatting just in case
      const cleanJsonStr = textResult.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResult: CareerReviewResult = JSON.parse(cleanJsonStr);
      return parsedResult;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textResult);
      throw new AppError('Failed to parse AI response as JSON', 502);
    }

  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new AppError('Failed to generate AI career review', 500);
  }
};
