const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plant-controller");
var verify = require("../util/tokenVerifier");

router.get("/info", plantController.getPlantInfos);

router.post("/create", verify, plantController.registPlant);

router.get("/myplant", verify, plantController.getAllPlant);

router.get("/myplant/:index", verify, plantController.getPlantByIndex);

router.get("/water/:index", verify, plantController.getWaterLogByIndex);

router.post("/complete/:index", verify, plantController.setComplete);

module.exports = router;
