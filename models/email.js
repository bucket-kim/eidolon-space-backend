const mongoose = require("mongoose");
const validator = require("validator");

const emailSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  date: String,
});

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
