import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "./api/profileService";
import { addUser } from "./store/userSlice";
import socket from "./utils/socketConfig";
import Notifications from "./components/Notifications";
import { fetchRecentMessagesAPI } from "./api/messagesService";
import { addMessages } from "./store/recentMessagesSlice";

const App = () => {
  const dispatch = useDispatch();
  //User details will be there in store when logged in
  const user = useSelector((state) => state.user);
  const roomId = user ? "user_" + user._id : null;
  const { pathname } = useLocation();
  const pathNameRef = useRef(pathname);

  const fetchRecentMessages = async () => {
    try {
      const resp = await fetchRecentMessagesAPI();
      if (resp.data?.success) {
        dispatch(addMessages(resp.data?.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  useEffect(() => {
    if (roomId) {
      if (socket.connected) {
        socket.emit("join_user_room", roomId);
      } else {
        socket.connect();
        socket.on("connect", () => socket.emit("join_user_room", roomId)); // when socket is connected then only emits the event
      }
      socket.on("new_msg_notify", (newMsg) => {
        if (newMsg.from_user_id !== user._id) {
          if (pathNameRef.current !== `/messages/${newMsg.from_user_id}`) {
            toast.custom((t) => <Notifications t={t} message={newMsg} />, {
              position: "bottom-right",
              duration: 4000,
            });
          }
          //Call the api to fetch Recent messages and add it in store.
          fetchRecentMessages();
        }
      });
    }

    const fetchProfile = async () => {
      try {
        const resp = await getProfile();
        dispatch(addUser(resp.data?.user));
      } catch (error) {
        // console.log(error.message);
      }
    };

    fetchProfile();
    return () => {
      if (roomId) {
        socket.off("connect");
        socket.off("new_msg_notify");
        // socket.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    pathNameRef.current = pathname;
  }, [pathname]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={user ? <Layout /> : <Login />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
