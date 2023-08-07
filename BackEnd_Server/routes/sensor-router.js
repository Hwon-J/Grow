const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor-controller');

router.put('/', sensorController.updateSensorData);

router.post('/', sensorController.insertWaterLog);

module.exports = router;