const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant-controller');

router.get('/info', plantController.getPlantInfos);



module.exports = router;