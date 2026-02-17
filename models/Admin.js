const mongoose = require("mongoose");
module.exports = mongoose.model("Admin", {
    username: String,
    password: String
});
