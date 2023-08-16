const { faker } = require("@faker-js/faker");
const { User, Budget } = require("../models");

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