const http2 = require('node:http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');

const { JWT_SECRET = 'dev-secret', NODE_ENV } = process.env;
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const User = require('../models/user');

// Получение текущего пользователя +

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Создание пользователя +
function createUser(req, res, next) {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(HTTP_STATUS_CREATED).send({
            _id: user._id,
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictErr('Пользователь указанным email уже существует'),
            );
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestErr('Переданы некорректные данные.'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
}

// Обновление профиля пользователя+
function updateUserProfile(req, res, next) {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// ЛОГИН+
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      );
      res.cookie('jwt', token);
      res
        .send({
          jwt: token,
          data: { _id: user._id, email: user.email, name: user.name },
        })
        .end();
    })
    .catch((err) => {
      next(err);
    });
}

// Логаут УДАЛЕНИЕ КУКИ +
function logout(req, res) {
  res.clearCookie('jwt').send({ message: 'Cookie has been deleted' });
}
module.exports = {
  getCurrentUser,
  createUser,
  updateUserProfile,
  login,
  logout,
};
