import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/search?query=${searchQuery}&latitude=${latitude}&longitude=${longitude}`
      );
      const data = response.data;
      setRecommendations(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleVisit = (id) => {
    navigate(`/area/${id}`);
  };

  const handleInputChange = async (value) => {
    try {
      if (value.trim() === "") {
        setSuggestions([]);
      } else {
        const response = await axios.get(
          `http://localhost:3000/api/search-suggestions?query=${value}`
        );
        const data = response.data;
        setSuggestions(data);
      }
      setShowResults(false);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    handleInputChange(searchQuery);
  }, [searchQuery]);

  return (
    <div className="main min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-blue-500">
          VIT Bhopal Area Frontend
        </h1>
        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="Search by area name"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleInputChange(e.target.value);
            }}
            className="search-input px-4 py-2 w-full border rounded focus:outline-none mb-2"
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="search-input px-4 py-2 w-full border rounded focus:outline-none  mb-2"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="search-input px-4 py-2 w-full border rounded focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="search-button mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
          >
            Search
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-container mb-4">
            <h3 className="text-lg font-semibold mb-2">Suggestions:</h3>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="suggestion px-4 py-2 mb-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded"
                onClick={() => {
                  setSearchQuery(suggestion.name);
                  handleSearch();
                }}
              >
                {suggestion.name}
              </div>
            ))}
          </div>
        )}

        {showResults && (
          <div className="search-results-container">
            {recommendations.length > 0 ? (
              <>
                <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
                {recommendations.map((result) => (
                  <div
                    key={result.id}
                    className="card px-4 py-2 mb-2 bg-white border border-gray-300 cursor-pointer hover:border-blue-500 rounded"
                    onClick={() => handleVisit(result.id)}
                  >
                    <h2 className="text-xl font-semibold">{result.name}</h2>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
