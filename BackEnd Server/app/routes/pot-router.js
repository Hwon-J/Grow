const express = require("express");
const router = express.Router();
const potController = require("../controllers/pot-controller");

router.get("/:number", potController.checkSerial);

module.exports = router;
