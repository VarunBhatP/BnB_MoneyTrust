import { prisma } from './prisma.js';
import { broadcast } from '../index.js';

export const broadcastDashboardSummary = async () => {
  // Aggregate total expenses per budget, as an example
  const budgets = await prisma.budget.findMany({
    include: {
      departments: {
        include: {
          projects: {
            include: {
              vendors: {
                include: {
                  transaction: true,
                },
              },
            },
          },
        },
      },
    },
  });

const summary = budgets.map((budget: any) => {
    let totalAmount = 0;
    for (const dept of budget.departments) {
      for (const proj of dept.projects) {
        for (const vendor of proj.vendors) {
          totalAmount += vendor.transaction.reduce((acc: number, t: any) => acc + t.amount,0);
        }
      }
    }
    return { budgetId: budget.id, budgetName: budget.name, totalAmount };
  });

  broadcast({ type: 'dashboard_summary_updated', payload: summary });
};
