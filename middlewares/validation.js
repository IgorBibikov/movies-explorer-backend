const { celebrate, Joi } = require('celebrate');

const regexp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

// Валидация создания пользователя+
const ValidationСreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
});

// Валидация логина пользователя+
const ValidationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Валидация обновления профиля пользователя+
const ValidationUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
});

// Валидация создания фильма+
const ValidationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexp),
    trailerLink: Joi.string().required().pattern(regexp),
    thumbnail: Joi.string().required().pattern(regexp),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

// Валидация удаления фильма по ID +
const ValidationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).required(),
  }),
});

module.exports = {
  ValidationСreateUser,
  ValidationLogin,
  ValidationUpdateUserProfile,

  ValidationCreateMovie,
  ValidationDeleteMovie,
};
