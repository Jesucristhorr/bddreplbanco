const express = require("express");
const router = express.Router();

// Ruta raiz
router.get("/", (req, res, next) => {
  res.redirect("/login");
});

module.exports = router;
