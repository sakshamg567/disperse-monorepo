const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const TranscriptToBreakdown = async (transcript) => {
   try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const promptPath = path.join(__dirname, "../config/prompt.json");
      const { system_prompt } = JSON.parse(await fs.promises.readFile(promptPath, "utf8"));

      const AnalysisModel = genAI.getGenerativeModel(
         { model: "gemini-2.0-pro-exp-02-05", systemInstruction: system_prompt },
         { apiVersion: "v1beta" }
      );

      const response = await AnalysisModel.generateContent(JSON.stringify(transcript));
      let responseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      responseText = responseText.replace(/```json|```/g, "").trim();

      return JSON.parse(responseText);
   } catch (error) {
      console.error("Error in Gemini Processing:", error);
      return { error: "Failed to process transcript" };
   }
};

module.exports = { TranscriptToBreakdown };
