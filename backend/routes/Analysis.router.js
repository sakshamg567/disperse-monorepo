const express = require("express");
const router = express.Router();
const { processTranscription } = require("../controllers/analysisController");

router.post("/transcribe", processTranscription);

module.exports = router;
