const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const { cleanup } = require("../utils/fileUtils");
const dotenv = require("dotenv");
dotenv.config();
const deepgram = createClient(process.env.DEEPGRAM_SECRET_KEY);

const extractTranscription = async (filePath, tempDir) => {
   try {
      if (!fs.existsSync(filePath)) {
         throw new Error(`File not found: ${filePath}`);
      }

      const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
         fs.readFileSync(filePath),
         {
            model: "nova-3",
            smart_format: true,
            paragraphs: true,
         }
      );

      if (error) throw error;

      return result?.results?.channels[0]?.alternatives[0]?.paragraphs.paragraphs;
   } finally {
      cleanup(tempDir);
   }
};

module.exports = { extractTranscription };
