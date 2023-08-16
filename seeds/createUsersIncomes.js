const { faker } = require('@faker-js/faker');
const { User, Income } = require("../models");

const createUsersIncomes = async () => {
    const users = await User.findAll();
  
    for (const user of users) {
      const incomes = [...Array(10)].map((income) => ({
        income_name: faker.commerce.productName(),
        user_income_id: user.id,
        amount: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
        date: faker.date.past(),
      }));
  
      await Income.bulkCreate(incomes);
    };
}
  
module.exports = createUsersIncomes;