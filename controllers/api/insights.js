const router = require("express").Router();
const { Budget } = require("../../models");
const { useAuth } = require("../../utils/auth");

router.get("/", useAuth, async (req, res) => {
  try {
    console.log(req.session.user_id);
    const monthlyBudgetData = await Budget.findAll({
      where: {
        user_budget_id: req.session.user_id,
      },
      attributes: ["total_savings", "month"],
    });

    console.log(monthlyBudgetData);

    const totalMonthlySavings = monthlyBudgetData.reduce(
      (total, item) => total + Number(item.total_savings),
      0
    );

    console.log(typeof monthlyBudgetData[0].total_savings)

    console.log(totalMonthlySavings);

    const monthSavingsPerc = monthlyBudgetData.map((item) => ({
      month: item.month,
      savings_percent:
        parseFloat(
          (item.total_savings / Math.abs(totalMonthlySavings)) * 100
        ).toFixed(2) + "%",
    }));

    const averageMonthlySavings = parseFloat(
      totalMonthlySavings / monthlyBudgetData.length
    ).toFixed(2);

    console.log(monthSavingsPerc);

    const budgetData = {
      totalMonthlySavings,
      averageMonthlySavings,
      monthSavingsPerc,
    };

    res.json(budgetData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

module.exports = router;
