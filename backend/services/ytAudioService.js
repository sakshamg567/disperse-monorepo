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
      const cookiesPath = path.join(__dirname, "cookies.txt");  // Use manually uploaded cookies

      const command = `yt-dlp --cookies "${cookiesPath}" -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" "${videoURL}"`;

      console.log("Running yt-dlp command:", command);

      exec(command, (error, stdout, stderr) => {
         if (error) {
            console.error("YT-DLP Error:", stderr);
            return reject(`Error: ${stderr}`);
         }

         console.log("YT-DLP Output:", stdout);
         resolve({ filePath: outputPath, tempDir });
      });
   });
};


module.exports = { extractAudio };
