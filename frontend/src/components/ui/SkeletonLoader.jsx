import { useState } from "react";
import YTEmbedTemplate from "../YTEmbedTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const SkeletionLoader = ({ videoID, videoIndex, aiSummary }) => {
   const [activeTab, setActiveTab] = useState("index");

   const handleSeek = (time) => {
      if (typeof window.seekToTime === 'function') {
         window.seekToTime(time);
      }
   };

   return (
      <div className="flex flex-col md:flex-row w-full min-h-screen p-4 space-y-4 md:space-y-0 md:space-x-4 bg-black max-w-6xl mx-auto overflow-y-auto">
         {/* Sidebar (Topics & Subtopics) */}
         <div className="w-full md:w-1/4 max-w-[280px] space-y-4 text-white">
            <h2 className="font-bold text-xl sticky top-0 bg-black pb-2 z-10">Video Topics</h2>
            
            {videoIndex?.length > 0 ? (
               videoIndex.map((topic, index) => (
                  <div key={index} className="mb-4">
                     <h3 
                        className="text-lg font-semibold cursor-pointer hover:text-blue-400"
                        onClick={() => handleSeek(topic.subtopics[0]?.start || 0)}
                     >
                        {topic.topic}
                     </h3>
                     <ul className="pl-4 mt-1">
                        {topic.subtopics?.map((subtopic, subIndex) => (
                           <li 
                              key={subIndex} 
                              className="text-sm text-gray-300 cursor-pointer hover:text-blue-400"
                              onClick={() => handleSeek(subtopic.start)}
                           >
                              {subtopic.name} ({formatTimestamp(subtopic.start)})
                           </li>
                        ))}
                     </ul>
                  </div>
               ))
            ) : (
               <>
                  <div className="h-10 bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-6 bg-gray-700 rounded-md w-5/6 animate-pulse"></div>
                  <div className="h-6 bg-gray-700 rounded-md w-4/6 animate-pulse"></div>
                  <div className="h-6 bg-gray-700 rounded-md w-5/6 animate-pulse"></div>
                  <div className="h-6 bg-gray-700 rounded-md w-3/6 animate-pulse"></div>
               </>
            )}
         </div>

         {/* Main Content */}
         <div className="flex flex-col w-full md:w-3/4 space-y-4">
            {/* Video Player */}
            <YTEmbedTemplate videoID={videoID} />

            {/* Bottom Tabs */}
            <Tabs defaultValue="index" value={activeTab} onValueChange={setActiveTab}>
               <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="summary">AI Summary</TabsTrigger>
               </TabsList>
               
               <TabsContent value="index" className="bg-gray-800 rounded-md p-4 text-white">
                  <h2 className="text-xl font-bold">Video Content Index</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                     {videoIndex?.length > 0 ? (
                        videoIndex.map((topic, index) => (
                           <div 
                              key={index} 
                              className="border border-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-700"
                              onClick={() => handleSeek(topic.subtopics[0]?.start || 0)}
                           >
                              <h3 className="font-medium">{topic.topic}</h3>
                              <ul className="mt-2 text-sm text-gray-300">
                                 {topic.subtopics?.slice(0, 3).map((subtopic, idx) => (
                                    <li 
                                       key={idx}
                                       className="hover:text-blue-400"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleSeek(subtopic.start);
                                       }}
                                    >
                                       • {subtopic.name} ({formatTimestamp(subtopic.start)})
                                    </li>
                                 ))}
                                 {topic.subtopics?.length > 3 && (
                                    <li>• ... and {topic.subtopics.length - 3} more</li>
                                 )}
                              </ul>
                           </div>
                        ))
                     ) : (
                        <p>Loading video index...</p>
                     )}
                  </div>
               </TabsContent>
               
               <TabsContent value="summary" className="bg-gray-800 rounded-md p-4 text-white">
                  {aiSummary ? (
                     <div>
                        <h2 className="text-xl font-bold">AI Generated Summary</h2>
                        <div className="mt-4 prose prose-invert whitespace-pre-wrap">
                           {aiSummary}
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-32">
                        <p>Loading summary...</p>
                     </div>
                  )}
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
};

// Helper function to format seconds as MM:SS
function formatTimestamp(seconds) {
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);
   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default SkeletionLoader;