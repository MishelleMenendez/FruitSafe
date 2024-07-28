const Info = require("../models/info");

// Método para obtener información
const getInfo = async (req, res) => {
  try {
    const info = await Info.find();
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Método para agregar información
const createInfo = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const nuevaInfo = new Info({ titulo, descripcion });
    await nuevaInfo.save();
    res.status(201).json(nuevaInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Método para modificar información
const updateInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    const info = await Info.findByIdAndUpdate(
      id,
      { titulo, descripcion },
      { new: true }
    );

    if (!info) {
      return res.status(404).json({ error: "Información no encontrada" });
    }

    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Método para eliminar información
const deleteInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const info = await Info.findByIdAndDelete(id);

    if (!info) {
      return res.status(404).json({ error: "Información no encontrada" });
    }

    res.status(200).json({ message: "Información eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createInfo,
  updateInfo,
  getInfo,
  deleteInfo
};
