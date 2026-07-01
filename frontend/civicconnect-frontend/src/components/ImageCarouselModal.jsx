import { useState } from "react";

const ImageCarouselModal = ({ images, startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);

  if (!images || images.length === 0) return null;

  const prev = () =>
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[current]}
          alt="Issue"
          className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
        />

        {/* Left arrow */}
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2
                       text-white text-4xl font-bold hover:scale-110"
          >
            ‹
          </button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2
                       text-white text-4xl font-bold hover:scale-110"
          >
            ›
          </button>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 right-4 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;
