'use strict';

const config = require('./../config');

const {initListener} = require('./../utils');
const LogService = require('../services/logger');

let listener = initListener(config.microservices.logger);
listener.add('silly', LogService.log);
listener.add('debug', LogService.log);
listener.add('verbose', LogService.log);
listener.add('info', LogService.log);
listener.add('warn', LogService.log);
listener.add('error', LogService.log);
listener.add('getList', LogService.getList);
listener.add('getById', LogService.getById);
listener.start();

