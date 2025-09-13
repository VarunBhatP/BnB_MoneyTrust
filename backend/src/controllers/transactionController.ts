import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { aiService } from '../utils/aiService.js';
import { StatusCodes } from 'http-status-codes';
import { notifyNewTransaction, notifyAnomaly } from '../utils/dashboardBroadcaster.js';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, vendorId, description, date } = req.body;
    const userId = parseInt((req as any).userId); // Convert to number

    // Validate required fields
    if (!amount || !vendorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Amount and vendor are required'
      });
    }

    // Get vendor details for AI analysis
    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(vendorId) }, // Convert to number
      include: {
        project: {
          include: {
            department: true
          }
        }
      }
    });

    if (!vendor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Vendor not found'
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description: description || null,
        date: date ? new Date(date) : new Date(),
        vendorId: parseInt(vendorId), // Convert to number
      },
      include: {
        vendor: {
          include: {
            project: {
              include: {
                department: true
              }
            }
          }
        }
      }
    });

    // AI Analysis
    let aiAnalysis = null;
    try {
      const aiPayload = {
        amount: transaction.amount,
        department_id: vendor.project.department.id, // Already a number
        vendor_name: vendor.name,
        transaction_date: transaction.date.toISOString().split('T')[0]
      };

      aiAnalysis = await aiService.detectAnomaly(aiPayload);
    } catch (aiError) {
      console.log('AI analysis failed, continuing without it:', aiError);
    }

    // Add AI analysis to response
    const transactionResponse = {
      ...transaction,
      isAnomalous: aiAnalysis?.is_anomaly || false,
      riskScore: aiAnalysis?.anomaly_score || 0,
      anomalyDetail: aiAnalysis ? {
        is_anomaly: aiAnalysis.is_anomaly,
        anomaly_score: aiAnalysis.anomaly_score,
        reasons: aiAnalysis.reasons || []
      } : null
    };

    // Notify dashboard
    notifyNewTransaction(transactionResponse);

    // If anomaly detected, notify
    if (aiAnalysis?.is_anomaly) {
      notifyAnomaly(transactionResponse);
    }

    res.status(StatusCodes.CREATED).json(transactionResponse);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const userId = parseInt((req as any).userId); // Convert to number

    const transactions = await prisma.transaction.findMany({
      include: {
        vendor: {
          include: {
            project: {
              include: {
                department: {
                  include: {
                    budget: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(transactions);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt((req as any).userId); // Convert to number

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) }, // Convert to number
      include: {
        vendor: {
          include: {
            project: {
              include: {
                department: {
                  include: {
                    budget: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Transaction not found'
      });
    }

    res.json(transaction);
  } catch (error: any) {
    console.error('Error fetching transaction:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, date } = req.body;
    const userId = parseInt((req as any).userId); // Convert to number

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) } // Convert to number
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Transaction not found'
      });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) }, // Convert to number
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        description: description !== undefined ? description : undefined,
        date: date ? new Date(date) : undefined,
      },
      include: {
        vendor: {
          include: {
            project: {
              include: {
                department: true
              }
            }
          }
        }
      }
    });

    res.json(updatedTransaction);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to update transaction',
      error: error.message
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt((req as any).userId); // Convert to number

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) } // Convert to number
    });

    if (!transaction) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Transaction not found'
      });
    }

    await prisma.transaction.delete({
      where: { id: parseInt(id) } // Convert to number
    });

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to delete transaction',
      error: error.message
    });
  }
};
