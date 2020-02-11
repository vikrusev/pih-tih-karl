const responseModule = (() => {

    const ok = (res, obj) => {
        res.type('json');
        res.status(200);
        res.json(obj);
        res.end();

        return false;
    }

    const err = (res, err, status?: number | string) => {
        status = Number(status);

        if (!status) {
            status = 500;
        }

        let error = {
            message: null
        };

        if (err instanceof Error) {
            error.message = err.message;
        } else if (typeof err == "string") {
            error.message = err;
        } else {
            error.message = JSON.stringify(err);
        }

        res.type('json');
        res.status(status);
        res.send(error);
        res.end();

        return false;
    }
    
    const unauthorized = (res, msg) => {
        let error = {
            message: null
        };

        error.message = msg || "user is not authorized";

        res.type('json');
        res.status(401);
        res.json(error);
        res.end();

        return false;
    }

    return {
        ok,
        err,
        unauthorized
    }

})();

export { responseModule };