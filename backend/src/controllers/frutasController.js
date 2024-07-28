const Usuario = require("../models/user");
const Fruta = require("../models/frutas");
const jwt = require("jsonwebtoken");

const secretKey = "secret_key";

const registro = async (req, res) => {
  try {
    const { nombres, cedula, correo, password, perfil } = req.body;
    const nuevoUsuario = new Usuario({
      nombres,
      cedula,
      correo,
      password,
      perfil
    });
    await nuevoUsuario.save();
    const token = jwt.sign({ id: nuevoUsuario._id }, secretKey);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    
    // Buscar el usuario solo por el correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Validar la contraseña por separado
    if (usuario.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: usuario._id }, secretKey);
    res.status(200).json({ token, perfil: usuario.perfil, cedula: usuario.cedula });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUsuario = async (req, res) => {
    try {
      const { cedula } = req.params;
      const { nombres, correo, password, perfil } = req.body;
  
      const usuario = await Usuario.findOneAndUpdate(
        { cedula },
        { nombres, correo, password, perfil },
        { new: true }
      );
  
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      res.status(200).json(usuario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const changePassword = async (req, res) => {
    try {
      const { cedula } = req.params;
      const { oldPassword, newPassword } = req.body;
  
      const usuario = await Usuario.findOne({ cedula });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      if (usuario.password !== oldPassword) {
        return res.status(401).json({ error: "Contraseña antigua incorrecta" });
      }
  
      usuario.password = newPassword;
      await usuario.save();
  
      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autorización no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.userId = decoded.id;
    next();
  });
};

const getFrutas = async (req, res) => {
  try {
    const { cedula } = req.params;
    const usuario = await Usuario.findOne({ cedula }).populate("frutas");
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario.frutas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFruta = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { nombre, sensorValue } = req.body;
    const usuario = await Usuario.findOne({ cedula });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const nuevaFruta = new Fruta({
      nombre,
      sensorValue, // Asegúrate de que sensorValue es un arreglo de números
      usuario: usuario._id,
    });

    await nuevaFruta.save();
    usuario.frutas.push(nuevaFruta);
    await usuario.save();

    res.status(201).json(nuevaFruta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateFruta = async (req, res) => {
    try {
      const { cedula, id } = req.params;
      const { nombre, valorSensor } = req.body;
  
      const usuario = await Usuario.findOne({ cedula });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
  
      const fruta = await Fruta.findOneAndUpdate(
        { _id: id, usuario: usuario._id },
        { nombre, valorSensor },
        { new: true }
      );
      if (!fruta) {
        return res.status(404).json({ error: "Fruta no encontrada" });
      }
  
      res.status(200).json(fruta);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
  

const deleteFruta = async (req, res) => {
  try {
    const { cedula, id } = req.params;

    const usuario = await Usuario.findOne({ cedula });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const fruta = await Fruta.findOneAndDelete({
      _id: id,
      usuario: usuario._id,
    });
    if (!fruta) {
      return res.status(404).json({ error: "Fruta no encontrada" });
    }

    usuario.frutas.pull(fruta._id);
    await usuario.save();

    res.status(200).json({ message: "Fruta eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registro,
  login,
  authenticate,
  getFrutas,
  createFruta,
  updateFruta,
  deleteFruta,
  getUsuarios,
  updateUsuario,
  changePassword
};
