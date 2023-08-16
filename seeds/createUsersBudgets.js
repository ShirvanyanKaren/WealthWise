// Import the faker module
const { faker } = require("@faker-js/faker");
const { User, Budget } = require("../models");

// Creates 2 budgets for each user
const createUsersBudgets = async () => {
  const users = await User.findAll();
  for (const user of users) {
    const budgets = [...Array(2)].map(() => ({
      budget_name: faker.lorem.word(),
      user_budget_id: user.id,
    }));
    await Budget.bulkCreate(budgets);
  }
};

module.exports = createUsersBudgets;