import express from "express";
import Settings from "../models/Settings.js";
import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Visitor from "../models/Visitor.js";

const router = express.Router();

/* SETTINGS */
router.get("/settings", async (req, res) => {
    const settings = await Settings.findOne();
    res.json(settings);
});

/* PROJECTS */
router.get("/projects", async (req, res) => {
    res.json(await Project.find());
});

/* CERTIFICATIONS */
router.get("/certifications", async (req, res) => {
    res.json(await Certification.find());
});

/* VISITORS */
router.post("/visitors", async (req, res) => {
    await Visitor.create(req.body);
    res.json({ success: true });
});

/* HEALTH CHECK ROUTE */
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is alive 🚀",
        time: new Date()
    });
});

export default router;
