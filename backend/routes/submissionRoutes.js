const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");

router.post("/:id/submissions", submissionController.submitForm);
router.get("/:id/submissions", submissionController.getSubmissionsByFormId);

module.exports = router;