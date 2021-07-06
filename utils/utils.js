const MyConst = require("./myConst");

let utils = {};
utils.esAdministrador = function (user) {
  //eliminar esta linea cuando pasemos a production
  return true;
  if (user.rol.includes(MyConst.rol.administrador)) return true;
  return false;
};
utils.getDate = function () {
  return new Date();
};
utils.getStringFormatDate = function (date) {
  let dateFormat =
    date.getFullYear() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();
  return dateFormat;
};
module.exports = utils;
