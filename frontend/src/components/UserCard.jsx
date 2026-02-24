import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import React from "react";
import { dummyUserData } from "../assets/assets";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;
  return (
    <div
      key={user._id}
      className="bg-white dark:bg-slate-900 p-4 pt-6 flex flex-col justify-between w-full shadow
       border border-gray-300 dark:border-gray-700 rounded-xl  md:w-72"
    >
      {/* User Details */}
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 dark:text-slate-400 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>

      {/* Location and followers */}
      <div className="flex justify-center items-center gap-2 mt-4 text-xs text-gray-600 dark:text-slate-400">
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <MapPin className="w-4 h-4" /> {user.location}
        </div>
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{user.followers.length}</span> Followers
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex mt-4 gap-2">
        {/* Follow button */}
        <button
          disabled={currentUser?.following.includes(user._id)}
          className="w-1/2 py-2 rounded-md flex items-center justify-center gap-2  bg-linear-to-r from-indigo-500 to-purple-600 
          hover:from-indio-700 hover:to-indigo-800 active:scale-95 transition text-white cursor-pointer "
        >
          <UserPlus className="w-4 h-4" />
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>

        {/* Connection request button */}

        <button className="flex items-center justify-center w-1/2 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition ">
          {currentUser?.connections.includes(user._id) ? (
             <span className="flex gap-3 text-sm"> <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" /> Chat</span>
          ) : (
           <span className="flex text-sm"><Plus className="w-5 h-5 group-hover:scale-110 transition" /> Send Request  </span>  
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
