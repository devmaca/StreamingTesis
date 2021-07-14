'use strict'
console.log(0, $);
function mostrarAlerta(elemento, mensaje, tipo) {
	tipo = tipo || 'success';
	let cap=elemento.parentNode.getElementsByClassName('text-danger small pt-0 mt-0');
	console.log(cap.length)

	if (cap.length<1) {
		let alert = document.createElement('p');

		alert.innerHTML = mensaje;
		alert.setAttribute('id',elemento.name);
		alert.setAttribute('style','position:initial; width:150%; left:10%; top:20;');
		alert.setAttribute('class','text-danger small pt-0 mt-0' )

		elemento.parentNode.append(alert);
		// elemento.setAttribute('onkeydown',`borrarAlertas(this,'${tipo}')`);
		if(elemento.tagName == 'SELECT'){
		elemento.setAttribute('onclick',`borrarAlertas(this,'${tipo}')`);
		}
		if(elemento.tagName == 'INPUT'){
		elemento.setAttribute('onkeydown',`borrarAlertas(this,'${tipo}')`);
		}
		//console.log('let met physical...',elemento.parentNode)
	}
}
function validarCampos(form){
	let formValido = true;
	if(!form.idUsuario.value){
		formValido = false;
		mostrarAlerta(form.idUsuario, 'Debe seleccionar una opcion..', 'warning')
	}
	if(!form.numeroMovil.value){
		formValido = false;
		mostrarAlerta(form.numeroMovil, 'Debe escribir el numero del movil.', 'warning')
	}
	if(!form.placa.value){
		formValido = false;
		mostrarAlerta(form.placa, 'Debe escribir la placa', 'warning')
	}
	if(!form.chasis.value){
		formValido = false;
		mostrarAlerta(form.chasis, 'Debe escribir el chasis', 'warning')
	}
	if(!form.modelo.value){
		formValido = false;
		mostrarAlerta(form.modelo, 'Debe escribir el modelo', 'warning')
	}
	if(!form.marca.value){
		formValido = false;
		mostrarAlerta(form.marca, 'Debe escribir la marca', 'warning')
	}else if(validarTexto(form.marca.value) == false){
		mostrarAlerta(form.marca, 'No se permite numeros en este campo', 'warning')
		formValido = false;
	}
	if(!form.color.value){
		formValido = false;
		mostrarAlerta(form.color, 'Debe escribir el color', 'warning')
	}if(validarTexto(form.color.value) == false){
		mostrarAlerta(form.color, 'No se permite numeros en este campo', 'warning')
		formValido = false;
	}
	if(!form.estado.value){
		formValido = false;
		mostrarAlerta(form.estado, 'Debe seleccionar una opcion', 'warning')
	}
	console.log('========', form.idUsuario.value)
	console.log(formValido)
	return formValido;
}
function borrarAlertas(elemento, tipo) {
  // let alertas = elemento.parentNode.getElementsByClassName('alert alert-'+tipo);
  let alertas = elemento.parentNode.getElementsByClassName('text-danger small pt-0 mt-0');
  for (let i=0;i<alertas.length;i++) {
    elemento.parentNode.removeChild(alertas[i]);
  }
}

function mensajeAlerta(elemento,msg,tipo){
  // let tipo = 'success';
  let alerta = document.createElement('DIV');
  alerta.innerHTML = msg;
  alerta.setAttribute('class','alert alert-'+tipo+' alert-dismissible fade show');
  alerta.setAttribute('role','alert');

  let button = document.createElement('BUTTON');
  button.setAttribute('type','button');
  button.setAttribute('class','btn-close');
  button.setAttribute('data-bs-dismiss','alert');
  button.setAttribute('aria-label','Close');
  // button.innerHTML = '<span aria-hidden="true">&times;</span>';
  alerta.append(button);
  elemento.append(alerta);
}
function enviarFormPostAlertas(idform){
	let conten=document.getElementById('form');
	//validacion de datos ingresados
	if(validarCampos(conten)==true){
		let formObj = {};
		let form = jQuery(`#${idform}`);
		$.each(form.serializeArray(), function (i, input){
			formObj[input.name] = input.value;
		})
		console.log(formObj)
		$.ajax({
			url:`api/vehiculo`,
			method:'post',
			data:formObj,
			headers: {
				authorization: 'JWT eyqweqweqweqweoqwiepiqwe='
			},
			xhrFields: {
					withCredentials: true
			}
		}).done(function(resp){
			console.log(1, 'success', resp.msj, ' ' , resp.dato );
			let contenedorAlerta = document.getElementById('alertas-api');
         contenedorAlerta.innerHTML = '';
          if(contenedorAlerta){
          mensajeAlerta(contenedorAlerta, resp.msj, "success");
         }
		}).fail(function (err) {
			console.log(2, "error", err.status, err.responseJSON);
		}).always(function() {
			console.log(3, "complete");
		})
	}else{
		let contenedorAlerta = document.getElementById('alertas-api');
         contenedorAlerta.innerHTML = '';
          if(contenedorAlerta){
          mensajeAlerta(contenedorAlerta, "Campos incompletos.....", "warning");
         }
	}
}

//funcion validar solo letras no numeros
function validarTexto(parametro){
  var patron = /^[a-zA-Z\s]*$/;
  if(parametro.search(patron)){
	 return false;
  } else{
	 return true;
  }
}
//para validar campos numeros
document.getElementById('numeroMovil').addEventListener("keypress", soloNumeros, false);
document.getElementById('modelo').addEventListener("keypress", soloNumeros, false);
//Solo permite introducir numeros.
function soloNumeros(e){
  var key = window.event ? e.which : e.keyCode;
  if (key < 48 || key > 57) {
	 e.preventDefault();
  }
}