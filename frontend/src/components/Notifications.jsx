import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Notifications = ({ t, message }) => {
  const navigate = useNavigate();
  console.log(message);

  const getTextToDisplay = () => {
    if (message?.text) {
      if (message.text.length > 25) return message.text.slice(0, 30) + " ...";
      return message.text;
    } else {
      return "Media";
    }
  };
  return (
    <div
      className={
        "max-w-sm w-full bg-white dark:bg-slate-900 shadow-lg rounded-1g flex border border-gray-300 dark:border-gray-700 hover:scale-105 transition"
      }
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <img
            src={message?.from_user?.profile_picture}
            alt=""
            className="h-10 w-10 rounded-full shrink-0 mt-0.5"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {message?.from_user?.full_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {getTextToDisplay()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex border-l border-gray-300 dark:border-gray-700">
        <button
          onClick={() => {
            navigate(`/messages/${message.from_user_id}`);
            toast.dismiss(t.id);
          }}
          className="p-4 text-indigo-600 font-semibold cursor-pointer"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default Notifications;
