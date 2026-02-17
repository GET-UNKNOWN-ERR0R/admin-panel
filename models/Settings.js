const mongoose = require("mongoose");
module.exports = mongoose.model("Settings", {
    aboutLine1: String,
    aboutLine2: String,
    resumeLink: String,
    profileImage: String
});
