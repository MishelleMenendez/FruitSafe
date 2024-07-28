const express = require('express');
const { getFirebaseData } = require('../controllers/firebaseController');
const {
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
} = require("../controllers/frutasController");
const {
  createInfo,
  updateInfo,
  getInfo,
  deleteInfo
} = require("../controllers/infoController");

const router = express.Router();

router.get("/", (req, res) => { res.send("Hello World") });
router.get("/usuarios", getUsuarios);
router.post("/registro", registro);
router.post("/login", login);
router.put("/usuarios/:cedula/change-password", authenticate, changePassword);

router.get("/info", getInfo);
router.post("/info", createInfo);
router.put("/info/:id", updateInfo);
router.delete("/info/:id", deleteInfo);

router.get("/firebase", getFirebaseData);

router.use(authenticate);

router.get("/usuarios/:cedula/frutas", getFrutas);
router.post("/usuarios/:cedula/frutas", createFruta);
router.put("/usuarios/:cedula/frutas/:id", updateFruta);
router.delete("/usuarios/:cedula/frutas/:id", deleteFruta);

router.put("/usuarios/:cedula", updateUsuario);

module.exports = router;
