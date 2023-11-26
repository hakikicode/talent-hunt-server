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

router.route("/popular").get(contestController.getPopularContests);
router.route("/best-creator").get(contestController.getBestCreatorByPrizeMoney);

router
  .route("/")
  .get(contestController.getAllContests)
  .post(verifyToken, verifyRole("creator"), contestController.createContest);

router.use(verifyToken);

router
  .route("/:id")
  .get(contestController.getContestById)
  .patch(verifyRole("creator", "admin"), contestController.updateContest)
  .delete(verifyRole("creator", "admin"), contestController.deleteContest);

router
  .route("/creator/:creatorId")
  .get(verifyRole("creator", "admin"), contestController.getContestByCreator);
router
  .route("/:contestId/participant/:userId")
  .patch(verifyRole("user"), contestController.addParticipant);

module.exports = router;
