const router = require("express").Router();
const { useAuth } = require("../../utils/auth");

// GET current session data 
router.get("/current", useAuth, async (req, res) => {
  try {
    const sessionData = await {
      user_id: req.session.user_id,
      budget_id: req.session.budget_id,
    };
    res.json(sessionData);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
