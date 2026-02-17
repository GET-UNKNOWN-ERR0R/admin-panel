
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ip: String,
    country: String,
    city: String,
    device: String,
    browser: String,
    count: { type: Number, default: 1 },
    lastVisit: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Visitor", visitorSchema);
