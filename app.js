const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const validator = require('validator');

const user = require('./routes/user');
const { login } = require('./controller/user');
const { createUser } = require('./controller/user');
const { auth } = require('./middlewears/auth');
const { processError } = require('./middlewears/error');
const NotFound = require('./errors/not-found-err');

const app = express();

const checkEmail = (value) => {
  if (!validator.isEmail(value)) {
    throw new Error('Некорректный email');
  }
  return value;
};

const checkUrl = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(checkEmail, 'custom email validate'),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkUrl, 'custom url validation'),
    email: Joi.string().required().custom(checkEmail, 'custom email validate'),
    password: Joi.string().required(),
  }),
}), createUser);
app.use('/users', auth, user);
app.use('/cards', auth, require('./routes/card'));

app.use((req, res, next) => {
  next(new NotFound('Маршрут не найден'));
});
app.listen(3000);
app.use(errors());
app.use(processError);
