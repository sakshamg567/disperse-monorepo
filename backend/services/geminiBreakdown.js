const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const promptPath = path.join(__dirname, "../config/prompt.json");

// Initialize models and export functions
const initializeGeminiService = async () => {
   try {
      const promptFile = await fs.promises.readFile(promptPath, "utf8");
      const { index_prompt, summary_prompt } = JSON.parse(promptFile);

      const IndexModel = genAI.getGenerativeModel(
         {
            model: "gemini-2.0-flash-lite",
            systemInstruction: index_prompt
         },
         {
            apiVersion: "v1beta"
         }
      );

      const SummaryModel = genAI.getGenerativeModel(
         {
            model: "gemini-2.0-flash-lite",
            systemInstruction: summary_prompt
         },
         {
            apiVersion: "v1beta"
         }
      );

      const TranscriptToIndex = async (transcript) => {
         try {
            const response = await IndexModel.generateContent(JSON.stringify(transcript));
            let responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            responseText = responseText.replace(/```json|```/g, "").trim();
      
            return JSON.parse(responseText);
         } catch (error) {
            console.error("Error in Index Generation:", error);
            return { error: "Failed to generate index" };
         }
      };

      const TranscriptToSummary = async (transcript) => {
         try {
            const response = await SummaryModel.generateContent(JSON.stringify(transcript));
            let responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // Summary might not be JSON, return as plain text
            return responseText;
         } catch (error) {
            console.error("Error in Summary Generation:", error);
            return { error: "Failed to generate summary" };
         }
      };

      return { TranscriptToIndex, TranscriptToSummary };
   } catch (error) {
      console.error("Error initializing Gemini service:", error);
      throw error;
   }
};

// Export the initialization function
module.exports = initializeGeminiService;