import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, budgetId } = req.body;
    const userId = (req as any).userId;

    if (!name || !budgetId)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name and budgetId are required' });

    // Verify that the budget belongs to authenticated user
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });
    if (!budget || budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to add department to this budget' });
    }

    const department = await prisma.department.create({
      data: { name, budgetId },
    });
    res.status(StatusCodes.CREATED).json(department);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create department' });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get departments only for budgets owned by user
    const departments = await prisma.department.findMany({
      where: {
        budget: {
          userId,
        },
      },
      include: { projects: true },
    });
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch departments' });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const department = await prisma.department.findUnique({
      where: { id },
      include: { projects: { include: { vendors: true } }, budget: true },
    });
    if (!department) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });

    if (department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to view this department' });
    }
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch department' });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const userId = (req as any).userId;

    if (!name) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });

    // Verify ownership through budget
    const department = await prisma.department.findUnique({
      where: { id },
      include: { budget: true },
    });
    if (!department) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
    if (department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to update this department' });
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: { name },
    });
    res.json(updatedDepartment);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update department' });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const department = await prisma.department.findUnique({
      where: { id },
      include: { budget: true },
    });
    if (!department) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Department not found' });
    if (department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this department' });
    }

    await prisma.department.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).json({message:'Deleted the department'});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete department' });
  }
};
