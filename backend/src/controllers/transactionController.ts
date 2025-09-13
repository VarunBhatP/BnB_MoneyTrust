import type{ Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';
import { broadcast } from '../index.js';
import { broadcastDashboardSummary } from '../utils/dashboardBroadcaster.js';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, description, date, vendorId } = req.body;
    const userId = (req as any).userId;

    if (amount === undefined || vendorId === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Amount and vendorId are required' });
    }

    
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { project: { include: { department: { include: { budget: true } } } } },
    });

    if (!vendor || vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to add transaction for this vendor' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        vendorId,
      },
    });
    broadcast({ type: 'transaction_created', payload: transaction });
    await broadcastDashboardSummary();
    res.status(StatusCodes.CREATED).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create transaction' });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const transactions = await prisma.transaction.findMany({
      where: {
        vendor: {
          project: {
            department: {
              budget: {
                userId,
              },
            },
          },
        },
      },
      include: { vendor: true },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch transactions' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { vendor: { include: { project: { include: { department: { include: { budget: true } } } } } } },
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Transaction not found' });
    }

    if (transaction.vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to view this transaction' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { amount, description, date } = req.body;
    const userId = (req as any).userId;

    if (amount === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Amount is required' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { vendor: { include: { project: { include: { department: { include: { budget: true } } } } } } },
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Transaction not found' });
    }

    if (transaction.vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to update this transaction' });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        description,
        
      },
    });
    broadcast({ type: 'transaction_updated', payload: updatedTransaction });
    await broadcastDashboardSummary();
    res.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { vendor: { include: { project: { include: { department: { include: { budget: true } } } } } } },
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Transaction not found' });
    }

    if (transaction.vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this transaction' });
    }

    await prisma.transaction.delete({ where: { id } });
    broadcast({ type: 'transaction_deleted', payload: { id } });
    await broadcastDashboardSummary();
    res.status(StatusCodes.NO_CONTENT).json({message:"Deleted Transaction"});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete transaction' });
  }
};
