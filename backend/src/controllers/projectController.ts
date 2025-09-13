import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, departmentId } = req.body;
    const userId = (req as any).userId;

    if (!name || !departmentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name and departmentId are required' });
    }

    
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      include: { budget: true },
    });

    if (!department || department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to add project to this department' });
    }

    const project = await prisma.project.create({
      data: { name, departmentId },
    });

    res.status(StatusCodes.CREATED).json(project);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create project' });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    
    const projects = await prisma.project.findMany({
      where: {
        department: {
          budget: {
            userId,
          },
        },
      },
      include: { vendors: true },
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { vendors: true, department: { include: { budget: true } } },
    });

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    if (project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const userId = (req as any).userId;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { department: { include: { budget: true } } },
    });

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    if (project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { department: { include: { budget: true } } },
    });

    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Project not found' });
    }

    if (project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this project' });
    }

    await prisma.project.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).json({message:"Deleted project successfully"});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete project' });
  }
};
