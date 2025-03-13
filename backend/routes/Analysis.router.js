const express = require("express");
const router = express.Router();
const { handleProcessVideo } = require("../controllers/analysisController");

router.post('/process', handleProcessVideo)

module.exports = router;
