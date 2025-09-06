/**
 * financialAnalytics.js
 * Computes user spending patterns, budget usage, category summaries
 */

const financialAnalytics = {
  calculateSummary(transactions, budgets) {
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      categoryExpenses: {},
      budgetUsage: {},
    };

    transactions.forEach(tx => {
      if (tx.type === "income") summary.totalIncome += tx.amount;
      else if (tx.type === "expense") {
        summary.totalExpense += tx.amount;
        if (!summary.categoryExpenses[tx.category]) summary.categoryExpenses[tx.category] = 0;
        summary.categoryExpenses[tx.category] += tx.amount;
      }
    });

    budgets.forEach(b => {
      summary.budgetUsage[b.category] = summary.categoryExpenses[b.category] || 0;
    });

    return summary;
  }
};

export default financialAnalytics;
