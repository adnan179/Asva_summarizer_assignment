import React, { useRef, useState } from "react";
import axios from "axios";
import jwt_decode from "jsonwebtoken";

const Summarizer = ({ textInput }) => {
  const [summaryLength, setSummaryLength] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);
  const [summary, setSummary] = useState("");
  const [content, SetContent] = useState(textInput || "");
  const [history, setHistory] = useState([]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formdata = new FormData();
    formdata.append("key", "bc185ed5d3cee91ed5ffb77462b3c8c2");
    formdata.append("txt", textInput);
    formdata.append("sentences", summaryLength);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://api.meaningcloud.com/summarization-1.0",
        requestOptions
      );
      const result = await response.json();
      setSummary(result.summary);

      // Get the token from local storage
      const token = localStorage.getItem("token");
      const decoded = jwt_decode(token);
      const username = decoded.user.id;

      // Send the summary to the backend
      await axios.post("http://localhost:4000/api/history/add", {
        username,
        content: result.summary,
      });

      // Fetch the updated history
      const historyResponse = await axios.get(
        `http://localhost:4000/api/history/${username}`
      );
      setHistory(historyResponse.data);
    } catch (err) {
      setError("Error generating summary.");
      console.log("Error generating summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLengthChange = (e) => {
    setSummaryLength(e.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleTextSubmit} className="flex-col flex gap-5">
        <div className="flex md:flex-row flex-col text-white font-medium mt-5 md:gap-5 gap-3">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-gray-300 font-medium md:text-xl text-sm">
              Summary Length (number of sentences):
            </h2>
            <select
              value={summaryLength}
              onChange={handleLengthChange}
              className="px-4 py-2 text-black outline-none rounded-md"
            >
              <option value="3">very short</option>
              <option value="5">Short</option>
              <option value="7">Medium</option>
              <option value="10">Normal</option>
              <option value="20">Large</option>
            </select>
          </div>

          <button
            className="flex justify-center items-center w-[150px] px-4 py-2 bg-gray-900 shadow-md text-[#b4b4b4] rounded font-medium"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
            ) : (
              "Summarize..."
            )}
          </button>
        </div>
        <div className="flex md:flex-row flex-col w-full lg:gap-3 gap-2">
          <div className="flex flex-col gap-2 md:w-1/2 w-full">
            <label className="text-gray-400">Text input:</label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => SetContent(e.target.value)}
              rows={10}
              cols={80}
              className="rounded-md outline-none focus:ring-1 focus:ring-gray-300 bg-gray-600 p-5 font-medium"
              placeholder="Enter text to summarize..."
            />
          </div>
          <div className="flex flex-col gap-2 md:w-1/2 w-full">
            <label className="text-gray-400">AI-generated Summary:</label>
            <textarea
              readOnly
              value={summary ? summary : ""}
              rows={10}
              cols={80}
              className="rounded-md outline-none bg-gray-600 text-gray-400 p-5 font-medium"
            />
          </div>
        </div>
      </form>
      {error && <p className="font-medium text-red-600">{error}</p>}

      {/* Display history data */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-300 mb-3">History:</h2>
        {history.map((historyItem, index) => (
          <div key={index} className="mb-2">
            <p className="text-gray-400">{historyItem.inputContent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summarizer;
