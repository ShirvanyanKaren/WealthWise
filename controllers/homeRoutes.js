const router = require("express").Router();
const {User, Budget, Income, Expense} = require('../models')
const { useAuth } = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    if (req.session.user_id) {
      const userBudgetData = await Budget.findAll({
        where: {
          user_budget_id: req.session.user_id,
        },
      });
  
      const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
      console.log(budgets);
  
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

router.use("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/logout", useAuth, (req, res) => {
  try {
    req.session.destroy(() => {
      res.render("logoutconfirm");
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/signup", (req, res) => {
  try {
    res.render("signup");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/items", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });

    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
    console.log(budgets);
    res.render("items", {
      logged_in: req.session.logged_in,
      budgets
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

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
      budgets
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/budget/:id", useAuth, async (req, res) => {
  try {        const userBudgetData = await Budget.findAll({
    where: {
      user_budget_id: req.session.user_id,
    },
  });

  const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
  console.log(budgets);
    req.session.budget_id = req.params.id;
    req.session.save();

    console.log(req.session.budget_id)

    res.render("budgetAnalysis", {
      logged_in: req.session.logged_in,
      budgets
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/budget", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });

    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));
    console.log(budgets);
    res.render("budgetAnalysis", {
      logged_in: req.session.logged_in,
      budgets
    });
  } catch (err) {
    console.
    res.status(500).json(err);
  }
});

module.exports = router;
