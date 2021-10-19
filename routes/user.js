const router = require('express').Router();
// const users = require('./models/users.js');
// const User = require('../models/user');
const {
  getUsers, createUser, getUser, updateUser, updateAvatar,
} = require('../controller/user');

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

router.patch('/:me', updateUser);

router.patch('/:me/avatar', updateAvatar);

module.exports = router;
