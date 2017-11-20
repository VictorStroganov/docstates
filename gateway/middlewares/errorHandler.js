'use strict';

module.exports = (err, req, res, next) => {
    if (err instanceof Error) {
        console.error(err.stack);

        return res.status(500).send({
            code: 500,
            message: `Internal server error: ${err.message}`,
            data: {stack: err.stack}
        });
    }

    res.send(err);
    next();
};
