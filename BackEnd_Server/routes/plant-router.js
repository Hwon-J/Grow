const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plant-controller");
var verify = require("../util/tokenVerifier");

router.get("/info", plantController.getPlantInfos);

router.post("/create", verify, plantController.registPlant);

router.get("/myplant", verify, plantController.getAllPlant);

router.get("/myplant/:index", verify, plantController.getPlantByIndex);

router.get("/water/:index", verify, plantController.getWaterLogByIndex);

router.put("/complete/:index", verify, plantController.setComplete);

router.get("/quest/:index", verify, plantController.getQuestionList);

router.post("/quest/:index", verify, plantController.registQuestion);

router.get("/quest/:index/audio", verify, plantController.getAnswerById);

router.delete("/quest/:index", verify, plantController.deleteQuestion);

router.delete("/myplant/:index", verify, plantController.deletePlantByIndex)

module.exports = router;
