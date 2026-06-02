import { Request, Response, NextFunction } from 'express';
import { generateCareerReview } from '../services/aiService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const getAiCareerReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileData = req.body;
    
    if (!profileData || Object.keys(profileData).length === 0) {
      throw new AppError('Profile data is required for AI review', 400);
    }

    const reviewResult = await generateCareerReview(profileData);
    
    return sendSuccess(res, reviewResult, 'AI Career Review generated successfully', 200);
  } catch (error) {
    next(error);
  }
};
