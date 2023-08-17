const router = require("express").Router();
const homeRoutes = require("./homeRoutes.js");
const apiRoutes = require("./api");
const createBudgetRoutes = require("./createBudget");

router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/create", createBudgetRoutes);

// If no API routes are hit, render the 404 page.
router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;