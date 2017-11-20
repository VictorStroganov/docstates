const router = require('express').Router();

const {call} = require('./../../../utils');
const bankGuaranteeService = require('./../../../services/bankguarantees');


router.get('/create', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.create, {}, next);
	next();
});

router.get('/:documentId/state', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.getState, {id: req.params.documentId}, next);
	next();
});

router.get('/:documentId/prepare', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.prepare, {id: req.params.documentId}, next);
	next();
});

router.get('/:documentId/approve_by_beneficiary', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.approveByBeneficiary, {id: req.params.documentId}, next);
	next();
});

router.get('/:documentId/disagree_by_beneficiary', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.disagreeByBeneficiary, {id: req.params.documentId}, next);
	next();
});

router.get('/:documentId/cancel_approved', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelApproved, {id: req.params.documentId}, next);
	next();
});
router.get('/:documentId/pay', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.pay, {id: req.params.documentId}, next);
	next();
});
router.get('/:documentId/activate', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.activate, {id: req.params.documentId}, next);
	next();
});
router.get('/:documentId/cancel_paid', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelPaid, {id: req.params.documentId}, next);
	next();
});
router.get('/:documentId/retry', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.retry, {id: req.params.documentId}, next);
	next();
});
router.get('/:documentId/cancel_disagreed', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.cancelDisagreed, {id: req.params.documentId}, next);
	next();
});
module.exports = router;