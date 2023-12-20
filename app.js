const express = require("express");
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  return res.status(HttpStatus.BAD_REQUEST).send(HttpResponseMessage.BAD_REQUEST);
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

