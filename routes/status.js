const express = require("express");
const router = express.Router();

// Rutas de status
router.get("/", (req, res, next) => {
  res.render("status", {
    user: req.cookies.userData,
    cuentas: req.cookies.userCuentas,
  });
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
    } else {
      for (let i = 0; i < req.cookies.userCuentas.length; i++) {
        if (
          cuentaAcreditada[0].numero_cuenta ===
          req.cookies.userCuentas[i].numero_cuenta
        ) {
          res.render("transferir", {
            user: req.cookies.userData,
            error: "No puedes transferirte a ti mismo.",
          });
        }
      }
    }

    let cuentaDebitar = {};
    for (let i = 0; i < req.cookies.userCuentas.length; i++) {
      if (form.cuentasDebitar === req.cookies.userCuentas[i].numero_cuenta) {
        cuentaDebitar = req.cookies.userCuentas[i];
      }
    }

    if (cuentaDebitar.saldo < form.valor) {
      res.render("transferir", {
        user: req.cookies.userData,
        error: "No tienes el saldo suficiente.",
      });
    } else {
      const valorNuevoDebitar = Number(
        parseFloat(cuentaDebitar.saldo - Number(form.valor)).toFixed(2)
      );
      const valorNuevoAcreditar = Number(
        parseFloat(cuentaAcreditada[0].saldo + Number(form.valor)).toFixed(2)
      );

      await collection.update(
        { _id: cuentaAcreditada[0]._id },
        { $set: { saldo: valorNuevoAcreditar } }
      );
      await collection.update(
        { _id: cuentaDebitar._id },
        { $set: { saldo: valorNuevoDebitar } }
      );

      const usuario = req.cookies.userData;
      let cuentas = [];

      for (let i = 0; i < usuario.cuentas.length; i++) {
        let result = await collection.find(
          { numero_cuenta: usuario.cuentas[i] },
          {}
        );
        cuentas.push(result[0]);
      }

      res.cookie("userCuentas", cuentas);

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
  res.render("retiro", {
    user: req.cookies.userData,
    cuentas: req.cookies.userCuentas,
  });
});

router.post("/withdrawal/check", async (req, res, next) => {
  const db = req.db;
  const form = req.body;
  const collection = await db.get("cuentas");
  const cuentasUsuario = req.cookies.userCuentas;
  saldo = 0;
  for (let i = 0; i < cuentasUsuario.length; i++) {
    if (cuentasUsuario[i].numero_cuenta === form.cuentasDebitar) {
      saldo = cuentasUsuario[i].saldo;
    }
  }

  if (saldo < form.Currency) {
    res.render("retiro", {
      user: req.cookies.userData,
      cuentas: req.cookies.userCuentas,
      error: "No tienes el saldo suficiente.",
    });
  } else {
    saldo = Number(parseFloat(saldo - Number(form.Currency)).toFixed(2));

    await collection.update(
      { numero_cuenta: form.cuentasDebitar },
      { $set: { saldo: saldo } }
    );

    const usuario = req.cookies.userData;
    let cuentas = [];

    for (let i = 0; i < usuario.cuentas.length; i++) {
      let result = await collection.find(
        { numero_cuenta: usuario.cuentas[i] },
        {}
      );
      cuentas.push(result[0]);
    }

    res.cookie("userCuentas", cuentas);

    res.render("retiro", {
      user: req.cookies.userData,
      cuentas: cuentas,
      exito: "Se realizó el retiro correctamente.",
    });
  }
});

router.get("/deposit", (req, res, next) => {
  res.render("deposit", {
    user: req.cookies.userData,
  });
});

router.post("/deposit/check", async (req, res, next) => {
  try {
    const db = req.db;
    const form = req.body;
    const collection = await db.get("cuentas");
    const cuentaDepositar = await collection.find(
      { numero_cuenta: form.cuentaAcreditar },
      {}
    );

    if (cuentaDepositar.length === 0) {
      res.render("deposit", {
        user: req.cookies.userData,
        error: "La cuenta a depositar no existe.",
      });
    }

    const valorNuevoAcreditar = Number(
      parseFloat(cuentaDepositar[0].saldo + Number(form.Currency)).toFixed(2)
    );

    await collection.update(
      { _id: cuentaDepositar[0]._id },
      { $set: { saldo: valorNuevoAcreditar } }
    );

    const usuario = req.cookies.userData;
    let cuentas = [];

    for (let i = 0; i < usuario.cuentas.length; i++) {
      let result = await collection.find(
        { numero_cuenta: usuario.cuentas[i] },
        {}
      );
      cuentas.push(result[0]);
    }

    res.cookie("userCuentas", cuentas);

    res.render("deposit", {
      user: req.cookies.userData,
      exito: "El depósito se realizó correctamente.",
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
