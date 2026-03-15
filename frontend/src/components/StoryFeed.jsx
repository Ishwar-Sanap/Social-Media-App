import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import { Plus } from "lucide-react";
import StoryModal from "./StoryModal";
import { getStories } from "../api/storyService";
import StoryViewer from "./StoryViewer";

const StoryFeed = () => {
  const [storiesData, setStoriesData] = useState(null);
  const [viewer, setViewer] = useState(null); // { userIdx }
  const [showModal, setShowModal] = useState(false);

  const fetchStories = async () => {
    try {
      const resp = await getStories();
      if (resp?.data?.success) {
        setStoriesData(resp.data?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const users = storiesData ?? [];

  return (
    <>
      <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
        <div className="flex gap-3 py-2">
          {/* Add story Card */}
          <div
            onClick={() => setShowModal(true)}
            className="p-1 bg-transparent cursor-pointer pt-1.5"
          >
            <div className="h-22 w-22 px-3 gap-1 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 transition-transform duration-200 hover:scale-105">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 text-center">
                Create Story
              </p>
              <div className="size-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {users.map((user, idx) => (
            <StoryCard
              key={user._id}
              user={user}
              onClick={() => setViewer({ userIdx: idx })}
            />
          ))}
        </div>
      </div>

      {viewer && (
        <StoryViewer
          users={users}
          initialUserIdx={viewer.userIdx}
          onClose={() => setViewer(null)}
        />
      )}

      {/* Add Story Modal */}
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
      )}
    </>
  );
};

export default StoryFeed;
