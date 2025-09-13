import type { Request, Response } from "express";
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from "http-status-codes";
import { broadcast } from '../index.js';
import { broadcastDashboardSummary } from '../utils/dashboardBroadcaster.js';


export const createBudget = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).userId;
    if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });

    const budget = await prisma.budget.create({ data: { name, userId } });

    // Broadcast newly created budget
    broadcast({ type: 'budget_created', payload: budget });
    await broadcastDashboardSummary(); 
    res.status(StatusCodes.CREATED).json(budget);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create budget' });
  }
};

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { departments: true },
    });
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch budgets' });
  }
};

export const getBudgetById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
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
    if (!budget) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch budget' });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid budget ID' });
    }

    const { name } = req.body;
    if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });

    const userId = (req as any).userId;

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Budget not found' });
    }
    if (existingBudget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to update this budget' });
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: { name },
    });

    // Broadcast updated budget
    broadcast({ type: 'budget_updated', payload: budget });
    await broadcastDashboardSummary();
    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid budget ID' });
    }

    const userId = (req as any).userId;

    // Verify ownership
    const existingBudget = await prisma.budget.findUnique({ where: { id } });
    if (!existingBudget) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Budget not found' });
    }
    if (existingBudget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this budget' });
    }

    await prisma.budget.delete({ where: { id } });

    // Broadcast deleted budget ID
    broadcast({ type: 'budget_deleted', payload: { id } });
    await broadcastDashboardSummary();
    res.status(StatusCodes.NO_CONTENT).json({ message: "Deleted Budget" });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete budget' });
  }
};
