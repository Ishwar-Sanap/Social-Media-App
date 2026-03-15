import { X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const STORY_DURATION = 10000; // 10 sec

const StoryViewer = ({ users, initialUserIdx, onClose }) => {
  const [userIdx, setUserIdx] = useState(initialUserIdx);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const user = users[userIdx];
  const story = user.stories[storyIdx];

  const goNext = () => {
    if (storyIdx < user.stories.length - 1) {
      setStoryIdx((i) => i + 1); // next story
    } else if (userIdx < users.length - 1) {
      setUserIdx((i) => i + 1); // next user
      setStoryIdx(0); // first story
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1); // prev story
    } else if (userIdx > 0) {
      setUserIdx((i) => i - 1); // prev user
      setStoryIdx(users[userIdx - 1].stories.length - 1); // go to prev user last story
    }
  };


  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now(); // return timestamp in ms
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= STORY_DURATION) goNext();
    }, 60);
    return () => clearInterval(timerRef.current);
  }, [userIdx, storyIdx]);

  const renderContent = () => {
    switch (story.media_type) {
      case "image":
        return (
          <img src={story.media_url} className="h-full w-full object-cover" />
        );

      case "video":
        return (
          <video
            onEnded={() => onClose()}
            src={story.media_url}
            className="h-full w-full object-cover"
            autoPlay
          />
        );
      case "text":
        return (
          <div className="flex h-full w-full items-center justify-center  p-8">
            <p className="text-center text-2xl font-medium leading-snug text-white">
              {story.content}
            </p>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()} //  prevents an event from bubbling up the DOM tree, stopping parent elements from receiving the event
        className="relative overflow-hidden rounded-2xl "
        style={{
          width: "min(400px, 92vw)",
          aspectRatio: "9/16",
          maxHeight: "90vh",
          backgroundColor:
            story.media_type === "text"
              ? (story.background_color ?? "#000000")
              : "#000000",
        }}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
          {user.stories.map((_, i) => (
            <div
              key={i}
              className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full rounded-full bg-white transition-none"
                style={{
                  width:
                    i < storyIdx
                      ? "100%"
                      : i === storyIdx
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="justify-between absolute top-6 left-0 right-0 z-10 flex items-center gap-2.5 px-3 py-2">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/60 cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">@{user.username}</p>
              <p className="text-xs text-white/60">
                {moment(story.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className=" rounded-full p-2 text-lg leading-none text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story content */}
        <div className="relative flex h-full w-full items-center justify-center">
          {renderContent()}
        </div>

        {/* Tap nav zones */}
        <div
          onClick={goPrev}
          className="absolute inset-y-0 top-23 left-0 z-10 w-2/5 cursor-pointer"
        />
        <div
          onClick={goNext}
          className="absolute inset-y-0 top-23 right-0 z-10 w-2/5 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default StoryViewer;
