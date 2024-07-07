import React, { useState } from "react";
import axios from "axios";

const Scraper = ({ setTextInput }) => {
  const [urlInput, setUrlInput] = useState("");
  const [scrapedContent, setScrapedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUrlSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const proxyUrl = "http://localhost:4000/proxy?url=";
      const response = await axios.get(proxyUrl + encodeURIComponent(urlInput));
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, "text/html");
      const paragraphs = doc.querySelectorAll("p");
      let textContent = Array.from(paragraphs)
        .map((p) => p.textContent)
        .join(" ");

      // Remove unnecessary spaces
      textContent = textContent.replace(/\s+/g, " ").trim();
      setScrapedContent(textContent);
      setTextInput(textContent);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching the URL or extracting content.");
      console.error("Error fetching URL:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form
        onSubmit={handleUrlSubmit}
        className="flex flex-col md:flex-row lg:gap-5 gap-3"
      >
        <input
          type="text"
          value={urlInput}
          placeholder="Enter the URl to scrape..."
          onChange={(e) => setUrlInput(e.target.value)}
          className="px-4 py-2 rounded-md text-white bg-gray-700 outline-none font-medium"
        />
        <button
          className="flex justify-center items-center w-[150px] px-4 py-2 bg-white text-gray-600 rounded font-medium"
          type="submit"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600"></div>
          ) : (
            "Scrape URL..."
          )}
        </button>
      </form>

      {error && <p className="font-medium text-red-600">{error}</p>}

      {scrapedContent && (
        <div className="flex w-full flex-col gap-5 mt-3">
          <h3 className="text-gray-600 text-xl font-bold">
            Preview of Scraped Content:
          </h3>
          <textarea
            value={scrapedContent}
            readOnly
            rows={10}
            cols={10}
            className="rounded-md outline-none shadow-md shadow-gray-600 bg-gray-600 text-white p-5"
          />
        </div>
      )}
    </div>
  );
};

export default Scraper;
