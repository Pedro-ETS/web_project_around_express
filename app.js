const express = require("express");

const app = express();

const mongoose = require("mongoose");

const usersRouter = require("./routes/users");

const cardsRouter = require("./routes/cards");

const { HttpStatus, HttpResponseMessage } = require("./enums/http");

mongoose.connect("mongodb://localhost:27017/aroundb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "659afee40b4aa06cac6ebff3",
  };

  next();
});
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use((req, res) => {
  return res
    .status(HttpStatus.BAD_REQUEST)
    .send(HttpResponseMessage.BAD_REQUEST);
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
