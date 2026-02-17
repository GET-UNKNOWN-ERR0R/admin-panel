
const Visitor = require("../models/Visitor");

module.exports = async (req, res, next) => {
    try {
        if (req.session?.admin) return next();

        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            "unknown";

        const data = {
            country: req.headers["cf-ipcountry"] || "",
            device: req.headers["user-agent"] || ""
        };

        const exist = await Visitor.findOne({ ip });

        if (exist) {
            exist.count += 1;
            exist.lastVisit = new Date();
            await exist.save();
        } else {
            await Visitor.create({ ip, ...data });
        }

    } catch (err) {
        console.log(err);
    }
    next();
};
