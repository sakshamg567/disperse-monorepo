import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 overflow-hidden">
      <div className="flex flex-col justify-center items-center w-full max-w-4xl px-4">
        <div className="mb-6 w-full flex flex-col items-center justify-center -mt-36">
          <img src="/logo.svg" alt="LOGO" className="scale-125" />
          <p className="text-white z-10 text-center -mt-5 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">Turn <span className="font-instrument italic">long and boring</span> YouTube videos into smart study notes <span className="font-instrument italic">quick, easy,</span> and <span className="font-instrument italic">AI-powered</span>.</p>
        </div>

        <div
          className={`flex items-center border border-gray-600 transition-all duration-300 transform origin-center w-full max-w-[90vw] h-9 ${
            isExpanded
              ? "sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] px-3 py-2 bg-transparent border-none"
              : "max-w-[200px] sm:max-w-[250px] md:max-w-[280px] px-4 py-2 bg-white rounded-4xl"
          }`}
          onClick={() => setIsExpanded(true)}
        >
          {isExpanded ? (
            <Input
              type="text"
              autoFocus
              placeholder="Enter YouTube link..."
              className="w-full text-white bg-transparent outline-none"
              onBlur={() => setIsExpanded(false)}
            />
          ) : (
            <Button className="w-full font-mono text-black text-sm bg-transparent border-none hover:bg-white hover:cursor-pointer h-7">
              Try Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
