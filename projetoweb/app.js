const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = 4000;
const session = require("express-session");

app.use(
  session({
    secret: "trabalhoweb",
    resave: true,
    saveUninitialized: true,
  })
);

mongoose.connect("mongodb://localhost:27017/trabalho", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const eventoRoutes = require("./routes/evento");
app.use("/evento", eventoRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/organizador", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "area-organizador.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "participante.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "organizador.html"));
});

app.get("/frequencia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "frequencia.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
