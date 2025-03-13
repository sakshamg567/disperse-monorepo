const formatTranscript = (TimedTranscript) => {
   const formattedTranscript = {
      sentences: TimedTranscript.flatMap((section) =>
         section.sentences.map((sentence) => ({
            text: sentence.text,
            start: sentence.start,
            end: sentence.end,
         }))
      ),
   };
   return formattedTranscript
}

module.exports = formatTranscript
