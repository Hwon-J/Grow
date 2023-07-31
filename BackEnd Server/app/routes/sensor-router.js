const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor-controller');

router.post('/', sensorController.insertSensorData);

module.exports = router;