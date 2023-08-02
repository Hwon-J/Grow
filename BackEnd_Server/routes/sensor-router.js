const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor-controller');

router.post('/sensor', sensorController.insertSensorData);

router.post('/water-log', sensorController.insertWaterLog);

module.exports = router;