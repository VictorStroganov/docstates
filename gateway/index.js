const express = require('express');
const config = require('./config');

const successHandler = require('./middlewares/successHandler');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use('/bankguarantees', require('./routes/v1/public/bankguarantees'));

app.use('/', successHandler);
app.use(errorHandler);

app.listen(config.port, () => {
	console.log(`Gateway at port ${config.port}`);
});

module.exports = app;