const router = require("express").Router();
const { User, Expense } = require("../../models");
const { useAuth } = require("../../utils/auth");

// GET all expenses
router.get("/", useAuth, async (req, res) => {
  try {
    const expenseData = await Expense.findAll({
      attributes: [
        "id",
        "expense_name",
        "user_expense_id",
        "amount",
        "description",
        "category",
        "date",
      ],
      where: {
        user_expense_id: req.session.user_id,
        budget_id: req.session.budget_id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });
    res.json(expenseData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single expense by user and budget
router.get("/:user/:budget", useAuth, async (req, res) => {
  try {
    const findExpense = await Expense.findAll({
      where: {
        user_expense_id: req.params.user,
        budget_id: req.params.budget,
      },
    });

    res.json(findExpense);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single expense by id
router.post("/", useAuth, async (req, res) => {
  try {
    const createExpense = await Expense.create({
      expense_name: req.body.expense_name,
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      user_expense_id: req.session.user_id,
      budget_id: req.session.budget_id,
    });
    console.log(createExpense);
    res.json(createExpense);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// PUT a single expense by id
router.put("/:id", useAuth, async (req, res) => {
  try {
    const updateExpense = await Expense.update(
      {
        expense_name: req.body.expense_name,
        description: req.body.description,
        amount: req.body.amount,
        category: req.body.category,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    if (updateExpense[0] === 0) {
      res.status(400).json({
        message: "Please provide a name, category, and amount to the expense",
      });
    }
    console.log(updateExpense);
    res.json(updateExpense);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE a single expense by id
router.delete("/:id", useAuth, async (req, res) => {
  try {
    const deleteExpense = await Expense.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deleteExpense) {
      res.status(400).json({ message: "No expense with that id" });
    }
    res.status(200).json(deleteExpense);
  } catch (err) {
    res.status(500).json("Error in finding expense");
  }
});

module.exports = router;