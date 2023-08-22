const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const helmet = require('helmet');

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const cookies = require('cookie-parser');

const { errors } = require('celebrate');
const cors = require('cors');
const { routes } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorHandler = require('./middlewares/error-handler');

// Запуск приложения
const app = express();

// Подключение к базе данных
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.use(helmet());
// Middleware объединение пакетов bodynm
app.use(express.json());

app.use(cookies());
// Настройки для корс
app.use(
  cors({
    origin: [
      'https://praktikum.tk',
      'http://praktikum.tk',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'http://igorb.nomoreparties.co',
      'https://igorb.nomoreparties.co',
    ],
    credentials: true,
  }),
);

app.disable('x-powered-by');
// подключаем логгер запросов ДО ОБРАБОТЧИКОВ РОУТОВ
app.use(requestLogger);

app.use(routes);
// подключаем логгер ошибок ПОСЛЕ ОБРАБОТЧИКОВ РОУТОВ ДО ОБРАТОЧИКОВ ОШИБОК
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}...`);
});
