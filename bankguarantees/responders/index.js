'use strict';

const config = require('../config');

const {initListener} = require('../utils');
const BankGuaranteesService = require('../services/bankguarantees');

let listener = initListener(config.microservices.bankguarantees);
listener.add('getStatesList', BankGuaranteesService.getStatesList);

listener.add('prepare', BankGuaranteesService.prepare);

listener.start();