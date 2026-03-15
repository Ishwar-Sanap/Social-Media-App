import { X } from "lucide-react";
import React from "react";

const PostImageViewModal = ({ imageURL, setImageModal }) => {
  return (
    <div className="fixed inset-0 z-110 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
      <button
        onClick={() => setImageModal(false)}
        className="absolute cursor-pointer top-5 right-5 bg-white/10 hover:bg-white/20 transition rounded-full p-2"
      >
        <X className="w-6 h-6 text-white " />
      </button>

      <div className="relative max-w-6xl w-full flex items-center justify-center">
        <img
          src={imageURL}
          alt="Post"
          className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default PostImageViewModal;
