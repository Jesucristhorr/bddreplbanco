const express = require("express");
const router = express.Router();

// Rutas de status
router.get("/", (req, res, next) => {
  res.redirect("/status/transfer");
});

router.get("/transfer", (req, res, next) => {
  res.render("transferir");
});

module.exports = router;
