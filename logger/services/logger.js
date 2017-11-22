'use strict';

const boom = require('boom');
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, prettyPrint} = format;

const config = require('./../config');

const {initClient} = require('./../utils');
//const {Logs} = require('./../db');

//const auth = initClient(config.microservices.auth);

// создаем логгер с выводом сообщений в файл combined.log
const logger = createLogger({
    level: 'silly',
    format: combine(
        label({label: 'dss'}),
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: '../combined.log'}),
    ]
});

module.exports = {
    log: async req => {
        if (['silly', 'debug', 'verbose', 'info', 'warn', 'error'].indexOf(req.cmd) > -1) {
            logger.log({level: req.cmd, message: req.message});
            // write log message to Postgresql
 /*           await Logs.create({
                level: req.cmd,
                message: req.message,
                requestId: req.data && req.data._requestId,
                address: req.data && req.data.address,
                deviceId: req.data && req.data.deviceId,
                userId: req.data && req.data._userId,
                source: req.source,
                destination: req.destination,
                pattern: JSON.stringify(req.pattern || {}),
                cmd: req.func,
                data: JSON.stringify(req.data || {}),
                err: JSON.stringify(req.err),
                result: JSON.stringify(req.result)
            });*/
        }
    },
    getList: async req => {
        let skip = req.data.skip;
        let take = req.data.take || 10;
 /*       if ((await auth.call('isAdmin', req.data)).success) {
            let result = await Logs.findAndCountAll({
                attributes: ['id', 'createdAt', 'level', 'message', 'address', 'deviceId', 'userId', 'data'],
                order: [['createdAt', 'DESC']],
                limit: take,
                offset: skip
            });
            return {
                items: result.rows,
                total: result.count
            };
        }*/
        throw boom.forbidden();
    },
    getById: async req => {
/*        if ((await auth.call('isAdmin', req.data)).success) {
            return await Logs.findOne({where: {id: req.data.id}});
        }*/
        throw boom.forbidden();
    }
};
