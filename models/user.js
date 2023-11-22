const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // Your user schema definition
});

const User = mongoose.model('User', userSchema);

module.exports = User;
