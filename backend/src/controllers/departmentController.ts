import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const sampleDepartments = [
  { id: '1', name: 'Education', budgetId: '1' },
  { id: '2', name: 'Healthcare', budgetId: '2' },
  { id: '3', name: 'Infrastructure', budgetId: '3' },
];

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    res.json(sampleDepartments);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, budgetId } = req.body;
    
    const newDepartment = {
      id: (sampleDepartments.length + 1).toString(),
      name,
      budgetId
    };
    
    sampleDepartments.push(newDepartment);
    res.status(StatusCodes.CREATED).json(newDepartment);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create department',
      error: error.message
    });
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const department = sampleDepartments.find(d => d.id === id);
    
    if (!department) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Department not found'
      });
    }
    
    res.json(department);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch department',
      error: error.message
    });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const deptIndex = sampleDepartments.findIndex(d => d.id === id);
    if (deptIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Department not found'
      });
    }
    
    sampleDepartments[deptIndex] = { ...sampleDepartments[deptIndex], name };
    res.json(sampleDepartments[deptIndex]);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update department',
      error: error.message
    });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deptIndex = sampleDepartments.findIndex(d => d.id === id);
    
    if (deptIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Department not found'
      });
    }
    
    sampleDepartments.splice(deptIndex, 1);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to delete department',
      error: error.message
    });
  }
};
