// Importing dependencies
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const helpers = require("./utils/helpers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Creating the express app
const app = express();
const PORT = process.env.PORT || 3001;

// Creating the session and setting the cookie to expire in 24 hours
const hours = 24;
const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * hours,
  },
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Using the session
app.use(session(sessionConfig));

// Setting up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Setting up Handlebars.js engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Setting up the express app to handle data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/")));

// Setting up the routes
app.use(require("./controllers/"));

// Syncing the sequelize models and then starting the express app
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on ${PORT}!`));
});
