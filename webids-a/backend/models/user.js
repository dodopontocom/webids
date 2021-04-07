const mongoose = require('mongoose');
const uniqueVal = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

});

userSchema.plugin(uniqueVal);

module.exports = mongoose.model('User', userSchema);
