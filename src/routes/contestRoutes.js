const express = require("express");
const contestController = require("../controllers/contestController");

const router = express.Router();

router.route("/admin").get(contestController.getAllContestsForAdmin);

router
  .route("/")
  .get(contestController.getAllContests)
  .post(contestController.createContest);
router
  .route("/:id")
  .get(contestController.getContestById)
  .patch(contestController.updateContest)
  .delete(contestController.deleteContest);

router.route("/creator/:creatorId").get(contestController.getContestByCreator);
router
  .route("/:contestId/participant/:userId")
  .patch(contestController.addParticipant);

module.exports = router;
