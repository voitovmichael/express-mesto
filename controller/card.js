const Card = require('../models/card');
const NotFound = require('../errors/not-found-err');
const IncorectAuth = require('../errors/incorect-auth');
const RequestError = require('../errors/request-error');

const getCards = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    Card.find({})
      .then((cards) => res.status(200).send({ cards }))
      .catch(() => next(new NotFound('Карточки не найдены')));
  }
};

const postCard = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    const {
      name, link, likes, createdAt = Date.now(),
    } = req.body;
    const owner = req.user._id;
    Card.create({
      name, link, owner, likes, createdAt,
    }).then((card) => {
      res.status(200).send({ card });
    })
      .catch(() => {
        next(new RequestError('Переданы некорректные данные для создании карточки.'));
      });
  }
};

const delCard = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (card.owner.valueOf() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then(() => res.status(200).send({ delete: 'success' }))
            .catch(() => next(new NotFound('Ресурс не найден')));
        } else {
          next(new NotFound('Нет прав для удаления ресурса'));
        }
      })
      .catch(() => next(new NotFound('Карточка не найдена')));
  }
};

const likeCard = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
      .then((card) => res.status(200).send({ card }))
      .catch(() => next(new NotFound('Ресурс не найден')));
  }
};

const dislikeCard = (req, res, next) => {
  if (!req.user) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
      .then((card) => res.status(200).send({ card }))
      .catch(() => next(new NotFound('Ресурс не найден')));
  }
};

module.exports = {
  getCards, postCard, delCard, likeCard, dislikeCard,
};
