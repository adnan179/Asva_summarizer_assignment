import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const Scraper = ({ setTextInput }) => {
  const [urlInput, setUrlInput] = useState("");
  const [scrapedContent, setScrapedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrapeOption, setScrapeOption] = useState("full");

  const cleanContent = (doc) => {
    // Remove scripts and styles
    const scripts = doc.querySelectorAll("script, style");
    scripts.forEach((script) => script.remove());

    // Remove unnecessary elements like nav, footer, and ads
    const unnecessaryElements = doc.querySelectorAll(
      "nav, footer, .ad, .advertisement"
    );
    unnecessaryElements.forEach((el) => el.remove());

    return doc;
  };

  const detectMainContent = (doc) => {
    // This is a naive approach. For better results, you might use libraries like Readability.js
    const mainContent = doc.querySelector(
      "main, article, .main-content, .article-body"
    );
    return mainContent ? mainContent.innerText : doc.body.innerText;
  };

  const handleUrlSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const proxyUrl = "http://localhost:4000/proxy?url=";
      const response = await axios.get(proxyUrl + encodeURIComponent(urlInput));
      const parser = new DOMParser();
      let doc = parser.parseFromString(response.data, "text/html");

      doc = cleanContent(doc);

      let textContent;
      if (scrapeOption === "full") {
        textContent = doc.body.innerText;
      } else {
        textContent = detectMainContent(doc);
      }

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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(scrapedContent).then(
      () => {
        toast.success("Copied!");
      },
      (err) => {
        toast.error("Failed to copy!");
        console.error("Failed to copy text to clipboard:", err);
      }
    );
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
          placeholder="Enter the URL to scrape..."
          onChange={(e) => setUrlInput(e.target.value)}
          className="px-4 py-2 rounded-md text-white bg-gray-700 outline-none font-medium"
        />
        <select
          value={scrapeOption}
          onChange={(e) => setScrapeOption(e.target.value)}
          className="px-4 py-2 rounded-md text-white bg-gray-700 outline-none font-medium"
        >
          <option value="full">Full Page</option>
          <option value="main">Main Content</option>
        </select>
        <button
          className="flex justify-center items-center w-[150px] px-4 py-2 bg-white text-gray-600 rounded font-medium hover:scale-105 transition ease-in-out duration-30"
          type="submit"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600 "></div>
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
            onChange={(e) => setScrapedContent(e.target.value)}
            rows={10}
            cols={80}
            className="rounded-md outline-none shadow-md shadow-gray-600 bg-gray-600 text-white p-5"
          />
          <button
            onClick={handleCopyToClipboard}
            className="flex justify-center items-center w-[200px] px-4 py-2 bg-gray-700 text-gray-300 rounded-3xl font-medium hover:scale-105 transition ease-in-out duration-300"
          >
            copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Scraper;
