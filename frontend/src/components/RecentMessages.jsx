import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import moment from "moment";
import { fetchRecentMessagesAPI } from "../api/messagesService";
import { Minus, Plus } from "lucide-react";
import socket from "../utils/socketConfig";
import { useSelector } from "react-redux";

const RecentMessages = () => {
  const [messagesData, setMessagesData] = useState([]);
  const [showUnreadMsgs, setShowUnreadMsgs] = useState(true);
  const loggedInUser = useSelector((state) => state.user);
  const roomId = "user_" + loggedInUser._id;
  const fetchRecentMessages = async () => {
    try {
      const resp = await fetchRecentMessagesAPI();
      if (resp.data?.success) {
        setMessagesData(resp.data?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    socket.on("new_msg_notify", (newMsg) => {
      if (
        newMsg.from_user_id !== loggedInUser._id
      )
        fetchRecentMessages();
    });

    fetchRecentMessages();
    return () => {
      socket.off("new_msg_notify");
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <div className="font-semibold text-slate-800 dark:text-slate-100 mb-4 text-[15px] flex justify-between mx-5">
        <h3>Unread Messages</h3>
        <button
          onClick={() => setShowUnreadMsgs(!showUnreadMsgs)}
          className="cursor-pointer"
        >
          {showUnreadMsgs ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>
      <hr className="border-gray-300 dark:border-gray-700 mb-2" />
      {showUnreadMsgs && (
        <div className={`flex flex-col  max-h-60 overflow-y-scroll scrollbar `}>
          {messagesData.map((data, indx) => (
            <Link
              to={`/messages/${data?.from_user_id?._id}`}
              key={indx}
              className="flex items-center gap-2.5 py-3 px-2 hover:rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <img
                src={data?.from_user_id?.profile_picture}
                className="w-8 h-8 rounded-full"
              />

              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {data?.from_user_id?.full_name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {moment(data.last_unread_msg?.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-slate-400">
                    {data.last_unread_msg?.text
                      ? data.last_unread_msg?.text
                      : "Media"}
                  </p>

                  {!data.last_unread_msg?.seen && (
                    <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[11px]">
                      {data.cnt_unread_msgs}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentMessages;
