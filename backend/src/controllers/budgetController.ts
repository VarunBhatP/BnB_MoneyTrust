import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { notifyNewBudget } from '../utils/dashboardBroadcaster.js';

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).userId); // Convert to number

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: {
                  include: {
                    transaction: true // Changed from 'transactions' to 'transaction'
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
    const userId = parseInt((req as any).userId); // Convert to number

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
    const userId = parseInt((req as any).userId); // Convert to number

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id), // Convert to number
        userId 
      },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: {
                  include: {
                    transaction: true // Changed from 'transactions' to 'transaction'
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
    const userId = parseInt((req as any).userId); // Convert to number

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id), // Convert to number
        userId 
      }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: parseInt(id) }, // Convert to number
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
    const userId = parseInt((req as any).userId); // Convert to number

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id), // Convert to number
        userId 
      }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    await prisma.budget.delete({
      where: { id: parseInt(id) } // Convert to number
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
    const { budgetId, message, rating } = req.body; // Changed 'feedback' to 'message'
    const userId = parseInt((req as any).userId); // Convert to number

    if (!budgetId || !message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Budget ID and message are required'
      });
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        budgetId: parseInt(budgetId), // Convert to number
        message, // Use 'message' instead of 'feedback'
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
    const userId = parseInt((req as any).userId); // Convert to number

    const feedback = await prisma.feedback.findMany({
      where: { 
        budgetId: parseInt(budgetId), // Convert to number
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
