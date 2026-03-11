import {
  MessagesSquare,
  Trash2Icon,
  User,
  UserCheck,
  UserPlus,
  UserRoundPen,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ActionConfirmPopup from "../components/ActionConfirmPopup";
import {
  acceptConnectionRequest,
  fetchConnectionsData,
  rejectConnectionRequest,
  removeConnection,
} from "../api/connectionsService";
import Loading from "../components/Loading";
import ErrorComponent from "../components/ErrorComponent";
import {
  fetchProfileDetails,
  removeFollower,
  unFollowUser,
} from "../api/profileService";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addUser } from "../store/userSlice";

const Connections = () => {
  const navigate = useNavigate();
  const [currTab, setCurrTab] = useState("Followers");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connectionsData, setConnectionsData] = useState(null);
  const [error, setError] = useState(false);
  const loggedInUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getConnectionsData = async () => {
    setError(false);
    try {
      const resp = await fetchConnectionsData();
      setConnectionsData(resp.data);
    } catch (error) {
      setTimeout(() => {
        setError(true);
      }, 1000);
    }
  };

  useEffect(() => {
    getConnectionsData();
  }, [loggedInUser]);

  const handleRemoveClick = (userToRemove) => {
    setSelectedUser(userToRemove);
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = async () => {
    // Call remove follower API here with selectedUserId
    try {
      let resp = null;
      if (currTab === "Followers")
        resp = await removeFollower(selectedUser._id);
      else if (currTab === "Pending")
        resp = await rejectConnectionRequest(selectedUser._id);
      else if (currTab === "Connections")
        resp = await removeConnection(selectedUser._id);

      if (!resp) {
        setShowConfirmModal(false);
        return;
      }

      if (resp.data.success) {
        toast.success(resp.data.message);
        //after removing the follower get new user details and update in store.
        const profileDetailsResp = await fetchProfileDetails(loggedInUser._id);
        dispatch(addUser(profileDetailsResp.data?.profile));
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
      else toast.error(error.customMessage);
    }
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const handleUnfollowUser = async (userId) => {
    try {
      const resp = await unFollowUser(userId);
      if (resp.data.success) {
        toast.success(resp.data.message);
        //after Unfollowing the user get new user details and update in store.
        const profileDetailsResp = await fetchProfileDetails(loggedInUser._id);
        dispatch(addUser(profileDetailsResp.data?.profile));
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
      else toast.error(error.customMessage);
    }
  };
  const handleAcceptConnecion = async (userId) => {
    try {
      const resp = await acceptConnectionRequest(userId);
      if (resp.data.success) {
        toast.success(resp.data.message);
        //after Unfollowing the user get new user details and update in store.
        const profileDetailsResp = await fetchProfileDetails(loggedInUser._id);
        dispatch(addUser(profileDetailsResp.data?.profile));
      } else {
        toast.error(resp.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
      else toast.error(error.customMessage);
    }
  };
  if (error) return <ErrorComponent onRetry={getConnectionsData} />;

  if (!connectionsData) return <Loading />;

  const dataArray = [
    { lable: "Followers", value: connectionsData.followers, icon: User },
    { lable: "Following", value: connectionsData.following, icon: UserCheck },
    {
      lable: "Pending",
      value: connectionsData.pendingConnections,
      icon: UserRoundPen,
    },
    {
      lable: "Connections",
      value: connectionsData.connections,
      icon: UserPlus,
    },
  ];
  return (
    <div className="h-full overflow-y-scroll no-scrollbar bg-slate-100 dark:bg-slate-800 ">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Connections
          </h1>
          <p className="text-gray-600 dark:text-slate-400 ">
            Manage your network and discover new connections
          </p>
        </div>

        {/* Counts */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 shadow rounded-md"
            >
              <b className="text-slate-800 dark:text-slate-100 ">
                {item.value?.length}
              </b>
              <p className="text-slate-600 dark:text-slate-400 ">
                {item.lable}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="inline-flex flex-wrap items-center border border-gray-300 dark:border-gray-700 rounded-md p-1 bg-white dark:bg-slate-900 shadow-sm">
          {dataArray.map((tab, index) => (
            <button
              onClick={() => setCurrTab(tab.lable)}
              key={tab.lable}
              className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors cursor-pointer
                ${currTab === tab.lable ? "bg-white dark:bg-slate-900 font-medium text-black dark:text-slate-100" : "text-gray-500 hover:text-black dark:hover:text-slate-100"}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="ml-1">{tab.lable}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Connections */}
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.lable === currTab)
            .value.map((user) => (
              <div
                key={user?._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white dark:bg-slate-900 shadow rounded-md  hover:scale-105 transition duration-300 ease-in-out"
              >
                <img
                  src={user?.profile_picture}
                  className="rounded-full w-12 h-12 shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {user?.full_name}
                  </p>
                  <p className="text-gray-500">@{user?.username}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {user?.bio ? user.bio.slice(0, 30) + "..." : ""}
                  </p>

                  {/* Actions */}
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                      active: scale-95 transition text-white cursor-pointer"
                      >
                        View Profile
                      </button>
                    }
                    {currTab === "Followers" && (
                      <button
                        onClick={() => handleRemoveClick(user)}
                        className="w-full sm:w-1/3 p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 text-black active: scale-95 transition cursor-pointer hover:bg-red-400"
                      >
                        <Trash2Icon className="w-5 h-5 mx-auto " />
                      </button>
                    )}
                    {currTab === "Following" && (
                      <button
                        onClick={() => handleUnfollowUser(user._id)}
                        className="w-full p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 hover:bg-slate-200 text-black
                      active: scale-95 transition cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}
                    {currTab === "Pending" && (
                      <div className="flex gap-1">
                        <button
                        onClick={()=>handleAcceptConnecion(user._id)}
                          className="w-full p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 hover:bg-green-400 text-black
                      active: scale-95 transition cursor-pointer"
                        >
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => handleRemoveClick(user)}
                          className="w-full p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 text-black active: scale-95 transition cursor-pointer hover:bg-red-400"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {currTab === "Connections" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/messages/${user._id}`)}
                          className="w-full p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 hover:bg-slate-200 text-slate-800 flex justify-center items-center gap-1
                      active: scale-95 transition cursor-pointer"
                        >
                          <MessagesSquare className="w-4 h-4" />
                          Message
                        </button>

                        <button
                          onClick={() => handleRemoveClick(user)}
                          className="w-full p-2 text-sm rounded bg-slate-100 dark:bg-slate-300 text-black active: scale-95 transition cursor-pointer hover:bg-red-400"
                        >
                          <Trash2Icon className="w-5 h-5 mx-auto " />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <>
          {currTab === "Followers" && (
            <ActionConfirmPopup
              actionType={"removeFollower"}
              username={selectedUser.username}
              onCancel={handleCancel}
              onConfirm={handleConfirmRemove}
            />
          )}
          {currTab === "Pending" && (
            <ActionConfirmPopup
              actionType={"rejectRequest"}
              username={selectedUser.username}
              onCancel={handleCancel}
              onConfirm={handleConfirmRemove}
            />
          )}
          {currTab === "Connections" && (
            <ActionConfirmPopup
              actionType={"removeConnection"}
              username={selectedUser.username}
              onCancel={handleCancel}
              onConfirm={handleConfirmRemove}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Connections;
