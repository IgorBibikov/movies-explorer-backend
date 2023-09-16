const moviesRoutes = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  ValidationCreateMovie,
  ValidationDeleteMovie,
} = require('../middlewares/validation');

// Получение всех cохранённых текущим пользователем фильмов
moviesRoutes.get('/', getMovies);

// Создание фильма
moviesRoutes.post('/', ValidationCreateMovie, createMovie);

// Удаление фильма по ID
moviesRoutes.delete('/:movieId', ValidationDeleteMovie, deleteMovie);

module.exports = { moviesRoutes };
