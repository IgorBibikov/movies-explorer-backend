const http2 = require('node:http2');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Произошла ошибка в работе сервера', err });
  }
  next();
};

module.exports = errorHandler;
