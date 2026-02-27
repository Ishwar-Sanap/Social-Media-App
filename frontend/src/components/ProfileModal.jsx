import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Pencil, X } from "lucide-react";

const ProfileModal = ({ setShowEdit }) => {
  const user = dummyUserData;
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  });

  const handleSaveForm = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-xl sm:py-6 mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Edit Profile
            </h1>

            <button
              className="w-5 h-5 mx-3 hover:scale-120 cursor-pointer text-slate-800 dark:text-slate-100"
              onClick={() => setShowEdit(false)}
            >
              <X size={25} />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSaveForm}>
            <div className="flex justify-between bg-slate-100 dark:bg-black/30 p-2 rounded-xl">
              {/* Profile Picture */}
              <div className="flex flex-col items-start gap-3">
                <label
                  htmlFor="profile_picture"
                  className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1"
                >
                  Profile Picture
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    id="profile_picture"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg"
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        profile_picture: e.target.files[0],
                      })
                    }
                  />
                  {/* Show Uploaded Image */}
                  <div className="group/profile relative">
                    <img
                      src={
                        editForm.profile_picture
                          ? URL.createObjectURL(editForm.profile_picture)
                          : user.profile_picture
                      }
                      className="w-24 h-24 rounded-full object-cover mt-2"
                    />

                    <div
                      className="absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 
                  rounded-full items-center justify-center cursor-pointer"
                    >
                      <Pencil className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </label>
              </div>

              {/* Cover photo */}
              <div className="flex flex-col items-start gap-3">
                <label
                  htmlFor="cover_photo"
                  className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1"
                >
                  Cover Photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    id="cover_photo"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        cover_photo: e.target.files[0],
                      })
                    }
                  />
                  {/* Show uploaded image */}
                  <div className="group/cover relative">
                    <img
                      src={
                        editForm.cover_photo
                          ? URL.createObjectURL(editForm.cover_photo)
                          : user.cover_photo
                      }
                      className="w-80 h-40 rounded-lg object-cover mt-2"
                    />

                    <div
                      className="absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 
                  rounded-lg items-center justify-center cursor-pointer"
                    >
                      <Pencil className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </label>
              </div>
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-slate-50"
                placeholder="Please enter your full name"
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                value={editForm.full_name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg  text-black dark:text-slate-50"
                placeholder="Please enter a username"
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                value={editForm.username}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg  text-black dark:text-slate-50"
                placeholder="Please enter bio"
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                value={editForm.bio}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg  text-black dark:text-slate-50"
                placeholder="Please enter your location"
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                value={editForm.location}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowEdit(false)}
                type="button"
                className="px-4 py-2 rounded-lg border  border-gray-300 dark:border-gray-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg
              hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
