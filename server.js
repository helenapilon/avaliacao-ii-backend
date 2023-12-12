const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: ["http://localhost:3000", "https://avaliacao-seguranca.vercel.app"],
};

const db = require("./queries");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Avaliação - Segurança de Aplicações." });
});

app.get("/user", db.getUsers);
app.get("/user/:id", db.getUserById);
app.post("/user/login", db.login);
app.post("/user", db.createUser);
app.put("/user/:id", db.updateUser);
app.delete("/user/:id", db.deleteUser);

app.get("/log", db.getLogs);
app.get("/log/:id", db.getLogById);
app.get("/log/user/:id", db.getLogByUserId);
app.post("/log", db.createLog);
app.delete("/log/:id", db.deleteLog);

app.get("/loja", db.getLojas);
app.get("/loja/:id", db.getLojaById);
app.post("/loja", db.createLoja);
app.delete("/loja/:id", db.deleteLoja);

app.get("/produto", db.getProdutos);
app.get("/produto/:id", db.getProdutoById);
app.get("/produto/user/:id", db.getProdutoByLojaId);
app.post("/produto", db.createProduto);
app.delete("/produto/:id", db.deleteProduto);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
