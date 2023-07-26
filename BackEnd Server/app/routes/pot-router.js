const express = require("express");
const router = express.Router();
const potController = require("../controllers/pot-controller");

router.get("/:number", potController.checkSerial);

const cors = require("cors");
router.use(
  cors({
    Credentials: true,
  })
);

module.exports = router;
