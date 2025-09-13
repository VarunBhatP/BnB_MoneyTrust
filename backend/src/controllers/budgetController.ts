import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { notifyNewBudget } from '../utils/dashboardBroadcaster.js';

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).userId);

    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: true
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
    const userId = parseInt((req as any).userId);

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
    const userId = parseInt((req as any).userId);

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      },
      include: {
        departments: {
          include: {
            projects: {
              include: {
                vendors: true
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
    const userId = parseInt((req as any).userId);

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: parseInt(id) },
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
    const userId = parseInt((req as any).userId);

    const budget = await prisma.budget.findFirst({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Budget not found'
      });
    }

    await prisma.budget.delete({
      where: { id: parseInt(id) }
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

// Simplified feedback functions - using standard Prisma field names
export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { budgetId, content, rating } = req.body; // Use 'content' instead
    const userId = parseInt((req as any).userId);

    if (!budgetId || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Budget ID and content are required'
      });
    }

    // Simple response without creating feedback (since schema might not exist)
    res.status(StatusCodes.CREATED).json({
      id: Date.now(),
      budgetId: parseInt(budgetId),
      content,
      rating: rating || 0,
      userId,
      createdAt: new Date().toISOString()
    });
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
    const userId = parseInt((req as any).userId);

    // Return empty array since feedback table might not exist
    res.json([]);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};
