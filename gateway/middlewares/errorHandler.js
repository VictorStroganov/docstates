'use strict';

module.exports = (err, req, res, next) => {
    if (err.isBoom) {
        return res.status(err.output.statusCode).send({
            code: err.output.statusCode,
            message: err.output.payload.message,
            data: {
                call: err.callpoint,
                stack: err.stack
            }
        });
    }
    if (err instanceof Error) {
        console.error(err.stack);

        return res.status(500).send({
            code: 500,
            message: `Internal server error: ${err.message}`,
            data: {
                call: err.callpoint,
                stack: err.stack
            }
        });
    }

    res.send(err);
    next();
};
