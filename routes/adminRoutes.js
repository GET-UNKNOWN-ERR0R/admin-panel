import express from "express";
import upload from "../middleware/upload.js";
import { isAdmin } from "../middleware/auth.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

import Project from "../models/Project.js";
import Certification from "../models/Certification.js";
import Settings from "../models/Settings.js";
import Visitor from "../models/Visitor.js";

const router = express.Router();

/* LOGIN */
router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res) => {
    if (
        req.body.email === process.env.ADMIN_USER &&
        req.body.password === process.env.ADMIN_PASS
    ) {
        req.session.admin = true;
        return res.redirect("/admin/dashboard");
    }
    res.redirect("/admin/login");
});

/* DASHBOARD */
router.get("/dashboard", isAdmin, (req, res) => {
    res.render("dashboard");
});

/* PROJECTS */

router.get("/projects", isAdmin, async (req, res) => {
    res.render("projects", { projects: await Project.find() });
});

router.post(
    "/projects",
    isAdmin,
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.send("No file uploaded");
            }

            const image = await uploadToCloudinary(req.file, "projects");

            await Project.create({
                title: req.body.title,
                description: req.body.description,
                tech: req.body.tech.split(","),
                github: req.body.github,
                live: req.body.live,
                image
            });

            res.redirect("/admin/projects");
        } catch (err) {
            console.error("Project upload error:", err.message);
            res.send("Cloudinary upload failed");
        }
    }
);


router.get("/projects/delete/:id", isAdmin, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/admin/projects");
});

/* CERTIFICATIONS */

router.get("/certifications", isAdmin, async (req, res) => {
    res.render("certifications", {
        certs: await Certification.find()
    });
});

router.post(
    "/certifications",
    isAdmin,
    upload.single("image"),
    async (req, res) => {
        const image = await uploadToCloudinary(req.file, "certifications");

        await Certification.create({
            ...req.body,
            image
        });

        res.redirect("/admin/certifications");
    }
);

router.get("/certifications/delete/:id", isAdmin, async (req, res) => {
    await Certification.findByIdAndDelete(req.params.id);
    res.redirect("/admin/certifications");
});

/* SETTINGS */

router.get("/settings", isAdmin, async (req, res) => {
    res.render("settings", {
        settings: await Settings.findOne()
    });
});

router.post(
    "/settings",
    isAdmin,
    upload.fields([
        { name: "profileImage" },
        { name: "resume" }
    ]),
    async (req, res) => {
        const profileImage = req.files.profileImage
            ? await uploadToCloudinary(req.files.profileImage[0], "profile")
            : req.body.oldProfile;

        await Settings.findOneAndUpdate(
            {},
            {
                aboutLine1: req.body.aboutLine1,
                aboutLine2: req.body.aboutLine2,
                profileImage,
                resumeLink: req.body.resumeLink
            },
            { upsert: true }
        );

        res.redirect("/admin/settings");
    }
);

/* VISITORS */

router.get("/visitors", isAdmin, async (req, res) => {
    res.render("visitors", {
        visitors: await Visitor.find().sort({ createdAt: -1 })
    });
});

router.post("/visitors/delete/:id", isAdmin, async (req, res) => {
    try {
        await Visitor.findByIdAndDelete(req.params.id);
        res.redirect("/admin/visitors");
    } catch (err) {
        console.log(err);
        res.redirect("/admin/visitors");
    }
});



export default router;
