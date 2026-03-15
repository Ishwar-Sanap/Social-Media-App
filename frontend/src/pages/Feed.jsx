import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { fetchFeedData } from "../api/userPostsService";
import ErrorComponent from "../components/ErrorComponent";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../store/feedPostsSlice";
import StoryFeed from "../components/StoryFeed";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state.feedPosts.posts);

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
    getFeedData();
  }, []);

  if (error) return <ErrorComponent onRetry={getFeedData} />;

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and post list */}
      <div>
        <StoryFeed/> 
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white dark:bg-slate-900 text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 dark:text-slate-100 font-semibold">
            Sponsored
          </h3>
          <img src={assets.sponsored_img} className="w-75 h-50 rounded-md" />
          <p className="text-slate-600 dark:text-slate-200"> Email marketing</p>
          <p className="text-slate-400 dark:text-slate-400">
            Supercharge your marketing with powerful, easy-to-use platform built
            for results.
          </p>
        </div>

        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
