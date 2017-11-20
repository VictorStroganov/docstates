'use strict';

const config = require('../config');

const {initClient} = require('../utils');

const guarantees = initClient(config.microservices.bankguarantees);

module.exports = {
	getStatesList: async data => {
		console.log(`Gateway - BankGuarantees service - getStatesList request with params ${JSON.stringify(data)}`);
		return await guarantees.call('getStatesList', data);
	},
	prepare: async data => {
		console.log('Gateway - BankGuarantees service - prepare request');
		return await guarantees.call('prepare', data);
	}
};