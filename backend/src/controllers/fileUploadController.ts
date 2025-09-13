import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import XLSX from 'xlsx';
import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { StatusCodes } from 'http-status-codes';

export const uploadBudgetData = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'File is required' });
  }

  const filePath = path.resolve(req.file.path);
  const userId = (req as any).userId;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    let rows: any[] = [];

    if (ext === '.csv') {
      // Parse CSV
      rows = await new Promise<any[]>((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } else if (ext === '.xls' || ext === '.xlsx') {
      // Parse Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames && workbook.SheetNames.length > 0 ? workbook.SheetNames[0] : undefined;
      if (!sheetName) {
        throw new Error('No sheets found in the uploaded Excel file.');
      }
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error('Worksheet not found in the uploaded Excel file.');
      }
      rows = XLSX.utils.sheet_to_json(worksheet);
    } else {
      throw new Error('Unsupported file type. Please upload CSV or Excel file.');
    }

    // Increase timeout to 30 seconds to prevent timeout error on large files
    await prisma.$transaction(
      async (tx: typeof prisma) => {
        for (const row of rows) {
          // Validate required fields
          if (!row.budgetName || !row.departmentName || !row.projectName || !row.vendorName || !row.amount) {
            throw new Error('Missing required fields in uploaded data');
          }

          // Trim strings to avoid duplicates due to whitespace
          const budgetName = String(row.budgetName).trim();
          const departmentName = String(row.departmentName).trim();
          const projectName = String(row.projectName).trim();
          const vendorName = String(row.vendorName).trim();

          // Create or find Budget
          let budget = await tx.budget.findFirst({ where: { name: budgetName, userId } });
          if (!budget) {
            budget = await tx.budget.create({ data: { name: budgetName, userId } });
          }

          // Create or find Department
          let department = await tx.department.findFirst({
            where: { name: departmentName, budgetId: budget.id },
          });
          if (!department) {
            department = await tx.department.create({ data: { name: departmentName, budgetId: budget.id } });
          }

          // Create or find Project
          let project = await tx.project.findFirst({
            where: { name: projectName, departmentId: department.id },
          });
          if (!project) {
            project = await tx.project.create({ data: { name: projectName, departmentId: department.id } });
          }

          // Create or find Vendor
          let vendor = await tx.vendor.findFirst({
            where: { name: vendorName, projectId: project.id },
          });
          if (!vendor) {
            vendor = await tx.vendor.create({ data: { name: vendorName, projectId: project.id } });
          }

          // Create Transaction
          await tx.transaction.create({
            data: {
              amount: parseFloat(row.amount),
              description: row.description || null,
              
              vendorId: vendor.id,
            },
          });
        }
      },
      { timeout: 30000 } // 30 seconds timeout
    );

    // Delete uploaded file after success
    fs.unlinkSync(filePath);

    res.json({ message: 'Budget data uploaded and processed successfully' });
  } catch (error: any) {
    console.error('Error processing uploaded file:', error);

    // Delete file even on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to process uploaded budget data',
      error: error.message || error.toString(),
    });
  }
};
