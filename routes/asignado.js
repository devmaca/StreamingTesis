var express = require("express");
var router = express.Router();
var AsignadoCont = require("../controllers/asignadoController");
const UsuarioCont = require("../controllers/usuarioController");
var VehiculoCont = require("../controllers/vehiculoController");
const MyMidd = require("../midleware/myMiddleware");

router.get("/asignar", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }

  //buscamos al vehiculo que se escogio para asignar
  let reqQueryParaVehiculo = {
    _id: req.query.idVehiculo,
  };
  let vehiculo = await VehiculoCont.buscarUnoParaAsignar(reqQueryParaVehiculo);

  //listamos todos los usuarios que pueden ser asignados
  //solo usuarios con el rol de chofer y que esten activos
  let reqQueryParaUsuario = {};

  if (req.query.nombreOCi) {
    reqQueryParaUsuario.nombreOCi = req.query.nombreOCi;
  }

  let asignaciones = await AsignadoCont.listarActivosSinPopulate();
  let idAsignados = [];
  if (asignaciones.length > 0) {
    asignaciones.forEach((element) => {
      idAsignados.push(element.idUsuario);
    });
  }
  if (idAsignados.length > 0) {
    reqQueryParaUsuario._id = { $nin: idAsignados };
  }

  let usuarios = await UsuarioCont.listarSinAsignar(reqQueryParaUsuario);

  res.render("asignarForm", {
    title: "Datos de asignacion",
    vehiculo: vehiculo,
    usuarios: usuarios,
    sesion: req.session.user,
  });
});

/**
 * ruta para asignar choferes al vehiculo
 */
router.post("/asignar", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }

  let asignado = await AsignadoCont.asignar(req.session.user, req.body);
  if (!asignado)
    res.render("vehiculoForm", {
      err: "no se pudo Asignar",
      title: "datos de vehiculo",
      asignado: req.body,
      sesion: req.session.user,
    });
  else res.redirect(`/asignado/detalle?idAsignado=${asignado._id}`);
});

/**
 * funcion para acceder al detalle de asignacion
 * http://localhost:3000/asignado/detalle?idAsignado=60ab27b0d548511718118f8e
 */
router.get("/detalle", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }
  let query = {};

  if (req.query.idAsignado) query._id = req.query.idAsignado;

  if (req.query.idUsuario) query.idUsuario = req.query.idUsuario;

  if (req.query.idVehiculo) query.idVehiculo = req.query.idVehiculo;

  let asignado = await AsignadoCont.buscarUnoConConsulta(query);

  let lastTime;
  let currentTime;
  let videosVideos = [[]];
  let indx = 0;

  asignado.videos.forEach((video) => {
    currentTime = new Date(
      video.fecha.getFullYear(),
      video.fecha.getMonth(),
      video.fecha.getDate(),
      video.fecha.getHours(),
      0,
      0
    ).getTime();

    if (lastTime != currentTime) {
      lastTime = currentTime;
      if (videosVideos[indx].length > 0) {
        indx++;
        videosVideos[indx] = [];
      }
    }
    videosVideos[indx].push(video);
  });

  res.render("asignarDetalle", {
    title: "datos de Asignacion",
    asignado: asignado,
    videosVideos: videosVideos,
    sesion: req.session.user,
  });
});

router.get("/transmitir", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esChofer(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }

  let query = {};

  //if (req.query.idUsuario) query.idUsuario = req.query.idUsuario;
  //en este punto tomaremos el id del usuario
  //que provenga de la session en req.session
  query.idUsuario = req.session.user._id;
  queryfinalizadoEn = null; //indicando que no es uno finalizado
  let asignado = await AsignadoCont.buscarUnoConConsulta(query);
  if (asignado) {
    res.render("transmitir", {
      title: "datos de Asignacion",
      asignado: asignado,
      sesion: req.session.user,
    });
  } else {
    res.render("home", {
      title: "home",
      msj: "No Estas asignado actualmente",
      sesion: req.session.user,
    });
  }
});

/**
 * ruta para asignar choferes al vehiculo
 */
router.post("/finalizar", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }

  //finalizamos una asignacion
  await AsignadoCont.finalizar(req.session.user, req.body);
  //reenviamos a detalles de finalizacion para ver si efectivamente esta finalizado
  //tomamos el _id  de "asignado" para volver a cargar su detalle
  res.redirect(`/asignado/detalle?idAsignado=${req.body._id}`);
});

router.get("/listar", async function (req, res, next) {
  if (
    !(
      MyMidd.esAdministrador(req.session.user) ||
      MyMidd.esOperador(req.session.user)
    )
  ) {
    res.redirect("/login");
    return;
  }

  let query = {};

  if (req.query.idAsignado) query._id = req.query.idAsignado;

  if (req.query.idUsuario) query.idUsuario = req.query.idUsuario;

  if (req.query.idVehiculo) query.idVehiculo = req.query.idVehiculo;

  let asignados = await AsignadoCont.listar(query);
  res.render("vehiculoAsignadoLista", {
    title: "datos de Asignacion",
    asignados: asignados,
    sesion: req.session.user,
  });
});

/**
 *
 */

/**
 * no se esta usando esta funcion
 * lista y buscador por placa de vehiculo
 * esta funcino aun no se esta usando
 */
router.get(
  "/listarVehiculos",

  async function (req, res, next) {
    if (
      !(
        MyMidd.esAdministrador(req.session.user) ||
        MyMidd.esOperador(req.session.user)
      )
    ) {
      res.redirect("/login");
      return;
    }
    let query = {};
    if (req.query.placa) query.placa = req.query.placa;

    if (req.query.fecha) {
      console.log(
        req.query.fecha,
        "buscamos los asignados para esta fecha, obtenemos los ids de los vehiculos  en un array y recien buscamos vehiculos "
      );
    }
    let paginacion = {
      porPagina: req.query.porPagina,
      pagina: req.query.pagina,
    };
    let vehiculos = await VehiculoCont.listaAsignados(paginacion, query);
    if (!vehiculos)
      res.render("vehiculoAsignadoLista", {
        err: "algun error ocurrio",
        title: "Asignacion de choferes",
        vehiculos: [],
        sesion: req.session.user,
      });
    else
      res.render("vehiculoAsignadoLista", {
        title: "Asignacion de choferes",
        vehiculos: vehiculos,
        sesion: req.session.user,
      });
  }
);

module.exports = router;
