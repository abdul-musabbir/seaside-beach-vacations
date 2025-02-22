import { Play, X } from "lucide-react";
import { useState } from "react";

interface VideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

function VideoPopups({ isOpen, onClose, videoId }: VideoPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
        </button>
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function VideoPopup({ videoLink }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="">
      <div className="text-center">
        <button
          onClick={() => setIsVideoOpen(true)}
          className="group bg-white hover:bg-indigo-50 w-10 justify-center h-10 rounded-full shadow-lg 
                   transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <Play className="w-6 h-6 text-indigo-600" />
        </button>

        <VideoPopups
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoId={videoLink ? videoLink : ""}
        />
      </div>
    </div>
  );
}

export default VideoPopup;
