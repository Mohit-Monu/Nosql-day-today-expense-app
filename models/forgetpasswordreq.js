const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const forgetpass = new Schema({
  isactive: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    required: true,
  },
  uuid:{
    type: String,
    required: true,
  }
});
module.exports = mongoose.model("forgetpasswordrequests", forgetpass);
