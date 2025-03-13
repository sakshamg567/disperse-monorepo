const { extractAudio } = require("../services/ytAudioService");
const { ExtractTimedTranscript, ExtractTranscriptParagraph, extractTranscription } = require("../services/deepgramService");
const initializeGeminiService = require("../services/geminiBreakdown");
const formatTranscript = require("../utils/formatTranscript");

let geminiService = null;

// Initialize the service when the server starts
(async () => {
   try {
     geminiService = await initializeGeminiService();
   } catch (error) {
     console.error("Failed to initialize Gemini service:", error);
     process.exit(1); // Exit if we can't initialize the service
   }
 })();
 

const handleProcessVideo = async(req, res) => {
   let filePath, tempDir, result;
   try {
      if(!geminiService){
         return res.status(500).json({error: "geminiService initialization failed"})
      }
      const { videoURL } = req.body;
      if (!videoURL) {
         return res.status(400).json({ error: "Video URL is required" });
      }
      try {
         const audiofile = await extractAudio(videoURL);
         filePath = audiofile?.filePath;
         tempDir = audiofile?.tempDir;
      } catch(e){
         console.error("error in audio extraction");
         return res.status(500).json({error: e.message})
      }
      try {
         result = await extractTranscription(filePath, tempDir);
      } catch(e){
         console.error("error in deepgramService");
         return res.status(500).json({error: e.message})
      }  
      // console.log(result);
      
      const TimedTranscript = ExtractTimedTranscript(result);
      const TranscriptParagraph = ExtractTranscriptParagraph(result);
      
      const formattedTranscript = formatTranscript(TimedTranscript);
      // console.log(formattedTranscript);
      

      const [Index, Summary] = await Promise.all([
         geminiService.TranscriptToIndex(formattedTranscript), 
         geminiService.TranscriptToSummary(TranscriptParagraph)
      ])

      res.json({
         status: "success",
         data: {
            index: Index,
            summary: Summary
         }
      });
   } catch(error) {
      console.error("Error in video pipeline");
      res.status(500).json({
         status: "failed",
         error: error.message
      })
   }
}

module.exports = {handleProcessVideo}