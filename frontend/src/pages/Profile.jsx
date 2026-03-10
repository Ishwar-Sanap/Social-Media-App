import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";
import { fetchProfileDetails } from "../api/profileService";
import { useSelector } from "react-redux";
import ErrorComponent from "../components/ErrorComponent";

const Profile = () => {
  const { profileId } = useParams();
  const [userFromResponse, setUserFromResponse] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(null);
  const [error, setError] = useState(false);
  const loggedInUser = useSelector((state) => state.user);

  const toggleDropDown = (id) => {
    setOpenDropDown(openDropDown === id ? null : id);
  };
  const getUserProfileDetails = async () => {
    try {
      const resp = await fetchProfileDetails(
        profileId ? profileId : loggedInUser._id,
      );

      if (profileId) setUserFromResponse(resp.data?.profile);

      setPosts(resp.data?.posts);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    getUserProfileDetails();
  }, []);

  if (error)
    return (
      <ErrorComponent
        message={"User profile deatils not found !!"}
        onRetry={getUserProfileDetails}
      />
    );

  const user = userFromResponse || loggedInUser;

  return user ? (
    <div className="h-full overflow-y-scroll no-scrollbar bg-slate-100 dark:bg-slate-800 ">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900  rounded-b-2xl shadow-sm overflow-hidden">
          {/* Cover Photo */}
          <div className="h-40 md:h-50 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user?.cover_photo && (
              <img
                src={user?.cover_photo}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6 mb-6 ">
          <div className="bg-white dark:bg-slate-900  rounded-xl shadow-lg p-1 flex max-w-md mx-auto">
            {["posts", "media", "likes"].map((tab) => (
              <button
                onClick={() => setActiveTab(tab)}
                key={tab}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer 
                  ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-slate-200"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Displying the data based on active tab */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={{ ...post, user: user }}
                  profileId={profileId}
                  displyOnProfile={true}
                  isOpen={openDropDown === post._id}
                  onToggle={() => toggleDropDown(post._id)}
                />
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 max-w-6xl ">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <div key={post._id}>
                    {post.image_urls.map((image, indx) => (
                      <Link
                        target="_blank"
                        to={image}
                        key={indx}
                        className="relative group"
                      >
                        <img
                          src={image}
                          key={indx}
                          className="w-60 aspect-video object-cover mr-1 mt-1 rounded-sm"
                        />
                        <p
                          className="absolute bottom-0 right-1 text-xs p-1 px-3 
                            backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300"
                        >
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
