const mongoose = require("mongoose");
// Schemas + Modèle User
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    balance: Number,
  });

  const User = mongoose.model('User',userSchema);

  module.exports = User;