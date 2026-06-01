import { Request, Response, NextFunction } from 'express';
import { getCachedUserProfile, getCachedUserRepos, getCachedUserStats } from '../services/githubCacheService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const { data, cached, timestamp } = await getCachedUserProfile(username);
    return sendSuccess(res, data, 'User retrieved successfully', 200, { cached, timestamp });
  } catch (error) {
    next(error);
  }
};

export const getRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const { data, cached, timestamp } = await getCachedUserRepos(username);
    return sendSuccess(res, data, 'Repositories retrieved successfully', 200, { cached, timestamp });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const { data, cached, timestamp } = await getCachedUserStats(username);
    return sendSuccess(res, data, 'User stats retrieved successfully', 200, { cached, timestamp });
  } catch (error) {
    next(error);
  }
};
