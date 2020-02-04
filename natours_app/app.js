const express = require('express');
const chalk = require('chalk');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

console.log(chalk.bold(process.env.NODE_ENV));


if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find: ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;