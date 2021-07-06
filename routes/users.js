var express = require("express");
var router = express.Router();

let usuarioCont = require("./../controllers/usuarioController");
let MyMidd = require("./../midleware/myMiddleware");

/**
 * obtenemos el formulario para el registro del usuario
 */
router.get("/guardar", function (req, res, next) {
	// if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
	//   res.redirect("/login");
	//   return;
	// }

	//validamos al usuarios si tiene acceso
	/***codigo  */

	//retornamos el formulario sin datos por ser un registro
	res.render("usuarioForm", { title: "registrar Usuario", usuario: {} ,sesion:req.session.user});
});

/**
 * guardamos los datos del usuario
 * si viene con _id se guarda en una actualizacion
 * si viene sin _id es un usuario nuevo asi que registramos al usuario
 */
router.post("/guardar", async function (req, res, next) {
	// if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
	//   res.redirect("/login");
	//   return;
	// }
	//validamos al usuarios si tiene acceso

	//nos aseguramos que rol sea un array desde el formulario de registro
	if(!req.body.rol) throw new Error(" no hay roles seleccionados para este usuario");





	/***codigo  */

	if (req.body._id) {
		//tiene un _id asi que es una actualizacion del usuarios
		let reqQuery = {
			_id: req.body._id,
		};

		//obtenemos los datos del formulario de la vista
		let userUpdateData = req.body;
		//llamamos al controlador para editar al usuario
		let usuario = await usuarioCont.actualizar(
			reqQuery,
			req.session.user,
			userUpdateData
		);

		//verificamos que se actualizo al usuario correctamente
		if (!usuario){
			res.render("usuarioForm", {
				msj: null,
				err: "algun error al actualizar al usuario",
				title: "Datos de usuario",
				usuario: req.body,
				sesion:req.session.user
			});}
		else {res.redirect(`/usuario/detalle?_id=${usuario._id}`);}
	} else {
		//no tiene un _id asi que es un regsitro de usuario nuevo

		let nuevoUsuario = req.body;

		//el _id  se autogenera asi que no debemos usarlo
		delete nuevoUsuario._id;
		//obtenemos el usuarios registrado
		let usuario = await usuarioCont.registrar(req.session.user, nuevoUsuario);
		if (!usuario)
			res.render("usuarioForm", {
				msj: null,
				err: "algun error al registrar al usuario",
				title: "registrar Usuario",
				usuario: req.body,
				sesion:req.session.user
			});
		else res.redirect(`/usuario/detalle?_id=${usuario._id}`);
	}
});
// +++++++++++++++++++++++++++++++++
// Api Rest para Usuario con Ajax
// +++++++++++++++++++++++++++++++++
router.route('/api/user')
	.get(usuarioCont.userGet)
	.post(usuarioCont.userPost)


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
	let userUpdateData = {
		estado: req.query.estado,
	};
	//llamamos al controlador para editar al usuario
	let usuario = await usuarioCont.actualizar(
		query,
		req.session.user,
		userUpdateData
	);
	res.redirect(`/usuario/listar`);
});

/**
 * consulta para obtener el detalle de un usuario
 */
router.get("/detalle", async function (req, res, next) {
	if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
		res.redirect("/login");
		return;
	}

	//obtenemos los valores de la consulta
	let query = {
		_id: req.query._id,
	};

	//obtenemos la lista de usuarios de la base de datos
	let usuario = await usuarioCont.buscarUnoConConsulta(query);
	if (!usuario)
		res.render("usuarioForm", {
			title: "Datos de usuario",
			err: "Usuario no encontrado",
			usuario: {},
			sesion:req.session.user
		});
	else
		res.render("usuarioForm", {
			title: "Datos de usuario",
			usuario: usuario,
			sesion:req.session.user
		});
});

router.get("/listar", async function (req, res, next) {
	if (!(MyMidd.esAdministrador(req.session.user)||MyMidd.esOperador(req.session.user))) {
		res.redirect("/login");
		return;
	}

	//obtenemos los datos de la paginacion
	let paginacion = {
		porPagina: req.query.porPagina,
		pagina: req.query.pagina,
	};

	//tomamos los valores de la consulta
	let reqQuery = {
		nombreOCi: req.query.nombreOCi,
	};

	//obtenemos la lista de usuarios de la base de datos
	let usuarios = await usuarioCont.listar(paginacion, reqQuery);

	//listamos en la vista
	res.render("usuarioLista", {
		title: "lista de usuarios",
		usuarios: usuarios,
		paginacion: paginacion,
		sesion:req.session.user
	});
});

module.exports = router;
