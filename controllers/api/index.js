const router = require('express').Router();
const userRoutes = require('./user.js');
const revenueRoutes = require('./revenue');
const expenseRoutes = require('./expense');
const budgetRoutes = require('./budget');
const sessionRoutes = require('./session');
const insightsRoutes = require("./insights.js")


// api routes for user, revenue, expense, budget, and session
router.use('/user', userRoutes);
router.use('/revenue', revenueRoutes);
router.use('/expense', expenseRoutes);
router.use('/budget', budgetRoutes);
router.use('/session', sessionRoutes);
router.use('/insights', insightsRoutes);


module.exports = router;
