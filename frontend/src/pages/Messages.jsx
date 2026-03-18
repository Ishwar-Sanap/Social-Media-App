import React, { useEffect, useState } from "react";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";
import { fetchConnectionsData } from "../api/connectionsService";

const Messages = () => {
  const navigate = useNavigate();
  const [connectionsData, setConnectinosData] = useState([]);

  useEffect(() => {
    const getConnectinosData = async () => {
      try {
        const resp = await fetchConnectionsData();
        if (resp.data.success) {
          setConnectinosData(resp.data?.connections)
        }
      } catch (error) {
        console.log(error.response)
      }
    };
    getConnectinosData();
  }, []);
  return (
    <div className="h-full overflow-y-scroll no-scrollbar relative bg-slate-100 dark:bg-slate-800">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100  mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-slate-400 ">
            Talk to your friends and family
          </p>
        </div>

        {/* Connected users */}
        <div className="flex flex-col gap-3">
          {connectionsData.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-wrap gap-5 p-6 bg-white dark:bg-slate-900 shadow-md rounded-lg 
              hover:scale-105 transition duration-300 ease-in-out"
            >
              <img
                src={user.profile_picture}
                className="rounded-full size-12 mx-auto"
              />

              <div className="flex-1">
                <p className="font-medium text-slate-800 dark:text-slate-100">
                  {user.full_name}
                </p>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {user.bio}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 
                active: scale-95 transition cursor-pointer gap-1"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 
                active: scale-95 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
