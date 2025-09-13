import { Request, Response } from 'express';
import { aiService } from '../utils/aiService.js';
import { StatusCodes } from 'http-status-codes';

export const getAIHealth = async (req: Request, res: Response) => {
  try {
    console.log('Checking AI health...');
    const health = await aiService.getHealthStats();
    res.json(health);
  } catch (error: any) {
    console.error('AI health check failed:', error.message);
    
    // Return offline status instead of error
    res.json({
      status: 'offline',
      message: 'AI service temporarily unavailable',
      uptime_seconds: 0,
      models_loaded: []
    });
  }
};

export const budgetQuery = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Query text is required and cannot be empty'
      });
    }

    // Limit query length to prevent issues
    const limitedText = text.substring(0, 1000);
    console.log(`Processing AI query: "${limitedText.substring(0, 50)}..."`);

    const result = await aiService.voiceTextQuery({ text: limitedText });
    res.json(result);
  } catch (error: any) {
    console.error('Budget query failed:', error.message);
    
    // Return fallback response instead of throwing error
    res.json({
      answer: "I'm sorry, I'm currently unable to process your query due to a temporary service issue. Please try again in a moment.",
      confidence: 0,
      keywords_detected: [],
      intent: 'fallback',
      processing_time: 0
    });
  }
};

export const analyzeTransaction = async (req: Request, res: Response) => {
  try {
    const { transactions } = req.body;
    
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Transactions array is required and cannot be empty'
      });
    }

    console.log(`Analyzing ${transactions.length} transactions`);
    const result = await aiService.analyzeTransactions({ transactions });
    res.json(result);
  } catch (error: any) {
    console.error('Transaction analysis failed:', error.message);
    
    // Fix: Get transactions from req.body in error handler
    const { transactions } = req.body;
    const transactionsArray = Array.isArray(transactions) ? transactions : [];
    
    // Return safe fallback - mark all as normal
    res.json({
      results: transactionsArray.map((_, index) => ({
        transaction_index: index,
        is_anomaly: false,
        anomaly_score: 0.1,
        reasons: ['AI analysis temporarily unavailable']
      }))
    });
  }
};
