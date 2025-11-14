import { useState } from "react";

export default function VideoCard({ videoUrl, thumbnailUrl }) {
  const [play, setPlay] = useState(false);

  const embedUrl = videoUrl.includes("watch?v=")
    ? videoUrl.replace("watch?v=", "embed/")
    : videoUrl;

  return (
    <div className="w-full max-w-xs">
      {play ? (
        <iframe
          src={`${embedUrl}?autoplay=1`}
          className="w-full aspect-video rounded-lg"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Self-service help video"
        />
      ) : (
        <div onClick={() => setPlay(true)} className="relative cursor-pointer">
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="w-full rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
              <div className="ml-1 border-l-8 border-y-4 border-l-white border-y-transparent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
