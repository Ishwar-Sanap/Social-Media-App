import React, { useEffect, useRef, useState } from "react";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizonal } from "lucide-react";
import moment from "moment";
import socket from "../utils/socketConfig.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchProfileDetails } from "../api/profileService.js";
import ErrorComponent from "../components/ErrorComponent.jsx";
import toast from "react-hot-toast";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const { userId } = useParams();
  const loggedInUser = useSelector((state) => state.user);

  const roomId = [loggedInUser._id, userId].sort().join("_");
  const sendMessage = async () => {
    const messageData = {
      _id: "6878cc3217a54e4d3747845",
      from_user_id: loggedInUser._id,
      to_user_id: userId,
      text,
      roomId,
      message_type: "text",
      createdAt: new Date(),
      updatedAt: "2025-07-25T10:43:50.346Z",
      seen: false,
    };
    socket.emit("send_msg", messageData);
    setMessages((prev) => [...prev, messageData]);
    setText("");
    setImage(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getUserDetails = async () => {
    try {
      const resp = await fetchProfileDetails(userId);
      if (resp.data?.success) {
        setUser(resp.data.profile);
      }
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };
  useEffect(() => {
    getUserDetails();
    socket.emit("join_room", roomId);
    socket.on("recv_msg", (newMsg) => setMessages((prev) => [...prev, newMsg]));
    return () => {
      socket.off("recv_msg");
    };
  }, []);

  if (!user) {
    return (
      <ErrorComponent
        message={"User details not found"}
        onRetry={getUserDetails}
      />
    );
  }
  return (
    user && (
      <div className="flex flex-col h-screen  bg-slate-100 dark:bg-slate-800 ">
        {/* user Details */}
        <div
          className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-white dark:bg-slate-900
           border-b border-gray-300 dark:border-gray-700 "
        >
          <img src={user.profile_picture} className="size-8 rounded-full" />
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {user.full_name}
            </p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>

        {/* Message content */}
        <div className="p-5 md:px-10 h-full overflow-y-scroll">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, indx) => (
                <div
                  key={indx}
                  className={`flex flex-col ${message.to_user_id !== user._id ? "items-start" : " items-end"} `}
                >
                  {/* Date */}
                  <div className="relative group inline-block">
                    <p className="text-gray-500 dark:text-slate-400 text-xs cursor-pointer pb-0.5">
                      {moment(message.createdAt).format("DD MMM, hh:mm A")}
                    </p>
                    {/* Tooltip */}
                    <p className="absolute hidden shadow-md group-hover:block text-gray-700 text-xs p-1 z-10  bg-slate-100">
                      {moment(message.createdAt).format(
                        "dddd, DD MMMM YYYY, hh:mm A",
                      )}
                    </p>
                  </div>

                  {/* Message */}
                  <div
                    className={`p-2 text-sm max-w-sm   text-slate-800 dark:text-slate-100 rounded-lg shadow 
                      ${message.to_user_id !== user._id ? "rounded-bl-none bg-gray-100 dark:bg-gray-600" : " rounded-br-none bg-sky-100 dark:bg-slate-900"}`}
                  >
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        className="w-full max-w-sm rounded-lg mb-1"
                      />
                    )}
                    <p className="text-slate-800 dark:text-slate-100">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Send Message */}
        <div className="px-4">
          <div
            className="flex items-center gap-3 pl-5 p-1.5 bg-white dark:bg-slate-900 w-full max-w-xl mx-auto
          border border-gray-300 dark:border-gray-700 shadow rounded-full mb-5 "
          >
            <input
              type="text"
              className="flex-1 outline-none text-slate-800 dark:text-slate-100"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <label htmlFor="image">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  className="h-8 rounded-md"
                />
              ) : (
                <ImageIcon className="size-7 text-gray-400 cursor-pointer" />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            <button
              onClick={sendMessage}
              className="bg-linear-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-indigo-800
            active:scale-95 cursor-pointer text-white p-2 rounded-full "
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
