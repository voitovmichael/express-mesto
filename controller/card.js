const Card = require('../models/card');

const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getError = (err, action) => {
  let status = ERROR_SERVER;
  let message = 'Ошибка сервера';
  if (err.name === 'CastError') {
    status = ERROR_CODE;
    message = 'Передан не корректный _id.';
  }
  if (err.name === 'ValidationError') {
    status = ERROR_CODE;
    if (action === 'post') {
      message = 'Переданы некорректные данные при создании карточки.';
    }
    if (action === 'like') {
      message = 'Переданы некорректные данные для постановки/снятии лайка.';
    }
  }
  if (err.name === 'CardNotFoundError') {
    status = ERROR_NOT_FOUND;
    message = 'По заданному id не существует карточки';
  }

  return { status, message };
};

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      const { status, message } = getError(err);
      res.status(status).send({ message });
    });
};

const postCard = (req, res) => {
  const {
    name, link, likes, createdAt = Date.now(),
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  }).then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const { status, message } = getError(err, 'post');
      res.status(status).send({ message });
    });
};

const delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error();
      error.name = 'CardNotFoundError';
      throw error;
    })
    .then(() => res.status(200).send({ delete: 'success' }))
    .catch((err) => {
      const { status, message } = getError(err);
      res.status(status).send({ message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.name = 'CardNotFoundError';
      throw error;
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const { status, message } = getError(err, 'like');
      res.status(status).send({ message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.name = 'CardNotFoundError';
      throw error;
    })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const { status, message } = getError(err, 'like');
      res.status(status).send({ message });
    });
};

module.exports = {
  getCards, postCard, delCard, likeCard, dislikeCard,
};
