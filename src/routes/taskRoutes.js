const express = require("express");

const taskController = require("../controllers/taskController");
const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

const router = express.Router();

router.use(verifyToken);

router
  .route("/contests/:contestId")
  .get(taskController.getTaskById)
  .post(taskController.createTask);

module.exports = router;
