const express = require("express");
const router = express.Router();

// Rutas de status
router.get("/", async (req, res, next) => {
  try {
    const db = req.db;
    const collection = await db.get("cuentas");
    const usuario = req.cookies.userData;

    let cuentas = [];
    for (let i = 0; i < usuario.cuentas.length; i++) {
      let result = await collection.find(
        { numero_cuenta: usuario.cuentas[i] },
        {}
      );
      cuentas.push(result[0]);
    }

    res.render("status", { user: req.cookies.userData, cuentas: cuentas });
  } catch (err) {
    console.error(err);
  }
});

router.get("/transfer", (req, res, next) => {
  res.render("transferir", { user: req.cookies.userData });
});

router.post("/transfer/check", async (req, res, next) => {
  try {
    const db = req.db;
    const form = req.body;
    const collection = await db.get("cuentas");
    const cuentaAcreditada = await collection.find(
      { numero_cuenta: form.cuentaAcreditar },
      {}
    );

    if (cuentaAcreditada.length === 0) {
      res.render("transferir", {
        user: req.cookies.userData,
        error: "La cuenta a acreditar no existe.",
      });
    } else if (cuentaAcreditada[0].numero_cuenta === form.cuentasDebitar) {
      res.render("transferir", {
        user: req.cookies.userData,
        error: "No puedes transferirte a ti mismo.",
      });
    }

    const cuentaDebitar = await collection.find(
      { numero_cuenta: form.cuentasDebitar },
      {}
    );

    if (cuentaDebitar[0].saldo < form.valor) {
      res.render("transferir", {
        user: req.cookies.userData,
        error: "No tienes el saldo suficiente.",
      });
    } else {
      const valorNuevoDebitar = cuentaDebitar[0].saldo - Number(form.valor);
      const valorNuevoAcreditar =
        cuentaAcreditada[0].saldo + Number(form.valor);

      await collection.update(
        { _id: cuentaAcreditada[0]._id },
        { $set: { saldo: valorNuevoAcreditar } }
      );
      await collection.update(
        { _id: cuentaDebitar[0]._id },
        { $set: { saldo: valorNuevoDebitar } }
      );

      res.render("transferir", {
        user: req.cookies.userData,
        exito: "La transferencia se realizó correctamente.",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/withdrawal", (req, res, next) => {
  res.render("retiro");
});

router.get("/deposit", (req, res, next) => {
  res.render("deposit" , {user: req.cookies.userData});
});

router.post("/transfer/check", async (req, res, next) => {
  try {
    const db = req.db;
    const form = req.body;
    const collection = await db.get("cuentas");
    const cuentaAcreditada = await collection.find(
      { numero_cuenta: form.cuentaAcreditar },
      {}
    );

    if (cuentaAcreditada.length === 0) {
      res.render("deposit", {
        user: req.cookies.userData,
        error: "La cuenta a acreditar no existe.",
      });
    } else if (cuentaAcreditada[0].numero_cuenta === form.cuentasDebitar) {
      res.render("deposit", {
        user: req.cookies.userData,
        error: "No puedes depositarte a ti mismo.",
      });
    }

    const cuentaDebitar = await collection.find(
      { numero_cuenta: form.cuentasDebitar },
      {}
    );

    if (cuentaDebitar[0].saldo < form.valor) {
      res.render("deposit", {
        user: req.cookies.userData,
        error: "No tienes el saldo suficiente.",
      });
    } else {
      const valorNuevoDebitar = cuentaDebitar[0].saldo - Number(form.valor);
      const valorNuevoAcreditar =
        cuentaAcreditada[0].saldo + Number(form.valor);

      await collection.update(
        { _id: cuentaAcreditada[0]._id },
        { $set: { saldo: valorNuevoAcreditar } }
      );
      await collection.update(
        { _id: cuentaDebitar[0]._id },
        { $set: { saldo: valorNuevoDebitar } }
      );

      res.render("deposit", {
        user: req.cookies.userData,
        exito: "El depósito se realizó correctamente.",
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
