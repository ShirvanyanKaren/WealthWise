// Importing the faker module
const { faker } = require("@faker-js/faker");
const { User, Income, Budget } = require("../models");

// Income categories
const incomeCategories = [
  "Alimony/Child Support",
  "Business Income",
  "Freelance",
  "Gifts",
  "Investment Income",
  "Rental Income",
  "Salary",
  "Side Gig",
  "Other",
];

// Function to create incomes for each user
const createUsersIncomes = async () => {
  const users = await User.findAll({
    include: [{ model: Budget, limit: 2 }],
  });

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      const index = i < 5 ? 0 : 1;
      const randomCategoryIndex = Math.floor(
        Math.random() * incomeCategories.length
      );
      const randomCategory = incomeCategories[randomCategoryIndex];
      await Income.create({
        income_name: faker.lorem.word(),
        user_income_id: user.id,
        budget_id: user.budgets[index].id,
        amount: faker.commerce.price(),
        description: faker.lorem.sentence(),
        category: randomCategory,
        date: faker.date.past(),
      });
    }
  }
};

module.exports = createUsersIncomes;
