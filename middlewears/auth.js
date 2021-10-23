const jwt = require('jsonwebtoken');

const IncorectAuth = require('../errors/incorect-auth');

const auth = (req, res, next) => {
  // console.log('auth');
  const { token } = req.headers;
  if (!token) {
    next(new IncorectAuth('Необходима авторизация'));
    // console.log('auth');
    // res.status(401).send({ message: 'Необходима авторизация' });
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      // console.log('auth');
      next(new IncorectAuth('Необходима авторизация'));
      // res.status(401).send({ message: 'Необходима авторизация' });
    }
    req.user = payload;
    next();
  }
};

module.exports = { auth };
