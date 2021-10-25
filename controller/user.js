// const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFound = require('../errors/not-found-err');
const RequestError = require('../errors/request-error');
const SameDataError = require('../errors/same-data-err');

const getUsers = (req, res, next) => {
  User.find({}).then((user) => res.status(200).send({ user }))
    .catch(next);
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
              .catch((err) => {
                if (err.name === 'ValidationError') {
                  next(new RequestError('Переданы некорректные данные для создании карточки.'));
                } else {
                  next(err);
                }
              });
          })
          .catch(next);
      } else {
        next(new SameDataError('Пользователь с таким email уже существует'));
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      } else {
        res.status(200).send({ user });
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      res.status(200).send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { user } = req;
  User.findById(user._id)
    .then((currentUser) => res.status(200).send({ currentUser }))
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUser, updateUser, updateAvatar, login, getCurrentUser,
};
