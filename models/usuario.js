var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UsuarioSchema = new Schema(
  {
    nombre: String,
    apellido: String,
    telefono: Number,
    genero: String,
    direccion: String,
    ci: {
      type: String,
      unique: true,
    },
    estado: Number,
    email: String,
    password: String,
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
    rol: Number,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UsuarioSchema.virtual("asignado", {
  ref: "asignado",
  localField: "_id",
  foreignField: "idUsuario",
  justOne: false,
});
module.exports = mongoose.model("usuario", UsuarioSchema);
