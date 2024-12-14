const validateRegistration = (req, res, next) => {
    const { name, gender, email, age, talentCategory, whatsapp, callingLine, school, stateOfOrigin, nationality, localGovernment, instagramHandle, facebookHandle, phoneNumber, stageName } = req.body;
  
    if (!name || !gender || !age || !talentCategory || !whatsapp || !callingLine || !school || !stateOfOrigin || !nationality || !localGovernment || !instagramHandle || !facebookHandle | !phoneNumber || !stageName ) {
      return res.status(400).json({ message: "All fields are required!" });
    }
  
    next();
  };
  
  module.exports = validateRegistration;
  