const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;

router.get('/', (req, res) => {
  const filePathCards = path.join(__dirname, '..', 'data', 'cards.json');
  fsPromises.readFile(filePathCards, { encoding: 'utf8' })
    .then((data) => {
       const jsonData = JSON.parse(data);
       res.json(jsonData);
    })
    .catch(err => {
      res.status(500).send('Error interno en el servidor');
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
        res.status(404).json({ message: 'ID de card no encontrado' });
      }
    })
    .catch(err => {
      res.status(500).send('Error interno en el servidor');
    });
});

module.exports = router;


