const express = require("express");
const router = express.Router();

// Rutas de login
router.get("/", (req, res, next) => {
  res.clearCookie("userData");
  res.render("login");
});

router.post("/auth", async (req, res, next) => {
  const db = req.db;
  const collection = await db.get("clientes");
  const result = await collection.find(
    { usuario: req.body.usuario, contrasenia: req.body.contrasenia },
    {}
  );
  if (result.length === 0) {
    res.render("login", { error: true });
  } else {
    delete result[0].contrasenia;
    res.cookie("userData", result[0]);
    res.redirect("/status");
  }
});

module.exports = router;
