const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;
const { HttpStatus, HttpResponseMessage } = require("../enums/http");

router.get('/', (req, res) => {
  const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');
  fsPromises.readFile(filePathUsers, { encoding: 'utf8' })
    .then((data) => {
       const jsonData = JSON.parse(data);
       res.json(jsonData);
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
    });
});

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');
  fsPromises.readFile(filePathUsers, { encoding: 'utf8' })
    .then((data) => {
      const jsonData = JSON.parse(data);
      const user = jsonData.find(usuario => usuario._id === userId);
      if (user) {
        res.json(user);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ message: 'ID de usuario no encontrado' });
      }
    })
    .catch(err => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpResponseMessage.SERVER_ERROR);
    });
});

module.exports = router;

