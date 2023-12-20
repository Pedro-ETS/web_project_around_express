const router = require('express').Router();
const path = require('path');
const fsPromises = require('fs').promises;

router.get('/', (req, res) => {
  const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');
  fsPromises.readFile(filePathUsers, { encoding: 'utf8' })
    .then((data) => {
       const jsonData = JSON.parse(data);
       res.json(jsonData);
    })
    .catch(err => {
      res.status(500).send("Error interno en el servidor");
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
        res.status(404).json({ message: 'ID de usuario no encontrado' });
      }
    })
    .catch(err => {
      res.status(500).send('Error interno en el servidor');
    });
});

module.exports = router;

