const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant-controller');

router.get('/info', plantController.getPlantInfos);

router.post('/create', plantController.createPlant);

module.exports = router;