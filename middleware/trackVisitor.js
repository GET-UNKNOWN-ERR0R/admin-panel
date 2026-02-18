
import Visitor from "../models/Visitor.js";

export const trackVisitor = async (req, res, next) => {
    await Visitor.create(req.body);
    res.json({ success: true });
};
