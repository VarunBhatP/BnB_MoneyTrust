import type { Request, Response } from "express";
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from "http-status-codes";
import { broadcast } from '../index.js';
import { broadcastDashboardSummary } from '../utils/dashboardBroadcaster.js';

const safeBroadcastDashboardSummary = async () => {
  try {
    await broadcastDashboardSummary();
  } catch (error) {
    console.error('Error broadcasting dashboard summary:', error);
  }
};

export const createBudget = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).userId;
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Name is required' });
    }

    const budget = await prisma.budget.create({ data: { name, userId } });

    try {
      broadcast({ type: 'budget_created', payload: budget });
      await safeBroadcastDashboardSummary();
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
    }

    res.status(StatusCodes.CREATED).json({ success: true, data: budget });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to create budget' });
  }
};

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { departments: true },
    });
    res.json({ success: true, data: budgets });
  } catch (error) {
    console.error('Get all budgets error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to fetch budgets' });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid budget ID' });
    }
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            projects: {
              include: { vendors: true },
            },
          },
        },
      },
    });
    if (!budget) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, data: budget });
  } catch (error) {
    console.error('Get budget by ID error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to fetch budget' });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid budget ID' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Name is required' });
    }

    const userId = (req as any).userId;

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Budget not found' });
    }
    if (existingBudget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to update this budget' });
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: { name },
    });

    try {
      broadcast({ type: 'budget_updated', payload: budget });
      await safeBroadcastDashboardSummary();
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid budget ID' });
    }

    const userId = (req as any).userId;

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Budget not found' });
    }
    if (existingBudget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: 'Not authorized to delete this budget' });
    }

    await prisma.budget.delete({ where: { id } });

    try {
      broadcast({ type: 'budget_deleted', payload: { id } });
      await safeBroadcastDashboardSummary();
    } catch (broadcastError) {
      console.error('Broadcast error:', broadcastError);
    }

    res.status(StatusCodes.NO_CONTENT).json({ success: true, message: 'Deleted Budget' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to delete budget' });
  }
};

export const addFeedback = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Request body missing' });
    }

    const budgetId = Number(req.params.id);
    if (isNaN(budgetId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid budget id' });
    }

    const { comment } = req.body;
    if (!comment || typeof comment !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Comment text is required' });
    }

    const budgetExists = await prisma.budget.findUnique({ where: { id: budgetId } });
    if (!budgetExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Budget does not exist' });
    }

    const userId = (req as any).userId || null;

    const feedback = await prisma.feedback.create({
      data: {
        budgetId,
        userId,
        comment,
      },
    });

    res.status(StatusCodes.CREATED).json({ success: true, data: feedback });
  } catch (error) {
    console.error('Add feedback error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to add feedback' });
  }
};


export const getFeedback = async (req: Request, res: Response) => {
  try {
    const budgetId = Number(req.params.id);
    if (Number.isNaN(budgetId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid budget id' });
    }

    const feedbackList = await prisma.feedback.findMany({
      where: { budgetId },
      include: { user: { select: { id: true, email: true } } }, // optional user info
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: feedbackList });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to fetch feedback' });
  }
};
