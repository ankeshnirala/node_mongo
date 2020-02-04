const AppError = require('./../utils/appError');

const handleCastErrorDB= (error) => {
    let message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (error) => {
    let value =error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    let message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
    let errors = Object.values(error.errors).map(item => item.message);
    let message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
    return new AppError('Invalid token. Please login again!', 401
    );
};

const handleTokenExpiredError = () => {
    return new AppError('Your token has expired. Please login again!', 401);
};

const sendErrorDev = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack
    });
};

const sendErrorProd = (error, res) => {
    //operational error, want to send some user friendly error
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }else{
        // programming error, don't want to send error to user
        console.log('ERROR 🔥', error);
        
        res.status(500).json({
            status: 'Error',
            message: '🔥🔥🔥 SOMETHING WENT VERY VERY WRONG 🔥🔥🔥'
        });
    }
    
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'ERROR';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(error, res);
    }else if(process.env.NODE_ENV === 'production'){

        let _error = {... error};

        if(_error.name === 'CastError') _error = handleCastErrorDB(_error);
        if(_error.code == 11000) _error = handleDuplicateFieldsErrorDB(_error);
        if(_error.name === 'ValidationError') _error = handleValidationErrorDB(_error);
        if(_error.name === 'JsonWebTokenError') _error = handleJsonWebTokenError();
        if(_error.name === 'TokenExpiredError') _error = handleTokenExpiredError();
        sendErrorProd(_error, res);
    }
};