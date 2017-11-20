'use strict';

const config = require('../config');

const {initListener} = require('../utils');
const BankGuaranteesService = require('../services/bankguarantees');

let listener = initListener(config.microservices.bankguarantees);

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