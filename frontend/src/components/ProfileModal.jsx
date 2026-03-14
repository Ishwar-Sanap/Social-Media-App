import React, { useEffect, useState } from "react";
import { dummyUserData } from "../assets/assets";
import { Pencil, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { saveProfileDetails } from "../api/profileService";
import toast from "react-hot-toast";
import { addUser } from "../store/userSlice";
import { isValidUserName } from "../utils/inputValidations";

const ProfileModal = ({ setShowEdit }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
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

    const tostId = toast.loading("Saving changes...");
    const updatedData = {};

    if (editForm.username.trim() !== user.username) {
      if (!isValidUserName(editForm.username))
      {
        setError("Error : Username is not valid");
        toast.dismiss(tostId)
        return;
      }
      updatedData.username = editForm.username;
    }

    if (editForm.full_name.trim() !== user.full_name)
      updatedData.full_name = editForm.full_name;

    if (editForm.bio.trim() !== user.bio) updatedData.bio = editForm.bio;

    if (editForm.location.trim() !== user.location)
      updatedData.location = editForm.location;

    if (editForm.profile_picture)
      updatedData.profile_picture = editForm.profile_picture;

    if (editForm.cover_photo) updatedData.cover_photo = editForm.cover_photo;

    if (Object.keys(updatedData).length === 0) {
      toast.error("Please edit at least one field", { id: tostId });
      return;
    }

    try {
      const formData = new FormData();

      Object.keys(updatedData).forEach((key) => {
        formData.append(key, updatedData[key]);
      });

      const resp = await saveProfileDetails(formData);

      dispatch(addUser(resp.data?.user));

      setTimeout(() => {
        toast.success("Profile details updated!", { id: tostId });
        setShowEdit(false);
      }, [1000]);
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error.response?.data?.message);
      toast.error("Failed to save data!", { id: tostId });
    }
  };

  useEffect(() => {
    setError("");
  }, [editForm]);

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
                required
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
                  setEditForm({
                    ...editForm,
                    username: e.target.value.toLowerCase(),
                  })
                }
                value={editForm.username}
                required
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
            {error.length !== 0 && <p className="text-red-400">{error}</p>}
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
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
