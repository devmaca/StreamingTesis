'use strict'
console.log(0, $);

// Funcion para validar campos del formulario
function validarCampos(form) {
  // la variable form es el objeto formulario (nativo)
  let formValido = true;
  if (!form.nombre.value) {
    formValido = false;
    mostrarAlerta(form.nombre, 'Debes escribir un nombre.','warning');
  } else if(validarTexto(form.nombre.value)== false){
    mostrarAlerta(form.nombre, 'No se permite datos numericos en este campo', 'warning')
    formValido = false;
  }
  if (!form.apellido.value) {
    formValido = false;
    mostrarAlerta(form.apellido, 'Debes escribir por lo menos un apellido p.','warning');
  } else if(validarTexto(form.apellido.value)== false){
    mostrarAlerta(form.apellido, 'No se permite datos numericos en este campo', 'warning')
    formValido = false;
  }
  /*if (!form.telefono.value) {
    formValido = false;
    mostrarAlerta(form.telefono, 'Debes escribir el numero de telefono.','warning');
  }
  if (!form.direccion.value) {
    formValido = false;
    mostrarAlerta(form.direccion, 'Debes escribir una direccion.','warning');
  }
 if (!form.ci.value) {
    formValido = false;
    mostrarAlerta(form.ci, 'Debes escribir el numero cedula de identidad.','warning');
  }*/
  return formValido;
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
function mostrarAlerta(elemento, mensaje, tipo, noCerrar) {
  tipo = tipo || 'success';
  //let alertas = elemento.getElementsByClassName('alert alert-'+tipo);
  let cap=elemento.parentNode.getElementsByClassName('text-danger small pt-0 mt-0');
  console.log(cap.length)
  
  // if (alertas.length<1) {
    if (cap.length<1) {
    let alert = document.createElement('p');

    alert.innerHTML = mensaje;
    alert.setAttribute('id',elemento.name);
    alert.setAttribute('style','position:initial; width:150%; left:10%; top:20;');
    alert.setAttribute('class','text-danger small pt-0 mt-0' )//+ (!noCerrar?'alert-dismissible':'') + ' fade show');
    // alert.setAttribute('role','alert');
    // if (!noCerrar) {
    //   let button = document.createElement('BUTTON');
    //   button.setAttribute('class','close');
    //   button.setAttribute('type','button');
    //   button.setAttribute('data-dismiss','alert');
    //   button.innerHTML = '<span aria-hidden="true">×</span>';
    //   alert.append(button);
    // }
    elemento.parentNode.append(alert);
    elemento.setAttribute('onkeydown',`borrarAlertas(this,'${tipo}')`);
  }
}


function borrarAlertas(elemento, tipo) {
  // let alertas = elemento.parentNode.getElementsByClassName('alert alert-'+tipo);
  let alertas = elemento.parentNode.getElementsByClassName('text-danger small pt-0 mt-0');
  for (let i=0;i<alertas.length;i++) {
    elemento.parentNode.removeChild(alertas[i]);
  }
}
// Enviar por post y mostrar alertas
function enviarFormPostAlertas(idform) {
	let conten=document.getElementById('form');
	//validacion de datos ingresados
	if(validarCampos(conten)==true){
		console.log('datos validados!!!!', validarCampos(conten))
    console.log(conten);
		
		let formObj = {};
		let form = jQuery(`#${idform}`);

		$.each(form.serializeArray(), function (i, input) {
		  formObj[input.name] = input.value;
		});
		// console.log('JSON', formObj);
		$.ajax({
			url:`api/user`,
			method:'post',
			data:formObj,
			headers: { 
				authorization: 'JWT eyqweqweqweqweoqwiepiqwe='
			},
			xhrFields: {
      			withCredentials: true
    		}
		}).done(function (resp) {
			 // la peticion api se realizo correctamente
   			 console.log(1, "success", resp.msj,'  ',resp.dato);
   			 alert(resp.msj)
		}).fail(function(err){
			console.log(2, "error", err.status, err.responseJSON);
			// alert(2, "error", err.status, err.responseJSON);
		}).always(function(){
			console.log(3, "complete");
		})
	}
	else{
		console.log('datos no validos!!!'+ validarCampos(conten))
	}

  }



//para validar campos numeros
document.getElementById('ci').addEventListener("keypress", soloNumeros, false);
// document.getElementById('telefono').addEventListener("keypress", soloNumeros, false);


//Solo permite introducir numeros.
function soloNumeros(e){
  var key = window.event ? e.which : e.keyCode;
  if (key < 48 || key > 57) {
    e.preventDefault();
  }
}


