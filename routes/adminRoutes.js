
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const Project = require("../models/Project");
const Certification = require("../models/Certification");
const Settings = require("../models/Settings");

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const Visitor = require("../models/Visitor");

router.get("/visitors", auth, async (req, res) => {
    const visitors = await Visitor.find().sort({ time: -1 });
    res.render("visitors", { visitors });
});


// ================= LOGIN =================

router.get("/login", (req, res) => res.render("login"));


router.post("/login", async (req, res) => {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) return res.send("Invalid username");

    const ok = await bcrypt.compare(req.body.password, admin.password);
    if (!ok) return res.send("Invalid password");

    req.session.admin = admin._id;
    res.redirect("/admin/dashboard");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/admin/login"));
});

router.get("/dashboard", auth, (req, res) => res.render("dashboard"));

// Projects

router.get("/projects", auth, async (req, res) => {
    res.render("projects", { projects: await Project.find() });
});


// ADD PROJECT
router.post("/projects/add", auth, upload.single("image"), async (req, res) => {
    let image = "";
    if (req.file) {
        const r = await cloudinary.uploader.upload(req.file.path);
        image = r.secure_url;
    }

    await Project.create({
        title: req.body.title,
        description: req.body.description,
        tech: req.body.tech?.split(","),
        github: req.body.github,
        live: req.body.live,
        image
    });

    res.redirect("/admin/projects");
});

router.post("/projects", auth, upload.single("image"), async (req, res) => {

    let image = "";
    if (req.file) {
        const r = await cloudinary.uploader.upload(req.file.path);
        image = r.secure_url;
    }

    const techArray = req.body.tech.split(",").map(t => t.trim());

    await Project.create({
        ...req.body,
        tech: techArray,
        image
    });

    res.redirect("/admin/projects");
});



// DELETE PROJECT
router.get("/projects/delete/:id", auth, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/admin/projects");
});


// UPDATE PROJECT
router.post("/projects/update/:id", auth, upload.single("image"), async (req, res) => {
    let image = req.body.oldImage;

    if (req.file) {
        const r = await cloudinary.uploader.upload(req.file.path);
        image = r.secure_url;
    }

    await Project.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        tech: req.body.tech?.split(","),
        github: req.body.github,
        live: req.body.live,
        image
    });

    res.redirect("/admin/projects");
});


// Certifications

router.get("/certifications", auth, async (req, res) => {
    res.render("certifications", { certs: await Certification.find() });
});


// ADD CERT
router.post("/certifications/add", auth, upload.single("image"), async (req, res) => {
    let image = "";
    if (req.file) {
        const r = await cloudinary.uploader.upload(req.file.path);
        image = r.secure_url;
    }

    await Certification.create({
        title: req.body.title,
        provider: req.body.provider,
        year: req.body.year,
        image
    });

    res.redirect("/admin/certifications");
});


// DELETE CERT
router.get("/certifications/delete/:id", auth, async (req, res) => {
    await Certification.findByIdAndDelete(req.params.id);
    res.redirect("/admin/certifications");
});


// UPDATE CERT
router.post("/certifications/update/:id", auth, upload.single("image"), async (req, res) => {
    let image = req.body.oldImage;

    if (req.file) {
        const r = await cloudinary.uploader.upload(req.file.path);
        image = r.secure_url;
    }

    await Certification.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        provider: req.body.provider,
        year: req.body.year,
        image
    });

    res.redirect("/admin/certifications");
});


// Settings

router.get("/settings", auth, async (req, res) => {
    const s = await Settings.findOne();
    res.render("settings", { s });
});


// UPDATE SETTINGS 
router.post("/settings", auth, upload.fields([
    { name: "profileImage" },
    { name: "resume" }
]), async (req, res) => {

    let profileImage = req.body.oldProfile;
    let resume = req.body.oldResume;

    if (req.files?.profileImage) {
        const r = await cloudinary.uploader.upload(req.files.profileImage[0].path);
        profileImage = r.secure_url;
    }

    if (req.files?.resume) {
        const r = await cloudinary.uploader.upload(req.files.resume[0].path, {
            resource_type: "raw"
        });
        resume = r.secure_url;
    }

    await Settings.findOneAndUpdate({}, {
        aboutLine1: req.body.aboutLine1,
        aboutLine2: req.body.aboutLine2,
        profileImage,
        resumeLink: resume
    }, { upsert: true });

    res.redirect("/admin/settings");
});


module.exports = router;
