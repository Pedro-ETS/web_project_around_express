const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;
const { HttpStatus, HttpResponseMessage } = require("../enums/http");

router.get('/', (req, res) => {
  const filePathCards = path.join(__dirname, '..', 'data', 'cards.json');
  fsPromises.readFile(filePathCards, { encoding: 'utf8' })
    .then((data) => {
       const jsonData = JSON.parse(data);
       res.json(jsonData);
    })
    .catch(err => {
     res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
    });
});

router.get('/:cardId', (req, res) => {
  const cardId = req.params.cardId;
  const filePathCards = path.join(__dirname, '..', 'data', 'cards.json');
  fsPromises.readFile(filePathCards, { encoding: 'utf8' })
    .then((data) => {
      const jsonData = JSON.parse(data);
      const user = jsonData.find(card => card._id === cardId);
      if (user) {
        res.json(user);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'ID de card no encontrado' });
      }
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
    });
});

module.exports = router;


