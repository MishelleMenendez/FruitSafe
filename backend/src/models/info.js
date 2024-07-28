const { Schema, model } = require("mongoose");

const InfoSchema = new Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true }
});

module.exports = model("Info", InfoSchema);
