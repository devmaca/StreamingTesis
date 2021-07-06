var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AsignadoSchema = new Schema({
  idVehiculo: {
    type: Schema.Types.ObjectId,
    ref: "vehiculo",
  },
  idUsuario: {
    type: Schema.Types.ObjectId,
    ref: "usuario",
  },
  asignadoEn: {
    fecha: Date,
    idUsuario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
    },
    descripcion: String,
  },
  finalizadoEn: {
    fecha: Date,
    idUsuario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
    },
    descripcion: String,
  },
  videos: [
    {
      camara: Number,
      fecha: Date,
      nombre: String,
    },
  ],
});
module.exports = mongoose.model("asignado", AsignadoSchema);
