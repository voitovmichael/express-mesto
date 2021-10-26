const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUser, updateUser, updateAvatar,
  getCurrentUser,
} = require('../controller/user');

const checkUrl = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUser);

router.patch('/:me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/:me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(checkUrl, 'custom url validation'),
  }),
}), updateAvatar);

module.exports = router;
