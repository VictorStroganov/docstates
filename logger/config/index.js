const microservices = require('./microservices');

const HOST_API = '127.0.0.1';
const PORT_API = 8000;
const API_VERSION = 'v1';
const API_PATH = `/api/${API_VERSION}`;

module.exports = {
	port: PORT_API,
	hostname: HOST_API,
	apiPath: API_PATH,
	apiVersion: API_VERSION,
	microservices: microservices
};
