'use strict';

const Seneca = require('seneca');
//const Validator = require('jsonschema').Validator;
//const validator = new Validator();

const DEFAULT_MICRO_SERVICE_TIMEOUT = 30000;

const internals = {
    callbackify: func => {
        return (req, callback) => func(req).then(data => callback(null, data)).catch(err => callback(err));
    }
};

module.exports = {
    initClient: (options, defaultPattern = null) => {
        let client = Seneca({
            tag: options.tag || options.name,
            timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT
        }).client({port: options.port, timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT});

        let pattern = {};
        if (defaultPattern) {
            pattern = Object.assign(pattern, defaultPattern);
        }
        pattern.service = options.name;

        console.log(`Gateway utils - initClient with options ${JSON.stringify(options)}`);

        return {
            call: async (cmd, data, params) => {
                let localPattern = Object.assign({}, pattern);
                localPattern.cmd = cmd;
                localPattern.data = data;
                if (params) {
                    localPattern = Object.assign(localPattern, params);
                }

                return new Promise((resolve, reject) => {
                    client.act(localPattern, (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            },
            push: params => {
                let localPattern = Object.assign({}, pattern);
                if (params) {
                    localPattern = Object.assign(localPattern, params);
                }

                client.act(localPattern);
            }
        };
    },
    initListener: (options, defaultPattern = null) => {
        let listener = Seneca({
            tag: options.tag || options.name,
            timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT
        });

        let pattern = {};
        if (defaultPattern) {
            pattern = Object.assign(pattern, defaultPattern);
        }
        pattern.service = options.name;

        return {
            add: (cmd, func, params = null) => {
                let localPattern = Object.assign({}, pattern);
                if (cmd) {
                    localPattern.cmd = cmd;
                }
                if (params) {
                    localPattern = Object.assign(localPattern, params);
                }
                listener.add(localPattern, internals.callbackify(func));
            },
            start: () => {
                listener.listen({
                    port: options.port,
                    timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT
                });
            }
        };
    },
    call: async (func, params, next) => {
        try {
            return await func(params);
        } catch (err) {
            next(err);
        }
    },
/*    validate: (data, scheme) => {
        if (!data) {
            return {
                status: false,
                errors: 'Parameters data required'
            };
        }

        const resultValidate = validator.validate(data, scheme);

        if (resultValidate.errors.length !== 0) {
            let errorArray = resultValidate.errors.map(e => {
                return e.stack.replace(`${resultValidate.propertyPath}.`, '');
            });

            return {
                status: false,
                errors: new Error(errorArray)
            };
        }

        return {status: true};
    },*/
    errorMicroservice: (code, messageError) => {
        let stack = null;
        let message = null;

        if (messageError instanceof Error) {
            stack = messageError.stack;
            message = messageError.message;
        } else {
            message = messageError;
        }

        return {
            code: code,
            isError: true,
            message: message,
            stack: stack,
        };
    }
};
