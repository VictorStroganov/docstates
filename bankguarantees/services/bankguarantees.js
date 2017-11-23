'use strict';

const uuid = require('uuid/v4');
const boom = require('boom');
const config = require('../config');
const StateMachine = require('javascript-state-machine');
const BankGuaranteeModel = require('./../models/bankguarantee');

StateMachine.factory(BankGuaranteeModel, {
	init: 'requested',
	transitions: [
		{name: 'prepare', from: 'requested', to: 'draft'},
		{name: 'approveByBeneficiary', from: 'draft', to: 'approved'},
		{name: 'disagreeByBeneficiary', from: 'draft', to: 'disagreed'},
		{name: 'cancelApproved', from: 'approved', to: 'canceled'},
		{name: 'pay', from: 'approved', to: 'paid'},
		{name: 'activate', from: 'paid', to: 'active'},
		{name: 'cancelPaid', from: 'paid', to: 'canceled'},
		{name: 'retry', from: 'disagreed', to: 'requested'},
		{name: 'cancelDisagreed', from: 'disagreed', to: 'canceled'}
	],
	methods: {
		onPrepare:  () => {
			console.log('DBG draft prepared');
		},
		onApproveByBeneficiary: () => {
			console.log('DBG approved by beneficiary');
		},
		onDisagreeByBeneficiary: () => {
			console.log('DBG disagreed by beneficiary');
		},
		onCancelApproved: () => {
			console.log('DBG canceled');
		},
		onCancelPaid: () => {
			console.log('DBG canceled');
		},
		onCancelDisagreed: () => {
			console.log('DBG canceled');
		},
		onPay: () => {
			console.log('DBG paid');
		},
		onActivate: () => {
			console.log('DBG activated');
		},
		onRetry: () => {
			console.log('DBG requested again');
		},
		onInvalidTransition: function(transition, from, to) {
			throw boom.badRequest(`Transition "${transition}" not allowed from the state "${from}"`);
		},
		onPendingTransition: function(transition, from, to) {
			throw boom.badRequest(`Transition "${transition}" already in progress`);
		}
	}
});

var guarantees = new Map();

const getDocumentById = (id) => {
	let dbg = guarantees.get(id);
	if(!dbg) {
		throw boom.notFound('Document not found');
	}
	return dbg;
}

module.exports = {
	create: async req => {
		const newGuaranteeId = uuid();
		const newGuaranteeType = 'normal';

		const newItem = new BankGuaranteeModel(newGuaranteeId, newGuaranteeType);
		
		guarantees.set(newGuaranteeId, newItem);

		return {id: newItem.id, type: newItem.type, state: newItem.state};	
	},
	getState: async req => {
		let dbg = getDocumentById(req.data.id);
		return {id: dbg.id, state: dbg.state};
	},
	prepare: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.prepare();
		return {state: dbg.state};
	},
	approveByBeneficiary: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.approveByBeneficiary();
		return {state: dbg.state};
	},
	disagreeByBeneficiary: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.disagreeByBeneficiary();
		return {state: dbg.state};
	},
	cancelApproved: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	pay: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	activate: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.activate();
		return {state: dbg.state};
	},
	cancelPaid: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.cancelPaid();
		return {state: dbg.state};
	},
	retry: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.retry();
		return {state: dbg.state};
	},
	cancelDisagreed: async req => {
		let dbg = getDocumentById(req.data.id);
		dbg.cancelDisagreed();
		return {state: dbg.state};
	}
};