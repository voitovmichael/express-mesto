// const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFound = require('../errors/not-found-err');
const IncorectAuth = require('../errors/incorect-auth');
const SameDataError = require('../errors/same-data-err');

const getUsers = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    User.find({}).then((user) => res.status(200).send({ user }))
      .catch(() => next(new NotFound('Пользователей не существует')));
  }
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcryptjs.hash(password, 10)
          .then((hash) => {
            User.create({
              name, about, avatar, email, password: hash,
            })
              .then((newUser) => {
                const { _id } = newUser;
                res.status(200).send({
                  _id, email, name, avatar,
                });
              })
              .catch(() => {
                next(new NotFound('Переданы некорректные данные при создании/обновлении пользователя'));
              });
          })
          .catch(() => next(new NotFound('Переданы некорректные данные при создании/обновлении пользователя')));
      } else {
        next(new SameDataError('Пользователь с таким email уже существует'));
      }
    });
};

const getUser = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    User.findById(req.params.id)
      .then((user) => res.status(200).send(user))
      .catch(() => next(new NotFound('Пользователь не найден')));
  }
};

const updateUser = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => res.status(200).send({ user }))
      .catch(() => next(new NotFound('Пользователь не найдет')));
  }
};

const updateAvatar = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.status(200).send({ user }))
      .catch(() => next(new NotFound('Пользователь не найдет')));
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('jwt', {
        httpOnly: true,
      });
      res.status(200).send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    const { user } = req;
    User.findById(user._id)
      .then((currentUser) => res.status(200).send({ currentUser }))
      .catch(() => next(new NotFound('Пользователь не найдет')));
  }
};

module.exports = {
  getUsers, createUser, getUser, updateUser, updateAvatar, login, getCurrentUser,
};
