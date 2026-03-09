import React, { useEffect } from "react";
import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "./api/profileService";
import { addUser } from "./store/userSlice";

const App = () => {
  const dispatch = useDispatch();
  //User details will be there in store when logged in
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await getProfile();
        dispatch(addUser(resp.data?.user));
      } catch (error) {
        // console.log(error.message);
      }
    };

    fetchProfile();
  }, []);

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
