const processError = (err, req, res, next) => {
  if (!err.status) {
    res.status(500).send({ message: 'Ошибка сервера' });
  } else {
    res.status(err.status).send({ message: err.message });
  }
  next();
};
module.exports = { processError };
