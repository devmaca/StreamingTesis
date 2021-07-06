var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var VehiculoSchema = new Schema(
  {
    idPropietario: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
    },
    numeroMovil: Number,
    chasis: String,
    placa: {
      type: String,
      unique: true,
      required: true,
    },

    modelo: Number,
    marca: String,
    color: String,
    aud1: String,
    vid1: String,
    aud2: String,
    vid2: String,
    estado: Number,
    creadoEn: {
      fecha: Date,
      idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
      },
    },
    modificadoEn: {
      fecha: Date,
      idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

VehiculoSchema.virtual("asignado", {
  ref: "asignado",
  localField: "_id",
  foreignField: "idVehiculo",
  justOne: false,
});
module.exports = mongoose.model("vehiculo", VehiculoSchema);
