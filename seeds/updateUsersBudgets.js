const { Budget, Income, Expense } = require("../models");

const updateBudgets = async () => {
  try {
    const budgets = await Budget.findAll();

    for (const budget of budgets) {
      const incomes = await Income.findAll({
        where: { user_income_id: budget.user_budget_id, budget_id: budget.id },
      });

      const expenses = await Expense.findAll({
        where: { user_expense_id: budget.user_budget_id, budget_id: budget.id },
      });

      const totalIncome = incomes.reduce(
        (sum, income) => sum + parseFloat(income.amount),
        0
      );
      const totalExpense = expenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      const totalSavings = totalIncome - totalExpense;

      await Budget.update(
        {
          total_income: totalIncome,
          total_expense: totalExpense,
          total_savings: totalSavings,
        },
        {
          where: { id: budget.id },
        }
      );
    }

    console.log("Budgets updated successfully.");
  } catch (error) {
    console.error("Error updating budgets:", error);
  }
};

module.exports = updateBudgets;
