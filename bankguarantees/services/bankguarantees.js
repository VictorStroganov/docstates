'use strict';

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
		}
	}
});

var guarantees = new Map();

module.exports = {
	create: async req => {
		const newGuaranteeId = Math.floor(Math.random()* 1000000).toString();
		const newGuaranteeType = 'normal';

		const newItem = new BankGuaranteeModel(newGuaranteeId, newGuaranteeType);
		
		guarantees.set(newGuaranteeId, newItem);

		return {id: newItem.id, type: newItem.type, state: newItem.state};	
	},
	getState: async req => {
		const dbg = guarantees.get(req.data.id);
		return {id: dbg.id, state: dbg.state};
	},
	prepare: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.prepare();
		return {state: dbg.state};
	},
	approveByBeneficiary: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.approveByBeneficiary();
		return {state: dbg.state};
	},
	disagreeByBeneficiary: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.disagreeByBeneficiary();
		return {state: dbg.state};
	},
	cancelApproved: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	pay: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	activate: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.activate();
		return {state: dbg.state};
	},
	cancelPaid: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.cancelPaid();
		return {state: dbg.state};
	},
	retry: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.retry();
		return {state: dbg.state};
	},
	cancelDisagreed: async req => {
		const dbg = guarantees.get(req.data.id);
		dbg.cancelDisagreed();
		return {state: dbg.state};
	}
};