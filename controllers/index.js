const router = require("express").Router();
const homeRoutes = require("./homeRoutes.js");
const apiRoutes = require("./api");
const createBudgetRoutes = require("./createBudget");


router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/create", createBudgetRoutes);
// router.use("")



// If no API routes are hit, render the 404 page. Wildcard route.
router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;