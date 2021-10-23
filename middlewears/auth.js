const jwt = require('jsonwebtoken');

const IncorectAuth = require('../errors/incorect-auth');

const auth = (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    next(new IncorectAuth('Необходима авторизация'));
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      next(new IncorectAuth('Необходима авторизация'));
    }
    req.user = payload;
    next();
  }
};

module.exports = { auth };
