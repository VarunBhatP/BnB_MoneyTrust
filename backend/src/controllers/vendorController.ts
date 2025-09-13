import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Sample vendor data since we don't have full database setup
const sampleVendors = [
  { id: '1', name: 'ABC Construction', contactEmail: 'contact@abc.com', projectId: '1' },
  { id: '2', name: 'XYZ Medical Supplies', contactEmail: 'info@xyz.com', projectId: '2' },
  { id: '3', name: 'Education Plus', contactEmail: 'sales@eduplus.com', projectId: '3' },
];

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    res.json(sampleVendors);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch vendors',
      error: error.message
    });
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const { name, contactEmail, projectId } = req.body;
    
    const newVendor = {
      id: (sampleVendors.length + 1).toString(),
      name,
      contactEmail,
      projectId
    };
    
    sampleVendors.push(newVendor);
    res.status(StatusCodes.CREATED).json(newVendor);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create vendor',
      error: error.message
    });
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = sampleVendors.find(v => v.id === id);
    
    if (!vendor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Vendor not found'
      });
    }
    
    res.json(vendor);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch vendor',
      error: error.message
    });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, contactEmail } = req.body;
    
    const vendorIndex = sampleVendors.findIndex(v => v.id === id);
    if (vendorIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Vendor not found'
      });
    }
    
    sampleVendors[vendorIndex] = { ...sampleVendors[vendorIndex], name, contactEmail };
    res.json(sampleVendors[vendorIndex]);
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update vendor',
      error: error.message
    });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorIndex = sampleVendors.findIndex(v => v.id === id);
    
    if (vendorIndex === -1) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Vendor not found'
      });
    }
    
    sampleVendors.splice(vendorIndex, 1);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to delete vendor',
      error: error.message
    });
  }
};
