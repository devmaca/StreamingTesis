var Usuario = require("../models/usuario");
const MyConst = require("../utils/myConst");
const utils = require("../utils/utils");
var UsuarioCont = {};
/**
 * funcion para guardar usuarios
 * solo administradores pueden tener acceso a esta funcion
 * @param {*} data
 */
UsuarioCont.registrar = async function (reqUser, data) {
  //creamos el modelo de usuario
  let usuario = new Usuario({
    nombre: data.nombre,
    apellido: data.apellido,
    telefono: data.telefono,
    genero: data.genero,
    direccion: data.direccion,
    ci: data.ci,
    estado: data.estado,
    email: data.email,
    password: data.password,
    creadoEn: {
      fecha: utils.getDate(),
      idUsuario: reqUser._id,
    },
    modificadoEn: {
      fecha: utils.getDate(),
      idUsuario: reqUser._id,
    },
    rol: data.rol,
  });
  //registramos los datos de usuario en la base de datos
  //y retornamos el registro
  let usuarioReg = await usuario.save();
  usuarioReg.password = "";
  return usuarioReg;
};
/**
 * funcion para listar usuarios
 * se usan filtros por nombre y por carnet
 * solo los administradores pueden tener acceso
 * @param {*} paginacion
 * @param {*} reqQuery
 * @returns
 */
UsuarioCont.listar = async function (paginacion, reqQuery) {
  //creamos las consultas necesarias
  let query = {};
  if (reqQuery.nombreOCi != null) {
    query["$or"] = [
      { nombre: { $regex: reqQuery.nombreOCi, $options: "i" } },
      { ci: { $regex: reqQuery.nombreOCi, $options: "i" } },
    ];
  }

  //campos que no queremos que se vean en la lista
  let field = {
    password: 0,
  };

  //cnofiguracion de documentos por pagina y la pagina que corresponde
  //si no llegan los valores se configura por defecto
  let porPagina = paginacion.porPagina || 10;
  let pagina = paginacion.pagina || 0;
  let skip = porPagina * pagina;

  //consultamos la base de datos con paginacion
  //y retornamos la consulta
  return await Usuario.find(query, field, {
    skip: skip,
    limit: porPagina,
  });
};

/**
 * lista de usuarios para ser asignados como choferes
 * @param {*} paginacion
 * @param {*} reqQuery
 * @returns
 */
UsuarioCont.listarUsuariosParaDueno = async function (reqQuery) {
  //creamos las consultas necesarias
  //solo choferes que esten activos
  let query = {};
  if (reqQuery.nombreOCi != null) {
    query["$or"] = [
      { nombre: { $regex: reqQuery.nombreOCi, $options: "i" } },
      { ci: { $regex: reqQuery.nombreOCi, $options: "i" } },
    ];
  }

  //campos que no queremos que se vean en la lista
  let field = {
    password: 0,
  };

  //consultamos la base de datos con paginacion
  //y retornamos la consulta
  return await Usuario.find(query, field);
};

/**
 * lista de usuarios para ser asignados como choferes
 * @param {*} paginacion
 * @param {*} reqQuery
 * @returns
 */
UsuarioCont.listarSinAsignar = async function (reqQuery) {
  //creamos las consultas necesarias
  //solo choferes que esten activos
  let query = {
    estado: MyConst.usuarioEstado.activo,
    rol: MyConst.rol.chofer,
  };
  if (reqQuery._id) query._id = reqQuery._id;
  if (reqQuery.nombreOCi != null) {
    query["$or"] = [
      { nombre: { $regex: reqQuery.nombreOCi, $options: "i" } },
      { ci: { $regex: reqQuery.nombreOCi, $options: "i" } },
    ];
  }

  //campos que no queremos que se vean en la lista
  let field = {
    password: 0,
  };

  //consultamos la base de datos con paginacion
  //y retornamos la consulta
  return await Usuario.find(query, field);
};

/**
 * buscada de un usuario por id mas que todo
 * nombre carnet opcional, tal vez ni lo usemos
 * @param {*} reqQuery
 */
UsuarioCont.buscarUnoConConsulta = async function (reqQuery) {
  //creamos la consulta
  let query = {};
  if (reqQuery._id) query._id = reqQuery._id;
  if (reqQuery.nombreOCi != null) {
    query["$or"] = [
      { nombre: { $regex: reqQuery.nombreOCi, $options: "i" } },
      { ci: { $regex: reqQuery.nombreOCi, $options: "i" } },
    ];
  }
  //campos que no queremos que aparesca
  let field = {
    password: 0,
  };
  //consultamos a la base de datos
  return await Usuario.findOne(query, field);
};

/**
 * actualizacion de datos
 * funcion disponible solo para administradores
 * @param {*} userUpdateData
 * @returns
 */
UsuarioCont.actualizar = async function (reqQuery, reqUser, userUpdateData) {
  //nos aseguramos que rol sea un array

  //creamos la cosulta
  let query = {
    _id: reqQuery._id,
  };

  //los campos que no queremos ver
  let field = {
    password: 0,
  };

  //creamos la fecha de la modificacion
  //eliminamos los datos que no quremos que se actualicen por aqui
  //
  let usuarioNuevo = {};
  if (userUpdateData.nombre) usuarioNuevo.nombre = userUpdateData.nombre;
  if (userUpdateData.apellido) usuarioNuevo.apellido = userUpdateData.apellido;
  if (userUpdateData.telefono) usuarioNuevo.telefono = userUpdateData.telefono;
  if (userUpdateData.genero) usuarioNuevo.genero = userUpdateData.genero;
  if (userUpdateData.direccion)
    usuarioNuevo.direccion = userUpdateData.direccion;
  if (userUpdateData.ci) usuarioNuevo.ci = userUpdateData.ci;
  if (userUpdateData.estado != null)
    usuarioNuevo.estado = userUpdateData.estado;
  if (userUpdateData.email) usuarioNuevo.email = userUpdateData.email;
  if (userUpdateData.rol) usuarioNuevo.rol = userUpdateData.rol;

  //obtenemos una fecha de modificacion
  usuarioNuevo.modificadoEn = {
    fecha: utils.getDate(),
    idUsuario: reqUser._id,
  };

  //modificamos en base de datos
  return await Usuario.findOneAndUpdate(
    query,
    {
      $set: usuarioNuevo,
    },
    {
      new: true,
      projection: field,
    }
  );
};

/**
 * solo los usuarios que estan activos se pueden
 * logear
 * @param {*} reqQuery
 * @returns
 */
UsuarioCont.login = async function (reqQuery) {
  //creamos la consulta
  let query = {
    estado: MyConst.usuarioEstado.activo,
  };
  query.password = reqQuery.password;
  query.ci = reqQuery.ci;
  //campos que no queremos que aparesca
  let field = {
    password: 0,
  };
  //consultamos a la base de datos
  return await Usuario.findOne(query, field);
};
//++++++++++++++++++++++++++++++++++
// Funcion para insertar Nuevo Usuario con Ajax
//+++++++++++++++++++++++++++++++++++
UsuarioCont.userPost = function(req,res){
  //creamos el modelo de usuario
  try{
    let usuario = new Usuario({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      genero: req.body.genero,
      direccion: req.body.direccion,
      ci: req.body.ci,
      estado: req.body.estado,
      email: req.body.email,
      password: req.body.password,
      creadoEn: {
        fecha: utils.getDate(),
        idUsuario: null
      },
      modificadoEn: {
        fecha: utils.getDate(),
        idUsuario: null
      },
      rol: req.body.rol
    });

    console.log('user: ',usuario);
    res.status(200).send({
        finalizado:true,
        msj:'recibido!!!',
        dato:usuario
    })
  }
  catch(e){
    console.log('error', e);
      res.status(501).send({
          finalizado: true,
          mensaje: 'post Error',
        });
  }
}
// +++++++++++++++++++++++++++++++
UsuarioCont.userGet = function(req, res) {
  try{
    res.status(200).send({
        finalizado:true,
        msj:'recibido!!!'
    })
  }
  catch(e){
    console.log('error', e);
    res.status(401).send({
      finalizado: true,
      mensaje: 'get Error',
    });
  }
}
module.exports = UsuarioCont;
