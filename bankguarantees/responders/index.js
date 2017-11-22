'use strict';

const config = require('../config');

const {initClient, initLoggerClient, initLoggedClient, initLoggedListener} = require('./../utils');
const BankGuaranteesService = require('../services/bankguarantees');

const logger = initLoggerClient(config.microservices.logger, config.microservices.bankguarantees.name);

let listener = initLoggedListener(config.microservices.bankguarantees, logger);

listener.add('create', BankGuaranteesService.create);

listener.add('getState', BankGuaranteesService.getState);

listener.add('prepare', BankGuaranteesService.prepare);
listener.add('approveByBeneficiary', BankGuaranteesService.approveByBeneficiary);
listener.add('disagreeByBeneficiary', BankGuaranteesService.disagreeByBeneficiary);
listener.add('cancelApproved', BankGuaranteesService.cancelApproved);
listener.add('pay', BankGuaranteesService.pay);
listener.add('activate', BankGuaranteesService.activate);
listener.add('cancelPaid', BankGuaranteesService.cancelPaid);
listener.add('retry', BankGuaranteesService.retry);
listener.add('cancelDisagreed', BankGuaranteesService.cancelDisagreed);

listener.start();