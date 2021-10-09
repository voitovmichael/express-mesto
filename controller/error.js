const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const getError = ({ err, action, place }) => {
  let status = ERROR_SERVER;
  let message = 'Ошибка сервера';

  if (err.name === 'CastError') {
    status = ERROR_CODE;
    message = 'Передан не корректный _id.';
  }
  if (err.name === 'ValidationError') {
    status = ERROR_CODE;
    if (place === 'user') {
      message = 'Переданы некорректные данные при создании/обновлении пользователя';
    } else {
      if (action === 'post') {
        message = 'Переданы некорректные данные при создании карточки.';
      }
      if (action === 'like') {
        message = 'Переданы некорректные данные для постановки/снятии лайка.';
      }
    }
  }

  if (err.name === 'ResourceNotFoundError') {
    status = ERROR_NOT_FOUND;
    message = 'По заданному id ресурс не найден';
  }

  return { status, message };
};

const onFail = () => {
  const error = new Error();
  error.name = 'ResourceNotFoundError';
  throw error;
};

module.exports = { getError, onFail };
