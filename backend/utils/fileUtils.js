const fs = require("fs");

const cleanup = (tempDir) => {
   if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
   }
};

module.exports = { cleanup };
