import {
  BadgeCheck,
  Ellipsis,
  Heart,
  MessageCircle,
  Share2,
  X,
} from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router";
import { useRef } from "react";
import { useEffect } from "react";
import ActionConfirmPopup from "./ActionConfirmPopup";
const PostCard = ({ post, profileId, displyOnProfile, isOpen, onToggle }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600 dark:text-indigo-400"> $1  </span>',
  );
  //Example
  //post.content -->  This is a sample paragraph with some #hashtags like #socialmedia and #marketing. Let's find them!
  // postWithHashtags --> This is a sample paragraph with some <span class="text-indigo-600"> #hashtags  </span> like <span class="text-indigo-600"> #socialmedia  </span> and <span class="text-indigo-600"> #marketing  </span>. Let's find them!

  const [likes, setLikes] = useState(post.likes_count);
  const[showConfirmModal, setShowConfirmModal] = useState(false);

  const currentUser = dummyUserData;
  const navigate = useNavigate();

  const handleConfirmRemove = () => {
    // Call remove Post API here to remove post._id
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    onToggle();
  };

  const handleLike = async () => {};
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User Info */}
      <div className="flex justify-between relative">
        {/* User Detils */}
        <div
          onClick={() => navigate(`/profile/${post.user._id}`)}
          className="inline-flex items-center gap-3 cursor-pointer"
        >
          <img
            src={post.user?.profile_picture}
            className="w-10 h-10 rounded-full shadow"
          />
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-slate-800 dark:text-slate-100">
                {post.user?.full_name}
              </span>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-gray-500 text-sm">
              @{post.user?.username} . {moment(post.createdAt).fromNow()}{" "}
            </div>
          </div>
        </div>

        {/* When PostCard is loaded from Profile page and user is loogedIn user then only show Remove post option*/}
        {/* {displyOnProfile && post.user._id === currentUser._id && <div>Remove</div>} TODO - use when actual data is there */}
        {/*For Dummy data only, It will be remove later */}

        {displyOnProfile && !profileId && (
          <div className="relative">
            <div
              className="w-5 h-8 flex justify-center items-center hover:cursor-pointer"
              onClick={onToggle}
            >
              {isOpen ? (
                <X className="text-gray-400" />
              ) : (
                <Ellipsis className="text-gray-400" />
              )}
            </div>
            {isOpen && (
              <div className="absolute top-7 right-0  bg-white dark:bg-slate-800 shadow-lg rounded p-1 z-10 min-w-25  ">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="hover:bg-gray-100 dark:hover:bg-slate-700 px-1 py-1 rounded  text-sm text-red-500 cursor-pointer"
                >
                  Remove Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <div
          className="text-slate-800 dark:text-slate-100 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }} // This allows rendering HTML tags (like <b>, <a>, etc.) from the content, not just text.
        />
      )}

      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((imgUrl, indx) => (
          <img
            src={imgUrl}
            key={indx}
            className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && "col-span-2 h-auto"}`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 dark:text-slate-400 text-sm pt-2 border-t border-gray-300 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            } `}
            onClick={handleLike}
          />
          <span>{likes.length}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className={`w-4 h-4 cursor-pointer`} />
          <span>{12}</span>
        </div>

        <div className="flex items-center gap-1">
          <Share2 className={`w-4 h-4 cursor-pointer`} />
          <span>{12}</span>
        </div>
      </div>

      {showConfirmModal && (
        <ActionConfirmPopup
          actionType={"removePost"}
          onCancel={handleCancel}
          onConfirm={handleConfirmRemove}
        />
      )}
    </div>
  );
};

export default PostCard;
