const router = require("express").Router();
const { Budget } = require("../models");
const { useAuth } = require("../utils/auth");

// GET all budgets
router.get("/", async (req, res) => {
  try {
    if (req.session.user_id) {
      const userBudgetData = await Budget.findAll({
        where: {
          user_budget_id: req.session.user_id,
        },
      });

      const budgets = userBudgetData.map((budget) =>
        budget.get({ plain: true })
      );

      res.render("homepage", {
        budgets,
        logged_in: req.session.logged_in,
      });
    } else {
      res.render("homepage");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Redirects user to homepage if they are logged in or to the login page if they are not1
router.use("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

// Logs user out and redirects them to the homepage
router.get("/logout", useAuth, (req, res) => {
  try {
    req.session.destroy(() => {
      res.render("logoutconfirm");
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Redirects user to the signup page
router.get("/signup", (req, res) => {
  try {
    res.render("signup");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Redirects user to the create budget page if they are logged in or to the login page if they are not
router.get("/items", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });

    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));

    res.render("items", {
      logged_in: req.session.logged_in,
      budgets,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Redirects the user to the add income/expense page by budget_id for the logged in user
router.get("/items/:id", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });
    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
    req.session.budget_id = req.params.id;
    req.session.save();
    res.render("items", {
      logged_in: req.session.logged_in,
      budgets,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Redirects the user to the budget analysis page by user_budget_id for the logged in user
router.get("/budget/:id", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });
    const singleBudget = await Budget.findOne({
      where: {
        id: req.params.id,
      },
    });
    const budget = await singleBudget.get({ plain: true });
    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));

    console.log(budget);
    console.log(budgets);

    if (budget.total_income === null && budget.total_expense === null) {
      req.session.budget_id = req.params.id;
      req.session.save();
      res.redirect("/items/" + req.params.id);
      return;
    }

    req.session.budget_id = req.params.id;
    req.session.save();
    res.render("budgetAnalysis", {
      logged_in: req.session.logged_in,
      budgets,
      budget,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//gets the budget analysis page by user_budget_id saved in session
router.get("/budget", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });
    const singleBudget = await Budget.findOne({
      where: {
        id: req.session.budget_id,
      },
    });
    const budget = await singleBudget.get({ plain: true });
    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
    console.log(budgets);
    res.render("budgetAnalysis", {
      logged_in: req.session.logged_in,
      budgets,
      budget,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;