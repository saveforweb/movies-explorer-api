const mongoose = require('mongoose');
const validator = require('validator');

const {
  checkEmailMessage,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, checkEmailMessage],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
});

module.exports = mongoose.model('user', userSchema);
