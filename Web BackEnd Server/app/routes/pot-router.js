const express = require('express');
const router = express.Router();
const cors = require("cors");
router.use(cors({
    Credentials : true
}))
const potController = require('../controllers/pot-controller');

router.get('/:number', potController.checkSerial);

module.exports = router;