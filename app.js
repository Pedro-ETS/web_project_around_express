const express = require('express');
const app = express();
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator'); 
const { errors } = require('celebrate');
const {login, createUser} = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { HttpStatus, HttpResponseMessage } = require('./enums/http');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

mongoose.connect("mongodb://localhost:27017/aroundb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.post('/signin',celebrate({
  body: Joi.object().keys({
    email:  Joi.string().email().required(),
    password:  Joi.string().required().min(8)
  }),
}), login);

app.post('/signup',celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email:  Joi.string().email().required(),
    password:  Joi.string().required().min(8)
  }),
}), createUser);

app.use(auth);
app.use("/users", usersRouter);

app.use("/cards", cardsRouter);


app.use((req, res) => {
  return res
    .status(HttpStatus.BAD_REQUEST)
    .send(HttpResponseMessage.BAD_REQUEST);
});

app.use(errors());

app.use((err, req, res, next) => {
   const { statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message } = err;
   res
     .status(statusCode)
     .send({
       message: statusCode === 500
         ? 'Se ha producido un error en el servidor'
         : message
     });
 });

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
