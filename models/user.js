const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const IncorectAuth = require('../errors/incorect-auth');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    select: false,
    validate: {
      validator: (v) => validator.isEmail(v),
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function ({ email, password }) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new IncorectAuth('Неверный логин'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new IncorectAuth('Неверный пароль'));
          }
          return user;
        });
    });
};
userSchema.index({ email: 1 }, { unique: true });
const model = mongoose.model('user', userSchema);
module.exports = model;
