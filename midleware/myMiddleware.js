const MyConst = require("../utils/myConst");

let MyMidd = {};
MyMidd.auth = async function (req, res, next) {
  if (!req.session.user) {
    let user = {
      rol: null,
      _id: null,
    };
    req.session.user = user;
    res.redirect("/login");
  } else {
    next();
  }
};

MyMidd.esAdministrador = function (user) {
  return user.rol==MyConst.rol.administrador;
  //return user.rol.some((rol) => [MyConst.rol.administrador].includes(rol));
};
MyMidd.esChofer = function (user) {
  return user.rol==MyConst.rol.chofer;
  //return user.rol.some((rol) => [MyConst.rol.chofer].includes(rol));
};
MyMidd.esOperador = function (user) {
  return user.rol==MyConst.rol.operador;
  //return user.rol.some((rol) => [MyConst.rol.operador].includes(rol));
};

module.exports = MyMidd;
