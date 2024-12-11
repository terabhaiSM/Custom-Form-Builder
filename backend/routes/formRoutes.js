const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

router.post("/", formController.createForm);
router.put("/:id", formController.updateForm);
router.delete("/:id", formController.deleteForm);
router.get("/:id", formController.getFormById);
router.get("/share/:uuid", formController.getFormByUUID);
router.get("/", formController.getAllForms);

module.exports = router;