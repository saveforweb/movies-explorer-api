const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const errorsList = require('../errors/index');

const {
  needAuthMessage,
} = require('../utils/constants');

const tokenString = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new errorsList.UnauthorizedError(needAuthMessage);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, tokenString);
  } catch (err) {
    throw new errorsList.UnauthorizedError(needAuthMessage);
  }

  req.user = payload;

  return next();
};
