import React, { useEffect, useState } from "react";
import { assets, dummyUserData } from "../assets/assets";
import { Link, useNavigate } from "react-router";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const user = useSelector((state)=> state.user);

  const handleToggleTheme = () => {
    document.body.classList.toggle("dark");
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };
  return (
    <div
      className={`w-60 xl:w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 
            ${sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        <img
          src={assets.logo}
          className="w-26 ml-7 my-2 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <hr className="border-gray-300 dark:border-gray-700 mb-8" />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <button
          onClick={handleToggleTheme}
          className="mt-6 mx-6  active:scale-95 transition  cursor-pointer"
        >
          <div className="px-3.5 py-2 flex justify-center items-center gap-3 text-gray-600 dark:text-slate-400  font-medium">
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            <span>Swith to {theme === "light" ? "dark" : "light"}</span>
          </div>
        </button>
        <Link
          to={"/create-post"}
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 
          hover:from-indio-700 hover:to-indigo-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="w-full border-t border-gray-300 dark:border-gray-700 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <img src={user.profile_picture} className="w-10 rounded-full" />
          <div className="">
            <h1 className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.full_name}</h1>
            <p className="text-xs text-gray-500 ">@{user.username}</p>
          </div>
        </div>
        <LogOut className="w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer" />
      </div>
    </div>
  );
};

export default Sidebar;
