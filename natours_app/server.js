const dotenv = require('dotenv');
const chalk = require('chalk');
const mongoose = require('mongoose');
// console.log(x);


process.on('uncaughtException', error => {
    console.log(error.name, error.message);
    console.log('🔥🔥🔥 Uncaught Exception 🔥🔥🔥');
    process.exit(1);
});

dotenv.config({path: './../../../../config.env'});
const app       = require('./app');
const port      = process.env.APP_PORT;

const _db = process.env.MONGODB_DATABASE.replace('<PASSWORD>', process.env.MONGODB_DB_PASSWORD);

mongoose.connect(_db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log(chalk.bold('DB CONNECTION SUCCESSFUL✔'));
});

let server = app.listen(port, () => {
    console.log(chalk.bold(`APP IS RUNNING ON PORT: ${port}✔`));
});

process.on('unhandledRejection', error => {
    console.log(error.name, error.message);
    console.log('🔥🔥🔥 Unhandled Rejection 🔥🔥🔥');
    server.close(() => {
        process.exit(1);
    });
});