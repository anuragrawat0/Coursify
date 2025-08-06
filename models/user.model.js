const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    maxLength : 100
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxLength : 100
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }

})



module.exports = mongoose.model('User', userSchema);
