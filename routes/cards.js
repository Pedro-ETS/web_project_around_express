const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;
router.get('/cards', (req, res) => {
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
module.exports = router;

