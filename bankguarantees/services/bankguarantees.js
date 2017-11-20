'use strict';

const config = require('../config');
const StateMachine = require('javascript-state-machine');

let dbg = new StateMachine({
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

module.exports = {
	getState: async req => {
		return {state: dbg.state};
	},
	prepare: async req => {
		dbg.prepare();
		return {state: dbg.state};
	},
	approveByBeneficiary: async req => {
		dbg.approveByBeneficiary();
		return {state: dbg.state};
	},
	disagreeByBeneficiary: async req => {
		dbg.disagreeByBeneficiary();
		return {state: dbg.state};
	},
	cancelApproved: async req => {
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	pay: async req => {
		dbg.cancelApproved();
		return {state: dbg.state};
	},
	activate: async req => {
		dbg.activate();
		return {state: dbg.state};
	},
	cancelPaid: async req => {
		dbg.cancelPaid();
		return {state: dbg.state};
	},
	retry: async req => {
		dbg.retry();
		return {state: dbg.state};
	},
	cancelDisagreed: async req => {
		dbg.cancelDisagreed();
		return {state: dbg.state};
	}
};