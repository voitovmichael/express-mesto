const Card = require('../models/card');
const NotFound = require('../errors/not-found-err');
const RequestError = require('../errors/request-error');
const RightError = require('../errors/havent-right-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

const postCard = (req, res, next) => {
  const {
    name, link, likes, createdAt = Date.now(),
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  }).then((card) => {
    res.status(200).send({ card });
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные для создании карточки.'));
      } else {
        next(err);
      }
    });
};

const delCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (card.owner.valueOf() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200).send({ delete: 'success' }))
          .catch(next);
      } else {
        next(new RightError('Нет прав для удаления карточки'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      } else {
        res.status(200).send({ card });
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      } else {
        res.status(200).send({ card });
      }
    })
    .catch(next);
};

module.exports = {
  getCards, postCard, delCard, likeCard, dislikeCard,
};
