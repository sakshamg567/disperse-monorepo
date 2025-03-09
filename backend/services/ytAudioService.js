const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

const extractAudio = (videoURL) => {
   return new Promise((resolve, reject) => {
      const tempDir = path.join(os.tmpdir(), `yt-extract-${uuidv4()}`);

      if (!fs.existsSync(tempDir)) {
         fs.mkdirSync(tempDir, { recursive: true });
      }

      const outputPath = path.join(tempDir, "audio.mp3");

      const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" "${videoURL}"`;

      exec(command, (error, stdout, stderr) => {
         if (error) {
            require("../utils/fileUtils").cleanup(tempDir);
            return reject(`Error: ${error.message}`);
         }

         resolve({ filePath: outputPath, tempDir });
      });
   });
};

module.exports = { extractAudio };
