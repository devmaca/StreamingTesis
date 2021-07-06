const path = require("path");
const os = require("os");
const fs = require("fs");
const AsignadoCont = require("../controllers/asignadoController");
//var vehiculoCont = require('../controllers/vehiculoControllers');
module.exports = function (io) {
  var sockets = {
    io: io,
    idAdmin: null,
  };
  var transmiters = [];
  var receivers = [];
  sockets.io.on("connection", function (socket) {
    //console.log("client on:",socket.client);//informacion del cliente ampliada
    //console.log('conectado',socket.handshake); //informacion del cliente resumida
    ////////////////////////////////////////////////////
    console.log(socket.id, "conectado");
    socket.on("disconnect", function () {
      console.log(socket.id, "desconectado");
      //console.log('------> desconectado');
    });
    socket.on("test", function (data) {
      console.log(data);
      socket.emit("test", { data: "dataServer" });
    });
    socket.on("channel", function (data) {
      if (data.op == "OUT") {
        socket.leave(data.channel);
        for (let index = 0; index < transmiters.length; index++) {
          const element = transmiters[index];
          if (element.channel == data.channel) {
            transmiters.splice(index, 1);
            console.log("out2", transmiters);
            break;
          }
        }
        socket.broadcast.emit("status", { transmiters: transmiters });
      }
      if (data.op == "IN_T") {
        let transmiter = {
          idSocket: socket.id,
          channel: data.channel,
        };
        transmiters.push(transmiter);
        socket.broadcast.emit("status", { transmiters: transmiters });
        socket.join(data.channel);
      }
      if (data.op == "IN_R") {
        let receiver = {
          idSocket: socket.id,
          channel: data.channel,
        };
        receivers.push(receiver);
        socket.join(data.channel);
      }
      socket.emit("channel", "ok!!");
    });
    socket.on("status", function () {
      console.log("status");
      io.emit("status", { transmiters: transmiters });
    });
    socket.on("trans", function (data) {
      console.log("trans", data.channel, data.camNum);
      io.to(data.channel).emit("videoReceive", {
        video: data.video,
        camNum: data.camNum,
      });
    });

    //para el historial de grabaciones vamos guardando fragmento
    //a fragmento todos los videos
    socket.on("historial", async function (data) {
      var dataNow = {
        idAsignado: data.idAsignado,
        camara: data.camara,
        fecha: data.fecha,
        nombre: `${new Date(data.fecha).getTime()}_${data.camara}.webm`,
        video: data.video,
      };
      await AsignadoCont.anadirVideo(null, dataNow);
      fs.writeFile(
        "./public/videos/" + dataNow.nombre,
        dataNow.video,
        {},
        (err, resp) => {
          console.log(err, resp);
        }
      );
    });
  });
  return sockets;
};
