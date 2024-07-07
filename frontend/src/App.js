import React, { useState, useEffect } from "react";
import Scraper from "./components/Scraper";
import Summarizer from "./components/Summarizer";
import Auth from "./components/Auth";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [user, setUser] = useState(null);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(true);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <div>
      {user ? (
        <div className="flex flex-col w-full min-h-screen lg:p-24 md:p-16 p-10 bg-gray-950 md:gap-10 gap-5">
          <div className="flex md:flex-row flex-col gap-3 w-full justify-between">
            <h1 className="text-[#b4b4b4] lg:text-3xl md:text-2xl text-[20px] font-bold">
              AI-Powered Content Summarizer Dashboard
            </h1>
            <button
              className="bg-gray-900 px-4 py-2 rounded-md text-gray-600 font-medium md:text-lg text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <Scraper setTextInput={setTextInput} />
          <Summarizer textInput={textInput} />
        </div>
      ) : (
        <Auth />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
