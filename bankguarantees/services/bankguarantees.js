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
	getStatesList: async req => {
		return {states: [1, 2, 3]};
	},
	prepare: async req => {
		dbg.prepare();
		return {state: dbg.state};
	}
};