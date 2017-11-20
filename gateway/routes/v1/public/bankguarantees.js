const router = require('express').Router();

const {call} = require('./../../../utils');
const bankGuaranteeService = require('./../../../services/bankguarantees');

router.get('/', (req, res) => {
	res.send('Root route');
});

router.get('/state', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.getState, {}, next);
//	res.send({data: 'Hi'});
	next();
});

router.get('/prepare', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.prepare, {}, next);
	next();
});

router.get('/approve_by_beneficiary', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.approveByBeneficiary, {}, next);
	next();
});

router.get('/disagree_by_beneficiary', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.disagreeByBeneficiary, {}, next);
	next();
});

router.get('/cancel_approved', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelApproved, {}, next);
	next();
});
router.get('/pay', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.pay, {}, next);
	next();
});
router.get('/activate', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.activate, {}, next);
	next();
});
router.get('/cancel_paid', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelPaid, {}, next);
	next();
});
router.get('/retry', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.retry, {}, next);
	next();
});
router.get('/cancel_disagreed', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelDisagreed, {}, next);
	next();
});
module.exports = router;