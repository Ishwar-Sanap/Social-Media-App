import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { fetchFeedData } from "../api/userPostsService";
import ErrorComponent from "../components/ErrorComponent";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/feedPostsSlice";
import StoryFeed from "../components/StoryFeed";
import socket from "../utils/socketConfig";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state.feedPosts.posts);
  const loggedInUser = useSelector((state) => state.user);
  const roomId = "user_" + loggedInUser._id;
  const getFeedData = async () => {
    setError(false);
    setLoading(true);
    try {
      const resp = await fetchFeedData();
      dispatch(setPosts(resp.data?.posts));
      setLoading(false);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setError(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if (socket.connected) {
      socket.emit("join_user_room", roomId);
    } else {
      socket.connect();
      socket.on("connect", () => socket.emit("join_user_room", roomId)); // when socket is connected then only emits the event
    }
    getFeedData();

    return () => {
      socket.off("connect");
    };
  }, []);

  if (error) return <ErrorComponent onRetry={getFeedData} />;

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and post list */}
      <div>
        <StoryFeed />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="max-xl:hidden sticky top-0 w-1/4 flex flex-col justify-end h-[95vh]">
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
