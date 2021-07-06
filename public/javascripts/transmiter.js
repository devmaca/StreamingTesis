let placa = vehiculo.placa || "";

////////////////////////////////////////////////
//todo lo referente a la transmision de videos
var idCam1 = vehiculo.vid1 || "";
var idMic1 = vehiculo.aud1 || "";
var idCam2 = vehiculo.vid2 || "";
var idMic2 = vehiculo.aud2 || "";
var video = document.getElementById("video");
var video2 = document.getElementById("video2");

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
context.width = 200;
context.height = 150;

var canvas2 = document.createElement("canvas");
var context2 = canvas2.getContext("2d");
context2.width = 200;
context2.height = 150;

function log(message) {
  //logger.innerHTML = logger.innerHTML + message + "<br/>";
}

if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
}

/**
 * esta funcion solo es para testear
 * que funciona la grabacion con la camara
 */
async function initRT_test() {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        deviceId: { exact: idCam1 },
      },
      audio: {
        deviceId: { exact: idMic1 },
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      //aqui podemos transmitir este stream mediante socket
    });
}
function iniRT() {
  onVide(idCam1, idMic1, 1);
  onVide(idCam2, idMic2, 2);

  
}
function stopRT() {}

function onVide(idVid, idMic, op) {
  console.log("##", op, idVid, idMic);

  let constraints = {
    audio: { deviceId: idMic ? { exact: idMic } : undefined },
    video: {
      deviceId: idVid ? { exact: idVid } : undefined,
      
    },
  };
  if (op == 1) {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, successCallback, errorCallback);
    } else {
      log("Cannot access to the camera 1");
    }
  } else {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, successCallback2, errorCallback2);
    } else {
      log("Cannot access to the camera 2");
    }
  }
}
function successCallback(stream) {
  log("Broadcasting...");
  video.srcObject = stream;
  video.onloadedmetadata = function (e) {
    video.play();
  };
  //funcion para ir almacenando el video en local
  //antes de maandarlo al server
  receiveStream(stream);
}
function errorCallback(error) {
  log("Error broadcasting: " + error.code);
}
function successCallback2(stream) {
  log("Broadcasting 2...");
  video2.srcObject = stream;
  video2.onloadedmetadata = function (e) {
    video2.play();
  };
  receiveStream2(stream);
}
function errorCallback2(error) {
  log("Error broadcasting 2: " + error.code);
}

function sendFrame() {
  context.drawImage(video, 0, 0, context.width, context.height);
  transmitir(canvas.toDataURL("image/webp"), 1);
}
function sendFrame2() {
  context2.drawImage(video2, 0, 0, context2.width, context2.height);
  transmitir(canvas2.toDataURL("image/webp"), 2);
}

setInterval(() => {
  //console.log(window.document.location.host);
  //tomando fotogramas de las diferentes camaras;
  if (onOffStatus) {
    sendFrame();
    sendFrame2();
  } else {
  }
}, 200);

////////////////////////
//todo lo referente a sockets

//let socket = io("ws://192.168.28.12:3000");  ip negocio
let socket = io("ws://192.168.88.248:3000"); // ip casa
var channel = asignado._id;

socket.on("connect", function () {
  log("connected");
});

socket.on("disconnect", function () {
  log("disconnected");
});

socket.on("channel", function (data) {
  log("channel" + data);
});

///////////////////////////////////////////////////////////////
///funciones que usaran los transmisores
function subscribeTransmiter() {
  let data = {
    op: "IN_T",
    channel: channel,
  };
  socket.emit("channel", data);
}
function unSubscribeTransmiter() {
  let data = {
    op: "OUT",
    channel: channel,
  };
  socket.emit("channel", data);
}
function transmitir(dat, camNum) {
  let dataNow = {
    channel: channel,
    camNum: camNum,
    video: dat,
  };
  //console.log(camNum);
  socket.emit("trans", dataNow);
}

//////////////////////////////////////////////////////////////////
/////todo lo referente a la transmision de video para el historial
var chunks = [];
var chunks2 = [];
var medRecorder;
var medRecorder2;
//funcion para ir almacenando fragmentos del video

function receiveStream(stream) {
  //console.log('iniStream>>',stream);

  medRecorder = new MediaRecorder(stream);
  //console.log('iniRecord>>',medRecorder);
  medRecorder.ondataavailable = onDataFragment;
  medRecorder.onstop = stopRecorder;
  medRecorder.onstart = startRecorder;

  medRecorder.start();
  //console.log('finRecord>>',medRecorder);
}
function receiveStream2(stream) {
  //console.log('iniStream>>',stream);

  medRecorder2 = new MediaRecorder(stream);
  //console.log('iniRecord>>',medRecorder);
  medRecorder2.ondataavailable = onDataFragment2;
  medRecorder2.onstop = stopRecorder2;
  medRecorder2.onstart = startRecorder2;

  medRecorder2.start();
  //console.log('finRecord>>',medRecorder);
}

let onDataFragment = (fragment) => {
  chunks.push(fragment.data);
};
let onDataFragment2 = (fragment) => {
  chunks2.push(fragment.data);
};
let stopRecorder = (e) => {
  const vidBlob = new Blob(chunks, { type: "video/webm; codecs=webm" });
  let dataVid = {
    idAsignado: asignado._id,
    camara: 1,
    fecha: new Date(),
    video: vidBlob,
  };
  socket.emit("historial", dataVid);
};
let stopRecorder2 = (e) => {
  const vidBlob = new Blob(chunks2, { type: "video/webm; codecs=webm" });
  let dataVid = {
    idAsignado: asignado._id,
    camara: 2,
    fecha: new Date(),
    video: vidBlob,
  };
  socket.emit("historial", dataVid);
};
let startRecorder = () => {
  console.log("startrecorder");
  chunks = [];
};
let startRecorder2 = () => {
  console.log("startrecorder");
  chunks2 = [];
};
var onOffStatus = false;
function initRecordAll() {
  onOffStatus = true;
  subscribeTransmiter(); //suscribiendose a un channel
  iniRT(); //iniciando realTime y grabano video tambien
}
function stopRecordAll() {
  onOffStatus = false;
  unSubscribeTransmiter();
  medRecorder.stop(); // deteniendo el grabado de la camara
  medRecorder2.stop(); // deteniendo el grabado de la camara
  stopRT(); //deteniendo transmision realTime
}

//esta funcion graba cada 10000 milliseconds y lo sube al server
setInterval(() => {
  if (onOffStatus) {
    medRecorder.stop(); // detiene grabacion y otra funcion envia el video al server
    medRecorder2.stop(); // detiene grabacion y otra funcion envia el video al server
    iniRT(); //iniciando nuevamente todo
    //console.log('restart');
  } else {
  }
}, 10000);

function post(path, params, method = "post") {
  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = path;
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }
  document.body.appendChild(form);
  form.submit();
}
