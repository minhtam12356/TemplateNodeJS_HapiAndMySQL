/**
 * Created by A on 7/18/17.
 */
'use strict'
const Logger    = require('./utils/logging');
const Glue      = require('glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const AppConfig = require('./config/app');
const dotenv    = require('dotenv').config();
Glue.compose(Manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
        throw err;
    }
    server.start(() => {
        Logger.info('Server running at:', server.info.uri);
        
    });
    server.auth.strategy('jwt', 'jwt', {
        key: AppConfig.jwt.secret,
        verifyOptions: { algorithms: ['HS256'] }
    });
    server.route (Routes);

});