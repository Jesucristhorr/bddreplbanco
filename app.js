// Importa los paquetes a utilizar
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const monk = require("monk");

// Importando rutas
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const statusRouter = require("./routes/status");

// Si es ambiente de desarrollo, usar el archivo .env
// para las variables de entorno
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Inicializa express
const app = express();

// Especifica que se utilizará pug como motor de plantillas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Inicialización de la base de datos
try {
  const db = monk(process.env.DB_URI);

  app.use((req, res, next) => {
    // Hacer accesible a la base de datos en las rutas
    req.db = db;
    next();
  });
} catch (err) {
  console.error(err);
}

// Usa morgan para un log más detallado
app.use(logger("dev"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Contenido estático
app.use(express.static(path.join(__dirname, "public")));

// Rutas de la aplicación
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/status", statusRouter);

// Inicio del servidor
app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado.");
});

module.exports = app;
