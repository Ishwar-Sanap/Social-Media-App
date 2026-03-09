import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { loginUser, signupUser } from "../api/userAuthService";
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { isValidEmail } from "../utils/inputValidations";

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    //Handle Login
    if (showLoginForm) {
      async function loginTheUser() {
        try {
          let res = null;
          if (isValidEmail(email)) {
            res = await loginUser({ email, password });
          } else {
            res = await loginUser({ username: email, password });
          }
          dispatch(addUser(res.data?.user));
        } catch (err) {
          setErrorMsg(err.response.data?.message);
        }
      }

      loginTheUser();
    } else {
      //Handle Signup
      const username = formData.get("userName");
      const full_name = formData.get("fullName");

      async function signupNewUser() {
        try {
          const res = await signupUser({
            full_name,
            username,
            email,
            password,
          });
          dispatch(addUser(res.data?.user));
        } catch (err) {
          setErrorMsg(err.response.data?.message);
        }
      }

      signupNewUser();
    }
  };

  const handleChange = (e) => {
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Background Image */}
      <img
        src={assets.bgImage}
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover dark:bg-black/90"
      />

      {/* Left Side : Branding */}
      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40 ">
        <img src={assets.logo} className="h-12 object-contain" />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            <img src={assets.group_users} className="h-8 md:h-10" />
            <div>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <p className="text-slate-800 dark:text-slate-100 ">
                Used by 1,000+ developers
              </p>
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-linear-to-r from-indigo-950 to-indigo-800 dark:text-slate-300 bg-clip-text text-transparent">
            More than just friends truly connect
          </h1>
          <p className="text-xl  md:text-3xl text-indigo-900 dark:text-slate-400 max-w-72 md:max-w-md">
            connect with global community on MyCircle
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>

      {/* Right side: Login or Signup form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <form
          onChange={handleChange}
          onSubmit={handleSubmit}
          className="flex flex-col bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full max-w-sm gap-2"
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">
            {showLoginForm ? "Login" : "Signup"}
          </h2>

          {!showLoginForm && (
            <>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Full name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                required
                name="fullName"
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition mb-2"
              />
            </>
          )}

          {!showLoginForm && (
            <>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                required
                name="userName"
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition mb-2"
              />
            </>
          )}

          {showLoginForm ? (
            <>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Email / Username
              </label>
              <input
                type="text"
                placeholder="Enter email or Username"
                name="email"
                required
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition mb-2"
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter email"
                name="email"
                required
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition mb-2"
              />
            </>
          )}

          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            name="password"
            required
            autoComplete=""
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition mb-4"
          />

          {/* Show Error Message */}
          {errorMsg && <p className="text-red-500">Error : {errorMsg}</p>}
          <button
            type="submit"
            className="py-2.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indio-700 hover:to-indigo-800 active:scale-95 transition text-white cursor-pointer shadow-md"
          >
            {showLoginForm ? "Login" : "Signup"}
          </button>

          {showLoginForm ? (
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account ?{" "}
              <span
                className="text-indigo-500 border-b font-bold cursor-pointer"
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                Signup{" "}
              </span>
            </p>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account ?{" "}
              <span
                className="text-indigo-500 border-b font-bold cursor-pointer"
                onClick={() => setShowLoginForm(!showLoginForm)}
              >
                login{" "}
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
