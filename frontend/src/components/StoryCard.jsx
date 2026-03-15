import React, { useState } from "react";

const StoryCard = ({ user, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-1 justify-around group flex flex-col items-center gap-1 cursor-pointer border-none bg-transparent"
    >
      <div className="rounded-full bg-linear-to-tr from-pink-500 via-purple-500 to-emerald-400 p-0.5 transition-transform duration-200  group-hover:scale-105 ">
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-gray-200">
          <img
            src={user.profile_picture}
            alt={user.username}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <span className="w-20 truncate text-center text-xs text-gray-500">
        {user.username}
      </span>
    </button>
  );
};

export default StoryCard;
