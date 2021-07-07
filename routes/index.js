var express = require("express");
const UsuarioCont = require("../controllers/usuarioController");
const MyMidd = require("../midleware/myMiddleware");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esChofer(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }
  res.render("home", { title: "Inicio" ,sesion:req.session.user});
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Inicio" ,sesion:req.session.user});
});
router.get("/logout", function (req, res, next) {
  req.session.user = {
    _id: null,
    rol: [],
  };
  res.redirect("/");
});
router.post("/login", async function (req, res, next) {
  let reqQuery = {
    password: req.body.password,
    ci: req.body.ci,
  };
  let userData = await UsuarioCont.login(reqQuery);
  if (!userData) {
    res.render("login", { title: "Inicio", err: "usuario no encontrado" ,sesion:req.session.user});
  } else {
    req.session.user = userData;
    res.redirect("/");
  }
});

module.exports = router;
