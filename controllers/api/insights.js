const router = require("express").Router();
const { User, Expense, Income, Budget } = require("../../models");




router.get('/', async (req, res) =>{
try {
    const budgetData = await Budget.findAll({
        where: {
            user_budget_id: req.params.id,
        },
      attributes: [
        "id",
        "budget_name",
        "user_budget_id",
        "total_expense",
        "total_income",
        "total_savings",
        "month"
      ],
    });



} catch(err) {
    res.status(500).json;
}

});










module.exports = router;