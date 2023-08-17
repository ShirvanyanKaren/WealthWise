const router = require("express").Router();
const { Budget } = require("../models");
const { useAuth } = require("../utils/auth");

// GET all budgets for dashboard where user_id = session.user_id and render nameBudget.handlebars
router.get("/", useAuth, async (req, res) => {
  try {
    const userBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
    });

    const budgets = userBudgetData.map((budget) => budget.get({ plain: true }));

    res.render("nameBudget", {
      logged_in: req.session.logged_in,
      budgets,
    });
    console.log(res);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
