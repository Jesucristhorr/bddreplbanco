// Importa los paquetes a utilizar
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Importando rutas
const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");

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

// Inicio del servidor
app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado.");
});

module.exports = app;
