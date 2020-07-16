const express = require("express");
const router = express.Router();

// Rutas de status
router.get("/", (req, res, next) => {
  res.render("status", { user: req.cookies.userData });
});

router.get("/transfer", (req, res, next) => {
  res.render("transferir", { user: req.cookies.userData });
});

router.post("/transfer/check", async (req, res, next) => {
  const db = req.db;
  res.render("transferir");
});

router.get("/withdrawal", (req, res, next) => {
  res.render("retiro");
});

router.get("/deposit", (req, res, next) => {
  res.render("deposit");
});

module.exports = router;
