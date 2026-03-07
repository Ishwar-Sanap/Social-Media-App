import React from "react";

const ActionConfirmPopup = ({ actionType, username, onCancel, onConfirm }) => {
  const messages = {
    removePost: "Are you sure you want to remove this post?",
    removeFollower: (
      <>
        Are you sure you want to remove{" "}
        <span className="font-semibold text-red-500">{username}</span> from
        followers?
      </>
    ),
    rejectRequest: (
      <>
        Are you sure you want to reject pending connection request from{" "}
        <span className="font-semibold text-red-500">{username}</span>?
      </>
    ),
    removeConnection: (
      <>
        Are you sure you want to remove connection with{" "}
        <span className="font-semibold text-red-500">{username}</span>?
      </>
    ),
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl max-w-sm w-full">
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {messages[actionType]}
          <br /> This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmPopup;
