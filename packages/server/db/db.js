const mongoose = require('mongoose');
const winston = require('winston');
const { noop } = require('lodash');

module.exports = function connectToDB(cb = noop) {
    const host = process.env.MONGO_HOST;
    const name = process.env.MONGO_DBNAME;
    const port = process.env.MONGO_PORT || 27017;
    const authSource = process.env.MONGO_AUTH_SOURCE;

    if (!host || !name) {
        winston.info('Missing Mongo enviroment variable MONGO_HOST or MONGO_DBNAME!');
        throw new Error();
    }

    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PASS;

    if (!user || !pass) winston.info('Running Mongo unauthenticated!');

    const url = `mongodb://${host}:${port}/${name}`;
    mongoose.Promise = global.Promise;

    winston.info('Connecting to database:', url);

    const opt = user && pass && { user, pass };

    if (authSource) {
        Object.assign(opt, { authSource });
    }

    return mongoose.connect(url, opt, cb);
};
