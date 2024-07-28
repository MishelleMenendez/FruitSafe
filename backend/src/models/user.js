const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    nombres: { type: String, required: true },
    cedula: { type: String, required: true },
    correo: { type: String, required: true },
    password: { type: String, required: true },
    perfil: { type: Number, required: true },
    frutas: [{ type: Schema.Types.ObjectId, ref: "Frutas" }]
  },
  {
    timestamps: true
  }
);

module.exports = model("Usuarios", UserSchema);
