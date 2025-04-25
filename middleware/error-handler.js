const CustomAPIError = require("../errors/customeAPIError");

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
};

module.exports = errorHandler;
