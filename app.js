const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bookRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const globalError = require("./controllers/errorController");
const AppError = require("./utils/appError");
const CORS = require("cors");



const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use(CORS())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/v1/users', usersRouter);
app.use('/api/v1/books', bookRouter);

// ! handling undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Requested Route ${req.url} is not Found`, 404))
})

// error handler
app.use(globalError);

module.exports = app;
