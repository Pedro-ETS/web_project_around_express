const express = require("express"); //establecemos express para trabajar
const app = express();
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
app.use("/", usersRouter);
app.use("/", cardsRouter);
app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});
const { PORT = 3000 } = process.env; //levantamos el servidor mediante el puerto por defecto
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
