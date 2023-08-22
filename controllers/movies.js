const http2 = require('node:http2');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const Movie = require('../models/movie');

// Получение всех фильмов +
function getMovies(req, res, next) {
  return Movie.find({})
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch((err) => {
      next(err);
    });
}

// Создание фильма +
function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner,
    movieId,
    thumbnail,
  })
    .then((movie) => {
      res.status(HTTP_STATUS_CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Удаление фильма по ID +
function deleteMovie(req, res, next) {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundErr('Фильм с указанным _id не найден.'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenErr('У вас нет прав на удаление данного фильма.'));
      } else {
        return Movie.deleteOne(movie).then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Фильм удален', movie });
        });
      }
      return false;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr('Переданы некорректные данные для удаления фильма.'),
        );
      } else {
        next(err);
      }
    });
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
