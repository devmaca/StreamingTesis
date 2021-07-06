var Asignado = require("../models/asignado");
const utils = require("../utils/utils");
var AsignadoCont = {};

//asignacion de vehiculos
AsignadoCont.asignar = async function (reqUser, data) {
  var asignado = new Asignado({
    idVehiculo: data.idVehiculo,
    idUsuario: data.idUsuario,
    asignadoEn: {
      fecha: utils.getDate(),
      idUsuario: reqUser._id,
      descripcion: data.descripcion,
    },
    finalizadoEn: null,
    videos: [],
  });

  return await asignado.save();
};

/**
 * funcion para finalizar una asignacion
 * busqueda por _id de asignacion
 * @param {*} reqUser
 * @param {*} data
 * @returns
 */
AsignadoCont.finalizar = async function (reqUser, data) {
  let query = {
    _id: data._id,
    finalizadoEn: null,
  };

  let finalizadoEn = {
    fecha: utils.getDate(),
    idUsuario: reqUser._id,
    descripcion: data.descripcion,
  };

  return await Asignado.findOneAndUpdate(
    query,
    {
      $set: { finalizadoEn: finalizadoEn },
    },
    { new: true }
  );
};

AsignadoCont.buscarUnoConConsulta = async function (reqQuery) {
  let query = reqQuery;
  return await Asignado.findOne(query)
    .populate("idVehiculo")
    .populate({ path: "idUsuario", select: "-password" });
};

AsignadoCont.listar = async function (reqQuery) {
  let query = reqQuery;
  return await Asignado.find(query)
    .populate("idVehiculo")
    .populate({ path: "idUsuario", select: "-password" });
};

AsignadoCont.listarActivosSinPopulate = async function () {
  let query = {
    finalizadoEn: null,
  };
  return await Asignado.find(query);
};

/**
 * funcion para anadir videos por fragmentos
 * @param {*} data
 * @param {*} callback
 */
AsignadoCont.anadirVideo = async function (reqUser, data) {
  let dataVideo = {
    camara: data.camara,
    fecha: data.fecha,
    nombre: data.nombre,
  };
  return await Asignado.findOneAndUpdate(
    {
      _id: data.idAsignado,
    },
    {
      $push: {
        videos: dataVideo,
      },
    },
    {
      new: true,
    }
  );
};

module.exports = AsignadoCont;
