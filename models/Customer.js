const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marketer',
  },
  verified: {
    type: Boolean,
  },
  status: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Customer', customerSchema);
