const { Schema, model } = require("mongoose");

const FrutaSchema = new Schema(
  {
    nombre: { type: String, required: true },
    sensorValue: { type: [Number], required: true },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuarios", required: true }
  },
  {
    timestamps: true
  }
);

module.exports = model("Frutas", FrutaSchema);
