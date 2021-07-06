var express = require("express");
var router = express.Router();
var vehiculoCont = require("../controllers/vehiculoController");
var UsuarioCont = require("../controllers/usuarioController");
const MyMidd = require("../midleware/myMiddleware");

router.get("/guardar",async function  (req, res, next) {
  if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
    res.redirect("/login");
    return;
  }

  let reqQueryParaUsuario={};

  if (req.query.nombreOCi) {
    reqQueryParaUsuario.nombreOCi = req.query.nombreOCi;
  }

  let usuarios = await UsuarioCont.listarUsuariosParaDueno(reqQueryParaUsuario);

  res.render("vehiculoForm", { 
    title: "registro Vehiculo", 
    vehiculo: {},
    sesion:req.session.user,
    usuarios:usuarios,
  },);
});
/**
 * si son administradores pueden registrar un vehiculo
 */
router.post(
  "/guardar",
  async function (req, res, next) {
    if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
      res.redirect("/login");
      return;
    }

    if (req.body._id) {
      //actualizando los valores de vehiculo
      let query = {
        _id: req.body._id,
      };
      let vehiculo = await vehiculoCont.actualizar(
        query,
        req.session.user,
        req.body
      );
      //si ocurrio algun error al modificar el vehiculo
      if (!vehiculo)
        res.render("vehiculoForm", {
          err: "no se pudo actualizar",
          title: "datos de vehiculo",
          vehiculo: req.body,
          sesion:req.session.user
        });
      //si todo salio correctamente
      else res.redirect(`/vehiculo/detalle?_id=${vehiculo._id}`);
    } else {
      //debemos registrar el documento
      let vehiculo = await vehiculoCont.registrar(req.session.user, req.body);
      if (!vehiculo)
        res.render("vehiculoForm", {
          err: "no se pudo realizar el registro",
          title: "datos de vehiculo",
          vehiculo: req.body,
          sesion:req.session.user
        });
      else res.redirect(`/vehiculo/detalle?_id=${vehiculo._id}`);
    }
  }
);
//cambio de estado meditane GET

router.get("/estado", async function (req, res, next) {
  if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
    res.redirect("/login");
    return;
  }
  //obtenemos los valores de la consulta
  let query = {
    _id: req.query._id,
  };
  //obtenemos los datos del formulario de la vista
  let vehiculoUpdateData = {
    estado: req.query.estado,
  };
  //llamamos al controlador para editar al usuario
  let usuario = await vehiculoCont.actualizar(
    query,
    req.session.user,
    vehiculoUpdateData
  );
  res.redirect(`/vehiculo/listar`);
});

/**
 * detalle de un vehiculo obtenido por id
 */
router.get("/detalle",  async function (req, res, next) {
  if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
    res.redirect("/login");
    return;
  }

  let query = {};
  query._id = req.query._id;
  let vehiculo = await vehiculoCont.buscarUnoConConsulta(query);

  let reqQueryParaUsuario={};

  if (req.query.nombreOCi) {
    reqQueryParaUsuario.nombreOCi = req.query.nombreOCi;
  }

  let usuarios = await UsuarioCont.listarUsuariosParaDueno(reqQueryParaUsuario);

  if (!vehiculo)
    res.render("vehiculoForm", {
      err: "no se encontro el registro",
      title: "datos de vehiculo",
      vehiculo: { _id: query._id },
      usuarios:usuarios,
      sesion:req.session.user
    });
  else
    res.render("vehiculoForm", {
      title: "datos de vehiculo",
      vehiculo: vehiculo,
      usuarios:usuarios,
      sesion:req.session.user
    });
});

/**
 * lista y buscador por placa de vehiculo
 */
router.get("/listar", async function (req, res, next) {
  if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
    res.redirect("/login");
    return;
  }



  let query = {};
  if (req.query.placa) query.placa = req.query.placa;
  let paginacion = {
    porPagina: req.query.porPagina,
    pagina: req.query.pagina,
  };
  let vehiculos = await vehiculoCont.listar(paginacion, query);
  if (!vehiculos)
    res.render("vehiculoLista", {
      err: "algun error ocurrio",
      title: "Lista de vehiculos",
      vehiculos: [],
      sesion:req.session.user
    });
  else
    res.render("vehiculoLista", {
      title: "lista de vehiculos",
      vehiculos: vehiculos,
      sesion:req.session.user
    });
});


module.exports = router;
