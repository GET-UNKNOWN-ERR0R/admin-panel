const mongoose = require("mongoose");
module.exports = mongoose.model("Project", {
    title: String,
    description: String,
    tech: {
        type: [String]
    },
    image: String,
    github: String,
    live: String,
    featured: Boolean
});
