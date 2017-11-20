'use strict';

const config = require('../config');

const {initClient} = require('../utils');

const guarantees = initClient(config.microservices.bankguarantees);

module.exports = {
	getState: async data => {
		console.log(`Gateway - BankGuarantees service - getState request with params ${JSON.stringify(data)}`);
		return await guarantees.call('getState', data);
	},
	prepare: async data => {
		console.log('Gateway - BankGuarantees service - prepare request');
		return await guarantees.call('prepare', data);
	},
	approveByBeneficiary: async data => {
		console.log('Gateway - BankGuarantees service - approveByBeneficiary request');
		return await guarantees.call('approveByBeneficiary', data);
	},
	disagreeByBeneficiary: async data => {
		console.log('Gateway - BankGuarantees service - disagreeByBeneficiary request');
		return await guarantees.call('disagreeByBeneficiary', data);
	},
	cancelApproved: async data => {
		console.log('Gateway - BankGuarantees service - cancelApproved request');
		return await guarantees.call('cancelApproved', data);
	},
	pay: async data => {
		console.log('Gateway - BankGuarantees service - pay request');
		return await guarantees.call('pay', data);
	},
	activate: async data => {
		console.log('Gateway - BankGuarantees service - activate request');
		return await guarantees.call('activate', data);
	},
	cancelPaid: async data => {
		console.log('Gateway - BankGuarantees service - cancelPaid request');
		return await guarantees.call('cancelPaid', data);
	},
	retry: async data => {
		console.log('Gateway - BankGuarantees service - retry request');
		return await guarantees.call('retry', data);
	},
	cancelDisagreed: async data => {
		console.log('Gateway - BankGuarantees service - cancelDisagreed request');
		return await guarantees.call('cancelDisagreed', data);
	}
};