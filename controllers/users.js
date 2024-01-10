const userModel = require("../models/user");

const { HttpStatus, HttpResponseMessage } = require("../enums/http");

module.exports.getUsers = async (req, res) => {
  try {
    const usersData = await userModel.find({}).orFail();
    res.send({ data: usersData });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(HttpStatus.NOT_FOUND).send({ error: "No se encontraron usuarios." });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.getUser = async (req, res) => {
  try {
    const userData = await userModel.findById(req.params.userId).orFail();
    res.send({ userData });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(HttpStatus.NOT_FOUND).send({ error: "No se encontro el usuario" });
    } else if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "ID de usuario inválido." });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: "Error al obtener el usuario." });
  }
};
module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await userModel.create({ name, about, avatar });
    res.send({ data: newUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "se pasaron datos invalidos al crear un user" });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
function isValidURL(url) {
  //valido manualmente ya que mongoose no valida mediante los mtodos findByIdAndUpdate
  return /https?:\/\/(www\.)?[a-zA-Z0-9\-]+(\.[a-zA-Z]{2,})?([a-zA-Z0-9\-._~:\/?%#\[\]@!$&'()*+,;=]*)?/.test(url);
}
module.exports.updateAvatar = async (req, res) => {
  try {
    let avatar = req.body.avatar;
    if (!isValidURL(avatar)) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "La URL no es válida para una actualizacion" });
    }
    const updateAvatar = await userModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );
    res.send({ data: updateAvatar });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.updateProfile = async (req, res) => {
  try {
    let { name, about } = req.body;
    const regex = /^[a-zA-Z0-9\s]{2,30}$/;
    if (!regex.test(name) || !regex.test(about)) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "datos no validos para actualizar el perfil" });
    }
    const dataProfile = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true }
    );
    res.send({ data: dataProfile });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(HttpStatus.NOT_FOUND).send({ error: "usuario no encontrado." });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
