const User = require('../models/user');
const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getError = (err) => {
  let status = ERROR_SERVER, message = 'Ошибка сервера';
  if(err.name === 'CastError') {
    status = ERROR_NOT_FOUND;
    message = 'Запрашиваемый пользователь не найден';
  }

  if(err.name === 'ValidationError') {
    status = ERROR_CODE;
    message = 'Переданы некорректные данные при создании пользователя';
  }

  return { status, message }
}

const getUsers = (req, res) => {
  User.find({}).then(user => res.status(200).send({user}))
  .catch(err => {
    const { status, message } = getError(err);
    res.status(status).send({message})
  });
}

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then(user => res.status(200).send({user}))
  .catch(err => {
    const { status, message } = getError(err);
    res.status(status).send({message})
  });
}

const getUser = (req, res) => {
  User.findById(req.params.id).then((user) => {
    res.status(200).send(user);
  })
  .catch(err => {
    const { status, message } = getError(err);
    res.status(status).send(message);
  })
}

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true}).then(user => res.status(200).send({user}))
  .catch((err) => {
    const { status, message } = getError(err);
    res.status(status).send(message)
  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {new: true, runValidators: true}).then(user => res.status(200).send({user}))
  .catch(err => {
    const { status, message } = getError(err);
    res.status(status).send(message);
  });
}

module.exports = {getUsers, postUser, getUser, updateUser, updateAvatar};