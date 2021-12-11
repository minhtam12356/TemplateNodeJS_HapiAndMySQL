/**
 * Created by A on 7/18/17.
 */
'use strict'
require('dotenv').config();
const Logger    = require('./utils/logging');
const Glue      = require('glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const AppConfig = require('./config/app');

const MQTTBroker = require('./ThirdParty/MQTTBroker/MQTTBroker');
const CronJob   = require('./cron/index');

Glue.compose(Manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
        throw err;
    }
    server.start(() => {
        Logger.info('Server running at:', server.info.uri);
        CronJob.startSchedule();
    });
    server.auth.strategy('jwt', 'jwt', {
        key: AppConfig.jwt.secret,
        verifyOptions: { algorithms: ['HS256'] }
    });
    server.route (Routes);

});