import { useNavigate } from "react-router-dom";

function ErrorComponent({ message = "Something went wrong", onRetry }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 shadow-lg rounded-xl p-6 text-center border border-gray-300 dark:border-gray-700">
        <div className="flex justify-center mb-5">
          <div className="bg-red-100 text-red-500 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 
                1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 
                0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
          Failed to load data
        </h2>

        <p className="text-gray-600 dark:text-slate-400 text-sm mb-6">
          {message || "We couldn't fetch the requested data. Please try again."}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 
          hover:from-indio-700 hover:to-indigo-800 active:scale-95 transition cursor-pointer "
            >
              Retry
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-gray-700  rounded-lg  transition cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorComponent;
