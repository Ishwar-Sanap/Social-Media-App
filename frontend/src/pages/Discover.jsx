import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import { discoverProfileDetails } from "../api/profileService";
import { toast } from "react-hot-toast";
const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  
  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        const resp = await discoverProfileDetails(input);
        setUsers(resp.data?.data);
        setLoading(false);
      } catch (error) {
        toast.error(error.message)
        setError(true);
      }
    }
  };
  return (
    <div className="h-full overflow-y-scroll no-scrollbar bg-slate-100 dark:bg-slate-800 ">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600 dark:text-slate-400 ">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/*Search Peoples */}
        <div className="mb-6 shadow-md rounded-md border border-slate-200/60 bg-white/80 dark:bg-slate-900/60 dark:border-0">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name, username or location ... "
                className="text-slate-800 dark:text-slate-100 pl-10 sm:pl-12 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md max-sm:text-sm"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Users Cards */}
        {loading ? (
          <Loading height={"50vh"} />
        ) : (
          users && (
            <div className="flex flex-wrap gap-6">
              {users.map((user) => (
                <UserCard user={user} key={user._id} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Discover;
