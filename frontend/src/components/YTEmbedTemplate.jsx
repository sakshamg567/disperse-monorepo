import { useState, useEffect, useRef } from 'react';

const YTEmbedTemplate = ({ videoID }) => {
   const [player, setPlayer] = useState(null);
   const playerRef = useRef(null);
   
   // Initialize YouTube iframe API
   useEffect(() => {
      // Create a script element for the YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      // Get the first script tag and insert before it
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Define the onYouTubeIframeAPIReady function
      window.onYouTubeIframeAPIReady = () => {
         // Only create player if videoID exists
         if (videoID) {
            createPlayer(videoID);
         }
      };

      // Cleanup function
      return () => {
         if (player) {
            player.destroy();
         }
      };
   }, [videoID]);

   // Function to create the player
   const createPlayer = (id) => {
      const newPlayer = new window.YT.Player('youtube-player', {
         videoId: id,
         playerVars: {
            'playsinline': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
         },
         events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
         }
      });
      
      setPlayer(newPlayer);
      playerRef.current = newPlayer;
   };

   // Player event handlers
   const onPlayerReady = (event) => {
      console.log('Player ready');
   };

   const onPlayerStateChange = (event) => {
      console.log('Player state changed');
   };

   // Method to seek to a specific time
   window.seekToTime = (seconds) => {
      if (playerRef.current) {
         playerRef.current.seekTo(seconds, true);
         playerRef.current.playVideo();
      }
   };

   return (
      <div className="relative w-full aspect-video">
         <div id="youtube-player" className="w-full h-full rounded-xl border-2 border-gray-500"></div>
      </div>
   );
};

export default YTEmbedTemplate;