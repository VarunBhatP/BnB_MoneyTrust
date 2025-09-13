import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { notifyNewBudget } from '../utils/dashboardBroadcaster.js';

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: {
                  include: {
                    transactions: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(budgets);
  } catch (error: any) {
    console.error('Error fetching budgets:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch budgets',
      error: error.message
    });
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).userId;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Budget name is required'
      });
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        userId
      }
    });

    // Notify dashboard
    notifyNewBudget(budget);

    res.status(StatusCodes.CREATED).json(budget);
  } catch (error: any) {
    console.error('Error creating budget:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create budget',
      error: error.message
    });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const budget = await prisma.budget.findFirst({
      where: { 
        id,
        userId 
      },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: {
                  include: {
                    transactions: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    res.json(budget);
  } catch (error: any) {
    console.error('Error fetching budget:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch budget',
      error: error.message
    });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = (req as any).userId;

    const budget = await prisma.budget.findFirst({
      where: { id, userId }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: { name }
    });

    res.json(updatedBudget);
  } catch (error: any) {
    console.error('Error updating budget:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update budget',
      error: error.message
    });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const budget = await prisma.budget.findFirst({
      where: { id, userId }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    await prisma.budget.delete({
      where: { id }
    });

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error: any) {
    console.error('Error deleting budget:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to delete budget',
      error: error.message
    });
  }
};

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { budgetId, feedback, rating } = req.body;
    const userId = (req as any).userId;

    if (!budgetId || !feedback) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Budget ID and feedback are required'
      });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        budgetId,
        feedback,
        rating: rating || 0,
        userId
      }
    });

    res.status(StatusCodes.CREATED).json(newFeedback);
  } catch (error: any) {
    console.error('Error adding feedback:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to add feedback',
      error: error.message
    });
  }
};

export const getFeedback = async (req: Request, res: Response) => {
  try {
    const { budgetId } = req.params;
    const userId = (req as any).userId;

    const feedback = await prisma.feedback.findMany({
      where: { 
        budgetId,
        userId 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(feedback);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};
