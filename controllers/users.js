const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorsList = require('../errors/index');
const {
  incorrectDataCreateUserMessage,
  incorrectMailCreateUserMessage,
  incorrectMailAndPasswordMessage,
  userNotFoundMessage,
  incorrectDataGetUserMessage,
  incorrectDataUpdateUserMessage,
} = require('../utils/constants');

const tokenString = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError(incorrectDataCreateUserMessage));
      } else if (err.code === 11000) {
        next(new errorsList.ConflictError(incorrectMailCreateUserMessage));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let userId;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new errorsList.UnauthorizedError(incorrectMailAndPasswordMessage));
      }

      userId = user._id;
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return next(new errorsList.UnauthorizedError(incorrectMailAndPasswordMessage));
      }

      const token = jwt.sign({ _id: userId }, tokenString, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        next(new errorsList.NotFoundError(userNotFoundMessage));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError(incorrectDataGetUserMessage));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user === null) {
        next(new errorsList.NotFoundError(userNotFoundMessage));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new errorsList.BadRequestError(incorrectDataUpdateUserMessage));
      } else if (err.name === 'ValidationError') {
        next(new errorsList.BadRequestError(incorrectDataUpdateUserMessage));
      } else {
        next(err);
      }
    });
};
