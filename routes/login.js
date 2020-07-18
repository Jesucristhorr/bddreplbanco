const express = require("express");
const router = express.Router();

// Rutas de login
router.get("/", (req, res, next) => {
  res.clearCookie("userData");
  res.clearCookie("userCuentas");
  res.render("login");
});

router.post("/auth", async (req, res, next) => {
  try {
    const db = req.db;
    let collection = await db.get("clientes");
    const result = await collection.find(
      { usuario: req.body.usuario, contrasenia: req.body.contrasenia },
      {}
    );
    if (result.length === 0) {
      res.render("login", { error: true });
    } else {
      delete result[0].contrasenia;
      res.cookie("userData", result[0]);
      collection = await db.get("cuentas");

      let cuentas = [];
      let usuario = result[0];
      for (let i = 0; i < usuario.cuentas.length; i++) {
        let resultCuentas = await collection.find(
          { numero_cuenta: usuario.cuentas[i] },
          {}
        );
        cuentas.push(resultCuentas[0]);
      }

      res.cookie("userCuentas", cuentas);

      res.redirect("/status");
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
