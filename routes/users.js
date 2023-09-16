const usersRoutes = require('express').Router();

const { updateUserProfile, getCurrentUser } = require('../controllers/users');

const { ValidationUpdateUserProfile } = require('../middlewares/validation');

// Получение текущего пользователя
usersRoutes.get('/me', getCurrentUser);

// Обновление профиля пользователя
usersRoutes.patch('/me', ValidationUpdateUserProfile, updateUserProfile);

module.exports = { usersRoutes };
