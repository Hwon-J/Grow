const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plant-controller");
var verify = require("../util/tokenVerifier");

router.get("/info", plantController.getPlantInfos);

router.post("/create", verify, plantController.registPlant);

module.exports = router;
