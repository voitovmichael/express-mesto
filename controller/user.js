// const validator = require('validator');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { getError, onFail } = require('./error');

const getUsers = (req, res) => {
  User.find({}).then((user) => res.status(200).send({ user }))
    .catch((err) => {
      const { status, message } = getError({ err });
      res.status(status).send({ message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcryptjs.hash((password, 10))
    .then((hash) => {
      User.create({
        name, about, avatar, email, hash,
      })
        .then((user) => res.status(200).send({ user }))
        .catch((err) => {
          const { status, message } = getError({ err, place: 'user' });
          res.status(status).send({ message });
        });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(onFail)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      const { status, message } = getError({ err });
      res.status(status).send({ message });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(onFail)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      const { status, message } = getError({ err, place: 'user' });
      res.status(status).send({ message });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(onFail)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      const { status, message } = getError({ err });
      res.status(status).send({ message });
    });
};

module.exports = {
  getUsers, createUser, getUser, updateUser, updateAvatar,
};
