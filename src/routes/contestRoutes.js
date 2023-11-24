const express = require("express");
const contestController = require("../controllers/contestController");

const router = express.Router();

router
  .route("/")
  .get(contestController.getAllContests)
  .post(contestController.createContest);
router
  .route("/:id")
  .get(contestController.getContestById)
  .patch(contestController.updateContest)
  .delete(contestController.deleteContest);

module.exports = router;
