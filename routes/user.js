const router = require('express').Router();

const {
  getUsers, getUser, updateUser, updateAvatar,
} = require('../controller/user');

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/:me', updateUser);

router.patch('/:me/avatar', updateAvatar);

module.exports = router;
