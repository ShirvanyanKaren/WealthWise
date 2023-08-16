const { faker } = require('@faker-js/faker');
const { User } = require("../models");
const bcrypt = require("bcrypt");

const createUsers = async () => {
    const users = [...Array(10)].map((user) => ({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("password", 10),
    }));
  
    await User.bulkCreate(users);
};
  
module.exports = createUsers;