// Import the faker module
const { faker } = require("@faker-js/faker");
const { User, Budget } = require("../models");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Creates 2 budgets for each user
const createUsersBudgets = async () => {
  const users = await User.findAll();
  const budgetQueue = [];
  for (const user of users) {
    for (const month of months) {
      const budget = {
        budget_name: faker.lorem.word(),
        user_budget_id: user.id,
        month: month,
      };
      budgetQueue.push(budget);
    }
  }
  await Budget.bulkCreate(budgetQueue);
};

module.exports = createUsersBudgets;
