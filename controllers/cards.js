const cardModel = require("../models/card");

const { HttpStatus, HttpResponseMessage } = require("../enums/http");

module.exports.getCards = async (req, res) => {
  try {
    const cards = await cardModel.find({}).orFail();
    res.send({ data: cards });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(HttpStatus.NOT_FOUND).send({ error: "No se encontraron tarjetas." });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await cardModel.create({ name, link, owner });
    res.send({ data: newCard });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "se pasaron datos invalidos al crear una card" });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.deleteCard = async (req, res) => {
  try {
    const existingCard = await cardModel.findByIdAndDelete(req.params.id).orFail();
    res.send({ data: existingCard });
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return res.status(HttpStatus.NOT_FOUND).send({ error: "Tarjeta no encontrada" });
    } else if (error.name === "ValidationError") {
      return res.status(HttpStatus.BAD_REQUEST).send(HttpResponseMessage.BAD_REQUEST);
    } else if (error.name === "CastError") {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: "Invalid card ID" });
    }
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.likeCard = async (req, res) => {
  try {
    const updatedCard = await cardModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    res.send({ data: updatedCard });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
module.exports.dislikeCard = async (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  try {
    const updatedCard = await cardModel.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!updatedCard) {
      return res.status(HttpStatus.NOT_FOUND).send({ error: 'Tarjeta no encontrada' });
    }
    res.send (updatedCard);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
  }
};
