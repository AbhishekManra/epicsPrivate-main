import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AiApp = () => {
  const API_KEY = "AIzaSyBEaIEJVfxKe9hOHeD1MSnNsbZoODHqsg0";

  const [data, setData] = useState(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGeminiProAPI() {
    try {
      
      if (!inputText) {
        alert("Please enter text!");
        return;
      }
      setLoading(true);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(inputText);
      const text = result.response.text();
      setLoading(false);
      setData(text);
    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error: ", error);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          AI App
        </h1>
        <input
          type="text"
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter text..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-center space-x-4">
          <button
            disabled={loading}
            onClick={() => fetchDataFromGeminiProAPI()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? "Loading..." : "Get "}
          </button>
        </div>
        <hr className="my-4" />
        <div className="text-gray-700 text-center">Response: {data}</div>
      </div>
    </div>
  );
};

export default AiApp;
