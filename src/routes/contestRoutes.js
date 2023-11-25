const express = require("express");
const contestController = require("../controllers/contestController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

const router = express.Router();

router
  .route("/admin")
  .get(
    verifyToken,
    verifyRole("admin"),
    contestController.getAllContestsForAdmin
  );

router
  .route("/")
  .get(contestController.getAllContests)
  .post(verifyToken, contestController.createContest);

router.use(verifyToken);

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
