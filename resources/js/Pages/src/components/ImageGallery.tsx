import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Image {
  url: string;
  alt: string;
}

export default function ImageGallery({ images }: { images: Image[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Handle next image
  const handleNext = useCallback(() => {
    setSelectedImage((prev) =>
      prev === null ? 0 : (prev + 1) % images.length
    );
  }, [images.length]);

  // Handle previous image
  const handlePrevious = useCallback(() => {
    setSelectedImage((prev) =>
      prev === null
        ? images.length - 1
        : (prev - 1 + images.length) % images.length
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handleNext, handlePrevious]);

  return (
    <div>
      {/* Gallery View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setSelectedImage(index)} // Open image in slider on click
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-110 group-hover:brightness-90"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Image Slider (when an image is clicked) */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImage(null); // Close slider when clicking outside the image
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)} // Close gallery
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-10"
              aria-label="Close gallery"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={handlePrevious}
              className="absolute left-2 sm:left-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[90vh]">
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt}
                className="object-contain w-full h-full max-h-[90vh] animate-fadeIn"
                loading="eager"
              />
              <p className="absolute bottom-0 left-0 right-0 text-center text-white/80 py-2 sm:py-4 bg-gradient-to-t from-black/50 to-transparent text-sm sm:text-base">
                {images[selectedImage].alt}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
