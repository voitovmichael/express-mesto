const Card = require('../models/card');
const { getError, onFail } = require('./error');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send({ cards }))
    .catch((err) => {
      const { status, message } = getError({ err });
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
      const { status, message } = getError({ err, action: 'post', place: 'card' });
      res.status(status).send({ message });
    });
};

const delCard = (req, res) => {
  if (!req.user) {
    res.status(403).send('Необходима авторизация');
  } else {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (card.owner === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .orFail(onFail)
            .then(() => res.status(200).send({ delete: 'success' }))
            .catch((err) => {
              const { status, message } = getError({ err });
              res.status(status).send({ message });
            });
        } else {
          res.status(403).send({ message: 'Нет прав для удаления ресурса' });
        }
      });
  }
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(onFail)
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const { status, message } = getError({ err, action: 'like' });
      res.status(status).send({ message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .orFail(onFail)
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      const { status, message } = getError({ err, action: 'like' });
      res.status(status).send({ message });
    });
};

module.exports = {
  getCards, postCard, delCard, likeCard, dislikeCard,
};
