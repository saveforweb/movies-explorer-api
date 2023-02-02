const { errorCodes } = require('../utils/errorCodes');

const { serverErrorMessage } = require('../utils/constants');

module.exports = ((err, req, res, next) => {
  const { statusCode = errorCodes.internalServerError, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === errorCodes.internalServerError
        ? serverErrorMessage
        : message,
    });
  next();
});
