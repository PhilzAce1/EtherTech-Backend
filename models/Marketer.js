const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const marketerSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    minLength: 3,
    maxLength: 20,
    default: 'no Username',
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  bal: {
    type: Number,
    default: 0,
  },
});

marketerSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
marketerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    config.get('jwtPrivateKey')
  );

  return token;
};

module.exports = mongoose.model('Marketer', marketerSchema);
