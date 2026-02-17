const mongoose = require("mongoose");
module.exports = mongoose.model("Certification", {
    title: String,
    provider: String,
    year: String,
    image: String
});
