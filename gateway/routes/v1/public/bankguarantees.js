const router = require('express').Router();

const {call} = require('./../../../utils');
const bankGuaranteeService = require('./../../../services/bankguarantees');

router.get('/', (req, res) => {
	res.send('Root route');
});

router.get('/states', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.getStatesList, {}, next);
//	res.send({data: 'Hi'});
	next();
});

router.get('/prepare', async (req, res, next) => {
	req.result = await call(bankGuaranteeService.prepare, {}, next);
	next();
});

module.exports = router;