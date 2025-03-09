const { extractAudio } = require("../services/ytAudioService");
const { extractTranscription } = require("../services/deepgramService");
const { TranscriptToBreakdown } = require("../services/geminiBreakdown");

exports.processTranscription = async (req, res) => {
   try {
      const { videoURL } = req.body;
      if (!videoURL) {
         return res.status(400).json({ error: "Video URL is required" });
      }

      const { filePath, tempDir } = await extractAudio(videoURL);
      const result = await extractTranscription(filePath, tempDir);

      const formattedTranscript = {
         sentences: result.flatMap((section) =>
            section.sentences.map((sentence) => ({
               text: sentence.text,
               start: sentence.start,
               end: sentence.end,
            }))
         ),
      };

      const GeminiResponse = await TranscriptToBreakdown(formattedTranscript);
      res.json(GeminiResponse);
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};
