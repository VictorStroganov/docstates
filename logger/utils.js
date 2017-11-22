'use strict';

const uuid = require('uuid/v4');
const boom = require('boom');
const Seneca = require('seneca');
const Validator = require('jsonschema').Validator;
const validator = new Validator();

const DEFAULT_MICRO_SERVICE_TIMEOUT = 30000;

const internals = {
    initClient: (options, defaultPattern = null, owner = null, logger = null, auth = null) => {
        if (!options) {
            throw new Error(`Parameter 'options' is required.`);
        }

        let client = Seneca({
            tag: options.tag || options.name,
            timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT
        }).client({port: options.port, timeout: options.timeout || DEFAULT_MICRO_SERVICE_TIMEOUT});

        let pattern = {};
        if (defaultPattern) {
            pattern = Object.assign(pattern, defaultPattern);
        }
        pattern.service = options.name;

        return {
            owner: owner,
            call: async (cmd, data, params) => {
                data = data || {};
                if (!data._userId && data.token && auth) {
                    let authResult = await auth.call('getUserIdByToken', data);
                    data._userId = authResult.userId;
                }
                if (!data._requestId) {
                    data._requestId = uuid();
                }
                return new Promise((resolve, reject) => {
                    let localPattern = Object.assign({}, pattern);
                    localPattern.cmd = cmd;
                    localPattern.data = data;
                    if (params) {
                        localPattern = Object.assign(localPattern, params);
                    }
                    if (logger) {
                        logger.push({
                            cmd: 'info',
                            message: `${logger.owner} -> ${pattern.service}: вызов функции '${cmd}'.`,
                            source: logger.owner,
                            destination: pattern.service,
                            pattern: pattern,
                            func: cmd,
                            data: data
                        });
                    }
                    client.act(localPattern, (err, result) => {
                        if (err) {
                            if (logger) {
                                logger.push({
                                    cmd: 'error',
                                    message: `${logger.owner} -> ${pattern.service}: ошибка при вызове функции '${cmd}': ${err.message}.`,
                                    source: logger.owner,
                                    destination: pattern.service,
                                    pattern: pattern,
                                    func: cmd,
                                    data: data,
                                    err: err
                                });
                            }
                            return reject(err);
                        }

                        if (logger) {
                            logger.push({
                                cmd: 'info',
                                message: `${logger.owner} <- ${pattern.service}: получен результат вызова функции '${cmd}'.`,
                                source: logger.owner,
                                destination: pattern.service,
                                pattern: pattern,
                                func: cmd,
                                data: data,
                                result: result
                            });
                        }
                        resolve(result);
                    });
                });
            },
            push: params => {
                let localPattern = Object.assign({}, pattern);
                if (params) {
                    localPattern = Object.assign(localPattern, params);
                    if (!localPattern.cmd) {
                        localPattern.cmd = 'info';
                    }
                    if (!localPattern.source) {
                        localPattern.source = localPattern.service;
                    }
                }
                client.act(localPattern, (err, result) => {
                    if (err) {
                        throw err;
                    }
                });
            }
        };
    },
    initListener: (options, defaultPattern = null, logger = null) => {
        if (!options) {
            throw new Error(`Parameter 'options' is required.`);
        }

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
                listener.add(localPattern, (req, callback) => {
                    if (logger) {
                        logger.push({
                            cmd: 'info',
                            message: `${pattern.service}: пришел вызов функции '${cmd}'.`,
                            source: pattern.service,
                            pattern: pattern,
                            func: cmd,
                            data: req.data
                        });
                    }
                    return func(req)
                        .then(data => {
                            if (logger) {
                                logger.push({
                                    cmd: 'info',
                                    message: `${pattern.service}: отправлен результат вызова функции '${cmd}'.`,
                                    source: pattern.service,
                                    pattern: pattern,
                                    func: cmd,
                                    data: req.data,
                                    result: data
                                });
                            }
                            return callback(null, data);
                        })
                        .catch(err => {
                            if (logger) {
                                logger.push({
                                    cmd: 'error',
                                    message: `${pattern.service}: Ошибка при вызове функции '${cmd}': ${err.message}.`,
                                    source: pattern.service,
                                    pattern: pattern,
                                    func: cmd,
                                    data: req.data,
                                    err: err
                                });
                            }
                            return callback(err);
                        });
                });
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
            params = params || {};
            if (!params._requestId) {
                params._requestId = uuid();
            }
            return await func(params);
        } catch (err) {
            next(err);
        }
    },
    validate: (data, scheme) => {
        if (!data) {
            throw boom.badRequest('ValidationError: input parameters is empty.');
        }

        const resultValidate = validator.validate(data, scheme);

        if (resultValidate.errors.length !== 0) {
            let errorArray = resultValidate.errors.map(e => {
                return e.stack.replace(`${resultValidate.propertyPath}.`, '');
            });

            throw boom.badRequest('ValidationError: ' + new Error(errorArray));
        }
    }
};

module.exports = {
    initSecuredClient: (options, auth, logger, defaultPattern = null) => {
        if (!auth) {
            throw new Error(`Parameter 'auth' is required for this type of client`);
        }
        if (!logger) {
            throw new Error(`Parameter 'logger' is required for this type of client`);
        }
        return internals.initClient(options, defaultPattern, null, logger, auth);
    },
    initLoggedClient: (options, logger, defaultPattern = null) => {
        if (!logger) {
            throw new Error(`Parameter 'logger' is required for this type of client`);
        }
        return internals.initClient(options, defaultPattern, null, logger);
    },
    initLoggerClient: (options, owner, defaultPattern = null) => {
        if (!owner) {
            throw new Error(`Parameter 'owner' is required for this type of client`);
        }
        return internals.initClient(options, defaultPattern, owner, null);
    },
    initLoggedListener: (options, logger, defaultPattern = null) => {
        if (!logger) {
            throw new Error(`Parameter 'logger' is required for this type of client`);
        }
        return internals.initListener(options, defaultPattern, logger);
    },
    initClient: internals.initClient,
    initListener: internals.initListener,
    call: internals.call,
    validate: internals.validate,
};
