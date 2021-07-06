var logger = document.getElementById("logger");
var img = document.getElementById("frame");
var img2 = document.getElementById("frame2");
let stateSub = false;
function log(message) {
  //logger.innerHTML = logger.innerHTML + message + "<br/>";
}

////////////////////////
//todo lo referente a sockets
//let socket = io("ws://192.168.28.12:3000");
let socket = io("ws://192.168.88.248:3000"); 
var channel = asignado._id;
//console.log("datos>",ve);

socket.on("connect", function () {
  log("connected");
});

socket.on("disconnect", function () {
  log("disconnected");
});

socket.on("channel", function (data) {
  log("channel" + data);
});
socket.on("videoReceive", function (data) {
  if (data.camNum == 1) {
    img.src = data.video;
  }
  if (data.camNum == 2) {
    img2.src = data.video;
  }
});

//////////////////////////////////////////////////////////////////
/////funciones que usaran los receptores
function subscribeReceiver() {
  if (stateSub) {
    stateSub = false;
    img.width = "0px";
    img.height = "0px";
    img2.width = "0px";
    img2.height = "0px";
    let data = {
      op: "OUT",
      channel: channel,
    };
    socket.emit("channel", data);
  } else {
    stateSub = true;
    img.width = "500";
    img.height = "500";
    img2.width = "500";
    img2.height = "500";
    let data = {
      op: "IN_R",
      channel: channel,
    };
    socket.emit("channel", data);
  }
}

function playVideo(nombre, camara) {
  var myModalEl = document.getElementById("exampleModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();

  //armaremos un video con todos los videos que quedan a partir del video seleccionado
  let vidCam1 = [];
  let vidCam2 = [];

  let isOkey = false;
  for (let index = 0; index < asignado.videos.length; index++) {
    const element = asignado.videos[index];
    if (element.nombre == nombre) {
      isOkey = true;
    }
    if (isOkey) {
      if (element.camara == 1) {
        vidCam1.push(element);
      } else {
        vidCam2.push(element);
      }
    }
  }

  var v1 = document.getElementById("video1");
  var v2 = document.getElementById("video2");
  var wbm1 = document.getElementById("webm1");
  var wbm2 = document.getElementById("webm2");

  let cont1 = 0;
  let cont2 = 0;
  v1.onended = function () {
    if (cont1 < vidCam1.length) {
      cont1++;
      wbm1.src = "/videos/" + vidCam1[cont1].nombre;
      v1.load();
      v1.play();
    }
    console.log("finalizando1");
  };
  v2.onended = function () {
    if (cont2 < vidCam2.length) {
      cont2++;
      wbm2.src = "/videos/" + vidCam2[cont2].nombre;
      v2.load();
      v2.play();
    }
    console.log("finalizando2");
  };

  wbm1.src = "/videos/" + vidCam1[0].nombre;
  v1.load();
  v1.play();

  wbm2.src = "/videos/" + vidCam2[0].nombre;
  v2.load();
  v2.play();
}
