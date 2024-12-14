const Registration = require("../models/registrationModel");

// Add new registration
exports.createRegistration = async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ message: "Registration saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save registration" });
  }
};

// Get all registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch registrations" });
  }
};

// Download all registrations
exports.downloadRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find();
    const csvData = registrations
      .map((r) =>
        [
          r.name,
          r.gender,
          r.age,
          r.stateOfOrigin,
          r.localGovernment,
          r.nationality,
          r.instagramHandle || "N/A",
          r.facebookHandle || "N/A",
          r.createdAt,
        ].join(",")
      )
      .join("\n");

    const header = "Name,Gender,Age,State of Origin,Local Government,Nationality,Instagram Handle,Facebook Handle,Created At\n";
    res.header("Content-Type", "text/csv");
    res.attachment("registrations.csv");
    res.send(header + csvData);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to download registrations" });
  }
};
