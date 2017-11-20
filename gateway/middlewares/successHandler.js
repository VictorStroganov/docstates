'use strict';

module.exports = (req, res, next) => {
    if (req.result && req.result.isError) {
        const error = req.result;

        return res.status(error.code).send({
            code: error.code,
            message: error.message,
            data: {stack: error.stack}
        });
    }

    res.send({
        code: 200,
        message: '',
        data: req.result
    });

    next();
};
