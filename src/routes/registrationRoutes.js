const express = require("express");
const registrationController = require("../controllers/registrationController");
const router = express.Router();

// Add new registration
router.post("/", registrationController.createRegistration);

// Get all registrations
router.get("/", registrationController.getAllRegistrations);

// Download registrations
router.get("/download", registrationController.downloadRegistrations);

module.exports = router;
