
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connected");

        const username = process.env.ADMIN_USER;
        const password = process.env.ADMIN_PASS;

        if (!username || !password) {
            console.log("❌ ADMIN_USER or ADMIN_PASS missing in .env");
            process.exit();
        }

        const exists = await Admin.findOne({ username });

        if (exists) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }

        const hash = await bcrypt.hash(password, 10);

        await Admin.create({
            username,
            password: hash
        });

        console.log("✅ Admin Created");
        process.exit();

    } catch (err) {
        console.log(err);
    }
})();
