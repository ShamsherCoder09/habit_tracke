const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  diet: {
    type: String,
    enum: ['done', 'not done', 'none'],
  },
  walk: {
    type: String,
    enum: ['done', 'not done', 'none'],
  },
  book: {
    type: String,
    enum: ['done', 'not done', 'none'],
  },
  podcast: {
    type: String,
    enum: ['done', 'not done', 'none'],
  },
  skincare: {
    type: String,
    enum: ['done', 'not done', 'none'],
  },
  calendarEvent: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'CalendarEvent'
  },
  token: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// store hashed password in database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
