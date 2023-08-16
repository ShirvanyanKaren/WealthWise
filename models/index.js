const Budget = require('./Budget');
const Income = require('./Income');
const Expense = require('./Expense');
const User = require('./User');

User.hasMany(Budget, {
    foreignKey: 'user_budget_id',
});

Budget.belongsTo(User, {
    foreignKey: 'user_budget_id',
});

User.hasMany(Income, {
    foreignKey: 'user_income_id',
});

Income.belongsTo(User, {
    foreignKey: 'user_income_id',
});

User.hasMany(Expense, {
    foreignKey: 'user_expense_id',
});

Expense.belongsTo(User, {
    foreignKey: 'user_expense_id',
});

Budget.hasMany(Income, {
    foreignKey: 'budget_id',
});

Income.belongsTo(Budget, {
    foreignKey: 'budget_id',
});

Budget.hasMany(Expense, {
    foreignKey: 'budget_id',
});

Expense.belongsTo(Budget, {
    foreignKey: 'budget_id',
});

module.exports = {
    Budget,
    Income,
    Expense,
    User
};
