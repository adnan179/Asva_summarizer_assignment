import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Summarizer = ({ textInput }) => {
  const [words, setWords] = useState(50);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const [summary, setSummary] = useState("");
  const [content, SetContent] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const username = localStorage.getItem("userName");
        if (username) {
          const response = await axios.get(
            `http://localhost:4000/api/history/${username}`
          );
          setHistory(response.data);
        } else {
          toast.error("Username not found in local storage");
        }
      } catch (error) {
        toast.error("Error fetching history data!");
      }
    };
    fetchHistory();
  }, []);

  function generateAccurateSummary(text, numWords) {
    const words = text.split(/\s+/);

    if (!words || numWords >= words.length) {
      return text;
    }
    const selectedWords = words.slice(0, numWords);

    const summary = selectedWords.join(" ");

    return summary;
  }

  //function to handle submit
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generatedSummary = generateAccurateSummary(content, words);
      setSummary(generatedSummary);

      const username = localStorage.getItem("userName");
      if (username) {
        // Send the summary to the backend
        await axios.post(`http://localhost:4000/api/history/add/${username}`, {
          historyContent: summary,
        });
      }

      // Fetch the updated history
      const historyResponse = await axios.get(
        `http://localhost:4000/api/history/${username}`
      );
      setHistory(historyResponse.data);
    } catch (err) {
      toast.error("Error generating summary");
      console.log("Error generating summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLengthChange = (e) => {
    setWords(e.target.value);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("AI-generated Summary", 10, 10);
    doc.autoTable({
      startY: 20,
      theme: "striped",
      head: [["Summary"]],
      body: [[summary]],
    });
    doc.save("summary.pdf");
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleTextSubmit} className="flex-col flex gap-5">
        <div className="flex md:flex-row flex-col text-white font-medium mt-5 md:gap-5 gap-3">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-gray-300 font-medium md:text-xl text-sm">
              Summary Length (number of words):
            </h2>
            <select
              value={words}
              onChange={handleLengthChange}
              className="px-4 py-2 text-black outline-none rounded-md"
            >
              <option value="25">very short</option>
              <option value="50">Short</option>
              <option value="75">Medium</option>
              <option value="100">Normal</option>
              <option value="125">Large</option>
            </select>
          </div>
          <div className="flex flex-row gap-3">
            <button
              className="flex justify-center items-center w-[150px] px-4 py-2 bg-gray-900 shadow-md text-[#b4b4b4] rounded font-medium hover:scale-105 transition ease-in-out duration-30"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
              ) : (
                "Summarize..."
              )}
            </button>
            <button
              disabled={!summary}
              type="button"
              onClick={handleExportPDF}
              className="flex justify-center items-center w-[150px] px-4 py-2 bg-gray-900 shadow-md text-[#b4b4b4] rounded font-medium hover:scale-105 transition ease-in-out duration-30"
            >
              Export as PDF
            </button>
          </div>
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

      {/* Display history data */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-300 mb-3">History:</h2>
        <div className="flex flex-row gap-3 overflow-x-scroll custom-scrollbar">
          {history.map((historyItem, index) =>
            historyItem.historyContent ? (
              <div
                onClick={() => SetContent(historyItem.historyContent)}
                key={index}
                className="gap-3 bg-gray-600 rounded-lg shadow min-w-[300px] h-[300px] p-5 overflow-y-auto cursor-pointer hidden-scrollbar"
              >
                <p className="text-white/90 text-sm font-bold">
                  {new Date(historyItem.date).toLocaleString()}
                </p>
                <p className="text-gray-900 font-medium">
                  {historyItem.historyContent}
                </p>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
