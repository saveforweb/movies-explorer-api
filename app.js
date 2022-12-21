const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const errorsList = require('./errors/index');
const { errorCodes } = require('./utils/errorCodes');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to MongoDB');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  next(new errorsList.NotFoundError('Страница не найдена.'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = errorCodes.internalServerError, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === errorCodes.internalServerError
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
