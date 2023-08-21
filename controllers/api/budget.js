const router = require("express").Router();
const { User, Expense, Income, Budget } = require("../../models");
const { useAuth } = require("../../utils/auth");

// GET all budgets
router.get("/", useAuth, async (req, res) => {
  try {
    const budgetData = await Budget.findAll({
      attributes: [
        "id",
        "budget_name",
        "user_budget_id",
        "total_expense",
        "total_income",
        "total_savings",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          include: [
            {
              model: Income,
              attributes: ["id", "amount", "description", "category"],
            },
            {
              model: Expense,
              attributes: ["id", "amount", "description", "category"],
            },
          ],
        },
      ],
    });
    res.json(budgetData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single budget
router.get("/:id", useAuth, async (req, res) => {
  try {
    const singleBudget = await Budget.findOne({
      attributes: [
        "id",
        "budget_name",
        "total_expense",
        "total_income",
        "total_savings",
      ],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          include: [
            {
              model: Income,
              attributes: ["id", "amount", "description", "category"],
            },
            {
              model: Expense,
              attributes: ["id", "amount", "description", "category"],
            },
          ],
        },
      ],
    });
    res.json(singleBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET a single budget by user id
router.get("/:user/:budgetid", useAuth, async (req, res) => {
  try {
    const singleBudget = await Budget.findOne({
      attributes: [
        "id",
        "budget_name",
        "total_expense",
        "total_income",
        "total_savings",
      ],
      where: {
        user_budget_id: req.params.user,
        id: req.params.budgetid,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
          include: [
            {
              model: Income,
              attributes: ["id", "amount", "description", "category"],
            },
            {
              model: Expense,
              attributes: ["id", "amount", "description", "category"],
            },
          ],
        },
      ],
    });
    res.json(singleBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post("/:id", async (req, res) => {
try{
  const budgetCreate = await Budget.create(req.body, {
    where: {
      user_budget_id: req.params.id,
    }
  })
  res.status(200).json(budgetCreate);
} catch(err) {
  console.log(err);
  res.status(500).json(err);
}
})

// POST a new budget
router.post("/", useAuth, async (req, res) => {
  try {
    console.log(req.body.newBudgetName);
    const foundBudgets = await Budget.findAll({
      where: { user_budget_id: req.session.user_id },
    });

    if (foundBudgets.length !== 0) {
      const savedBudgets = foundBudgets.map((budget) =>
        budget.get({ plain: true })
      );

      const budgetNameExists = savedBudgets.some(
        (budget) => budget.budget_name === req.body.newBudgetName
      );

      
      const budgetMonthExists = savedBudgets.some(
        (budget) => budget.month === req.body.budgetMonth
      );

      console.log(budgetMonthExists);


 if (budgetNameExists) {
    res.status(401).json({ message: "Budget already exists!" });
    return;
  } else if (budgetMonthExists) { 
    const matchingBudget = await Budget.findOne({
      where: {
        user_budget_id: req.session.user_id,
        month: req.body.budgetMonth,
      },
    });
    const monthBudget =  await matchingBudget.get({ plain: true });
    console.log(monthBudget.id);
    if (monthBudget) {
      res.redirect(`/items/${monthBudget.id}`);
    }
  } else if (!req.body.budgetMonth) {
    res.status(402).json({ message: "Please select a month." });
    return;
  } else {
      console.log()
      const newBudget = await Budget.create({
      budget_name: req.body.newBudgetName,
      user_budget_id: req.session.user_id,
      month: req.body.budgetMonth
    });

    if (!newBudget) {
      res.status(401).json({ message: "Budget creation failed!" });
      console.error(err);
      return;
    }
    
    
    req.session.save(() => {
      req.session.budget_id = newBudget.id;
      req.session.budget_name = newBudget.budget_name;
      req.session.logged_in = true;
      res.status(200).json(newBudget);
    });
    }
  }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT update a budget
router.put("/:id", useAuth, async (req, res) => {
  try {
    const [incomeData, expenseData] = await Promise.all([
      Income.sum("amount", { where: { budget_id: req.session.budget_id } }),
      Expense.sum("amount", { where: { budget_id: req.session.budget_id } }),
    ]);
    const totalIncome = incomeData;
    const totalExpense = expenseData;
    const totalSavings = totalIncome - totalExpense;
    const createBudget = await Budget.update(
      {
        user_budget_id: req.session.user_id,
        total_income: totalIncome,
        total_expense: totalExpense,
        total_savings: totalSavings,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    console.log(createBudget);
    res.status(200).json(createBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a budget
router.delete("/:id", useAuth, async (req, res) => {
  try {
    const deleteBudget = await Budget.destroy({
      where: { id: req.params.id },
    });
    console.log(deleteBudget);
    if (!deleteBudget) {
      res.status(404).json({ message: "No budget found with this id!" });
      return;
    }
    res.status(200).json(deleteBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
