var Vehiculo = require("../models/vehiculo");
const MyConst = require("../utils/myConst");
const utils = require("../utils/utils");
var VehiculoCont = {};

//registro de vehiculos
VehiculoCont.registrar = async function (reqUser, data) {
  var vehiculo = new Vehiculo({
    idPropietario: data.idPropietario,
    numeroMovil: data.numeroMovil,
    chasis: data.chasis,
    placa: data.placa,
    modelo: data.modelo,
    marca: data.marca,
    color: data.color,
    aud1: data.aud1,
    vid1: data.vid1,
    aud2: data.aud2,
    vid2: data.vid2,
    estado: data.estado,
    creadoEn: {
      fecha: utils.getDate(),
      idUsuario: reqUser._id,
    },
    modificadoEn: {
      fecha: utils.getDate(),
      idUsuario: reqUser._id,
    },
  });
  return await vehiculo.save();
};

/**
 * funcion para editar un vehiculo
 * @param {*} reqQuery
 * @param {*} reqUser
 * @param {*} data
 * @returns
 *
 * solo se puede actualizar numero de movil, color, aud1, vid1, aud2, vid2
 * solo acceden a esta funcion administradores y choferes
 */
VehiculoCont.actualizar = async function (reqQuery, reqUser, data) {
  let query = {
    _id: reqQuery._id,
  };
  let vehiculoNuevo = {};

  if (utils.esAdministrador(reqUser)) {
    if (data.numeroMovil != null) vehiculoNuevo.numeroMovil = data.numeroMovil;
    if (data.color != null) vehiculoNuevo.color = data.color;
    if (data.estado != null) vehiculoNuevo.estado = data.estado;
  }

  if (data.aud1) vehiculoNuevo.aud1 = data.aud1;
  if (data.aud2) vehiculoNuevo.aud2 = data.aud2;
  if (data.vid1) vehiculoNuevo.vid1 = data.vid1;
  if (data.vid2) vehiculoNuevo.vid2 = data.vid2;
  vehiculoNuevo.modificadoEn = {
    fecha: utils.getDate(),
    idUsuario: reqUser._id,
  };
  let vehiculoAct = await Vehiculo.findOneAndUpdate(
    query,
    {
      $set: vehiculoNuevo,
    },
    { new: true }
  );

  return vehiculoAct;
};
/**
 * lista de vehiculos
 * @param {*} paginacion
 * @param {*} reqQuery
 * @returns
 */
VehiculoCont.listar = async function (paginacion, reqQuery) {
  let query = {};

  //busqueda por placa
  if (reqQuery.placa) {
    query.placa = { $regex: reqQuery.placa, $options: "i" };
  }

  //para la paginacion
  let porPagina = paginacion.porPagina || 10;
  let pagina = paginacion.pagina || 0;
  let skip = porPagina * pagina;
  //consultamos a la base de datos
  return await Vehiculo.find(
    query,
    {},
    { skip: skip, limit: porPagina }      
  ).populate({ path: "asignado", match: { finalizadoEn: null } });
};
/**
 * funcion para listar vehiculos con populate
 * para verificar asignados
 * @param {*} paginacion
 * @param {*} reqQuery
 * @returns
 */
VehiculoCont.listaAsignados = async function (paginacion, reqQuery) {
  let query = {};

  //busqueda por placa
  if (reqQuery.placa) query.placa = { $regex: reqQuery.placa, $options: "i" };
  if (reqQuery.idVehiculos) {
    if (Array.isArray(reqQuery.idVehiculos))
      query._id = { $in: reqQuery.idVehiculos };
    else query._id = reqQuery.idVehiculos;
  }

  //para solicitudes sin paginacion
  if (!paginacion) {
    return await Vehiculo.find(query).populate("asignado");
  }

  //para la paginacion
  let porPagina = paginacion.porPagina || 10;
  let pagina = paginacion.pagina || 0;
  let skip = porPagina * pagina;
  //consultamos a la base de datos
  return await Vehiculo.find(
    query,
    {},
    { skip: skip, limit: porPagina }
  ).populate("asignado");
};

/**
 * buscamos un usuario por _id o por placa
 * @param {*} reqQuery
 * @returns
 */
VehiculoCont.buscarUnoConConsulta = async function (reqQuery) {
  let query = {};
  if (reqQuery._id) query._id = reqQuery._id;
  if (reqQuery.placa) {
    query.placa = { $regex: reqQuery.placa, $options: "i" };
  }
  return await Vehiculo.findOne(query);
};
/**
 * buscar vehiculo, para asignar
 * @param {*} reqQuery
 * @returns
 */
VehiculoCont.buscarUnoParaAsignar = async function (reqQuery) {
  let query = {};
  if (reqQuery._id) query._id = reqQuery._id;
  return await Vehiculo.findOne(query).populate("asignado");
};

module.exports = VehiculoCont;
