const createUsers = require("./createUsers");
const createUsersBudgets = require("./createUsersBudgets");
const createUsersIncomes = require("./createUsersIncomes");
const createUsersExpenses = require("./createUsersExpenses");
const updateUsersBudgets = require("./updateUsersBudgets");
const sequelize = require("../config/connection");

const seedAll = async () => {
  try {
    await sequelize.sync({ force: true })
    await createUsers()
    await createUsersBudgets()
    await createUsersIncomes()
    await createUsersExpenses()
    await updateUsersBudgets()
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
};

seedAll();