import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { aiService } from '../utils/aiService.js';

export const proxyBudgetQuery = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'text field is required' });
    }

    const result = await aiService.voiceTextQuery({ text });
    return res.json(result);
  } catch (error: any) {
    console.error('AI budget query error', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || 'AI service error' });
  }
};

export const proxyAnalyzeTransaction = async (req: Request, res: Response) => {
  try {
    const { transactions } = req.body;
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'transactions array is required' });
    }

    const result = await aiService.analyzeTransactions({ transactions });
    return res.json(result);
  } catch (error: any) {
    console.error('AI analyze transaction error', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || 'AI service error' });
  }
};

export const getAIHealth = async (_req: Request, res: Response) => {
  try {
    const stats = await aiService.getHealthStats();
    res.json(stats);
  } catch (error: any) {
    console.error('AI health stats error', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message || 'AI service error' });
  }
};