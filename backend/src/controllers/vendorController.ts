import type{ Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, projectId } = req.body;
    const userId = (req as any).userId;

    if (!name || !projectId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name and projectId are required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { department: { include: { budget: true } } },
    });

    if (!project || project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to add vendor to this project' });
    }

    const vendor = await prisma.vendor.create({
      data: { name, projectId },
    });

    res.status(StatusCodes.CREATED).json(vendor);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create vendor' });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Vendors under projects where owner matches user
    const vendors = await prisma.vendor.findMany({
      where: {
        project: {
          department: {
            budget: {
              userId,
            },
          },
        },
      },
    });

    res.json(vendors);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch vendors' });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: { project: { include: { department: { include: { budget: true } } } } },
    });

    if (!vendor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });
    }

    if (vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to view this vendor' });
    }

    res.json(vendor);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch vendor' });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const userId = (req as any).userId;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Name is required' });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: { project: { include: { department: { include: { budget: true } } } } },
    });

    if (!vendor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });
    }

    if (vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to update this vendor' });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: { name },
    });

    res.json(updatedVendor);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update vendor' });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = (req as any).userId;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: { project: { include: { department: { include: { budget: true } } } } },
    });

    if (!vendor) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Vendor not found' });
    }

    if (vendor.project.department.budget.userId !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized to delete this vendor' });
    }

    await prisma.vendor.delete({ where: { id } });
    res.status(StatusCodes.NO_CONTENT).json({message:"Deleted vendor"});
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete vendor' });
  }
};
