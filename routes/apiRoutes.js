const router = require("express").Router();
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const Settings = require("../models/Settings");

router.get("/projects", async (req, res) => {
    res.json(await Project.find());
});

router.get("/certifications", async (req, res) => {
    res.json(await Certification.find());
});

router.get("/settings", async (req, res) => {
    res.json(await Settings.findOne());
});

router.post("/visitors", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
