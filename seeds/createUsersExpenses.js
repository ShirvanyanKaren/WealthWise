// Importing faker to generate fake data
const { faker } = require("@faker-js/faker");
const { User, Expense, Budget } = require("../models");

// List of expense categories
const expenseCategories = [
  "Clothing and Accessories",
  "Debt Payments",
  "Education",
  "Entertainment",
  "Food",
  "Gifts and Donations",
  "Health and Wellness",
  "Housing",
  "Insurance",
  "Miscellaneous",
  "Personal Care",
  "Savings and Investments",
  "Taxes",
  "Transportation",
  "Travel",
  "Utilities and Bills",
];

// Function to create fake expenses for each user
const createUsersExpenses = async () => {
  const users = await User.findAll({
    include: [{ model: Budget }],
  });

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < user.budgets.length; j++) {
        const randomCategoryIndex = Math.floor(
          Math.random() * expenseCategories.length
        );
        const randomCategory = expenseCategories[randomCategoryIndex];
        await Expense.create({
          expense_name: faker.lorem.word(),
          user_expense_id: user.id,
          budget_id: user.budgets[j].id,
          amount: faker.commerce.price(),
          description: faker.lorem.sentence(),
          category: randomCategory,
          date: faker.date.past(),
        });
      }
    }
  }
};

module.exports = createUsersExpenses;
