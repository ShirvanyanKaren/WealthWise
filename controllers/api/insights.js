const router = require("express").Router();
const { User, Expense, Income, Budget } = require("../../models");




router.get('/:id', async (req, res) => {
    try {
      const monthlyBudgetData = await Budget.findAll({
        where: {
          user_budget_id: req.params.id,
        },
        attributes: [
          "total_savings",
          "month"
        ],
      });
  

      console.log(monthlyBudgetData);
      const totalMonthlySavings = monthlyBudgetData.reduce((total, item) => total + item.total_savings, 0);
      console.log(totalMonthlySavings);
  


    const monthSavingsPerc = monthlyBudgetData.map(item => ({
        month: item.month,
        savings_percent: (item.total_savings/totalMonthlySavings) * 100,
    }));
    

    averageMonthlySavings = totalMonthlySavings/monthlyBudgetData.length

      console.log(monthSavingsPerc);
  
      res.json({
        totalMonthlySavings,
        monthSavingsPerc,
        averageMonthlySavings
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  });
 
  


module.exports = router;