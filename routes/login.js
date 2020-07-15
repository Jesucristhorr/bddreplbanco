const express = require("express");
const router = express.Router();

// Rutas de login
router.get("/", (req, res, next) => {
  res.render("login");
});

module.exports = router;
