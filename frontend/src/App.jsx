import { useState} from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import SkeletionLoader from "./components/ui/SkeletonLoader";
import axios from "axios"; // Add axios for API calls
function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoIndex, setVideoIndex] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}([&?].+)?$/;
    
    if (youtubeRegex.test(url)) {
      const extractedVideoId = extractVideoId(url);
      setIsLoading(true);
      setVideoId(extractedVideoId);
      
      try {
        // Updated endpoint and response handling
        const BACKEND_URL = "https://disperse-monorepo-production.up.railway.app";
        const response = await axios.post(`${BACKEND_URL}/api/analysis/process`, {
          videoURL: url
        });
        
        if (response.data.status === "success") {
          setVideoIndex(response.data.data.index);
          setAiSummary(response.data.data.summary);
        } else {
          throw new Error(response.data.error || "Failed to process video");
        }
      } catch (err) {
        console.error("Error processing video:", err);
        setError(err.response?.data?.error || "Failed to process video. Please try again.");
        setIsLoading(false);
        setVideoId("");
      }
    } else {
      setError("Please enter a valid YouTube URL");
    }
  };
  
  // Function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    // Handle youtube.com URLs
    let match = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    // Handle youtu.be URLs
    match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    // Handle other potential formats with v= parameter
    match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    
    return null;
  };



  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 overflow-hidden">
      {isLoading ? (
        <SkeletionLoader 
          videoID={videoId} 
          videoIndex={videoIndex}
          aiSummary={aiSummary}
        />
      ) : (
        <div className="flex flex-col justify-center items-center w-full max-w-4xl px-4">
          <div className="mb-6 w-full flex flex-col items-center justify-center -mt-36">
            <img src="/logo.svg" alt="LOGO" className="scale-125" />
            <p className="text-white z-10 text-center -mt-5 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Turn <span className="font-instrument italic">long and boring</span> YouTube videos into smart study notes <span className="font-instrument italic">quick, easy,</span> and <span className="font-instrument italic">AI-powered</span>.</p>
          </div>

          <div
            className={`flex items-center border border-gray-600 transition-all duration-300 transform origin-center w-full max-w-[90vw] h-9 ${isExpanded
                ? "sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] px-3 py-2 bg-transparent border-none"
                : "max-w-[200px] sm:max-w-[250px] md:max-w-[280px] px-4 py-2 bg-white rounded-4xl"
              }`}
            onClick={() => setIsExpanded(true)}
          >
            {isExpanded ? (
              <form onSubmit={handleSubmit} className="w-full">
                <Input
                  type="text"
                  autoFocus
                  placeholder="Enter YouTube link..."
                  className="w-full text-white bg-transparent outline-none"
                  onBlur={(e) => {
                    // Only collapse if clicking outside and not on a child element
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setIsExpanded(false);
                    }
                  }}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </form>
            ) : (
              <Button className="w-full font-mono text-black text-sm bg-transparent border-none hover:bg-white hover:cursor-pointer h-7">
                Try Now
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;