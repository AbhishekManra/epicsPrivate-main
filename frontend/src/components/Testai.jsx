import React, { useState,useEffect } from "react";
import MyMap from "./newmapcomponent";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
// const fs = require('fs')

const Testai = () => {
  const [generatedText, setGeneratedText] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingConvert, setLoadingConvert] = useState(false);
  const [jsonEditorVisible, setJsonEditorVisible] = useState(false);
  const [editedJson, setEditedJson] = useState("");

  // const storeInCSV = (fileName, newData)=>{
  //   //take the generated text and save it in the csv file
  //   fs.readFile(fileName, 'utf8', (err, data) => {
  //     if (err) {
  //       console.error('Error reading file:', err);
  //       return;
  //     }
  
  //     // Parse the existing CSV content into an array of rows
  //     const rows = data.split('\n').map(row => row.trim());
  
  //     // Convert the JSON data into an array representing the new row
  //     const newDataRow = [
  //       newData.name,
  //       newData.topographicInfo,
  //       newData.demographicData,
  //       newData.population,
  //       newData.ageRatio["0-14"].male,
  //       newData.ageRatio["0-14"].female,
  //       newData.ageRatio["15-24"].male,
  //       newData.ageRatio["15-24"].female,
  //       newData.ageRatio["25-54"].male,
  //       newData.ageRatio["25-54"].female,
  //       newData.ageRatio["55+"].male,
  //       newData.ageRatio["55+"].female,
  //       newData.genderRatio.male,
  //       newData.genderRatio.female,
  //       newData.genderRatio.other,
  //       newData.marketTrend,
  //       newData.location.coordinates.join(','),
  //       newData.location.address
  //     ];
  
  //     // Add the new row to the array
  //     rows.push(newDataRow.join(','));
  
  //     // Join the rows back into a CSV-formatted string
  //     const newCSVContent = rows.join('\n');
  
  //     // Write the updated CSV content back to the file
  //     fs.writeFile(fileName, newCSVContent, 'utf8', (err) => {
  //       if (err) {
  //         console.error('Error writing file:', err);
  //       } else {
  //         console.log('Row added successfully.');
  //       }
  //     });
  //   });
  // }

  const fetchData = async () => {
    setLoadingGenerate(true);

    const genAI = new GoogleGenerativeAI(
      "AIzaSyBEaIEJVfxKe9hOHeD1MSnNsbZoODHqsg0"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `from the given ${longitude} longitude, ${latitude} latitude, and ${placeName} {
      const areaSchema = new mongoose.Schema({
        name: String,
        topographicInfo: String,
        demographicData: String,
        population: Number,
        ageRatio: {
          "0-14": {
            male: Number,
            female: Number,
          },
          "15-24": {
            male: Number,
            female: Number,
          },
          "25-54": {
            male: Number,
            female: Number,
          },
          "55+": {
            male: Number,
            female: Number,
          },
        },
        genderRatio: {
          male: Number,
          female: Number,
          other: Number,
        },
        marketTrend: String,
        location: {
          type: { type: String, default: "Point" },
          coordinates: [Number],
          address: String,
        }
      }); generate json data for this mongo model with real coordinate information also reaplce place name with real place name `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      setGeneratedText(generatedText);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleConvertToJsonClick = async() => {
    setLoadingConvert(true);
    setJsonEditorVisible(true);
    const cleanedJsonString = generatedText.replace(/^```json|```$/g, '');
    setEditedJson(cleanedJsonString);
    setLoadingConvert(false);
  };

  const handlePostButtonClick = async () => {
    setLoadingConvert(true);
  
    try {
      if (!editedJson) {
        console.error("Generated text is empty. Please generate data first.");
        return;
      }
  
      console.log("editedJson:", editedJson); // Log the value before parsing
  
      const response = await axios.post(
        "http://localhost:3000/api/areas/",
        JSON.parse(editedJson),
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Post response:", response);
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setLoadingConvert(false);
    }
  };
  const position = [51.505, -0.09]

  useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://apis.mappls.com/advancedmaps/api/4579d7f113a70e14a8c0cb1b79860a45/map_sdk?layer=vector&v=3.0&callback=initMap1';
        script.defer = true;
        script.async = true;

        window.initMap1 = () => {
            var map = new mappls.Map('map', { center: [28.638698386592438, 77.27604556863412] });
            map.addListener('load', function() {
              var options = {
                  fillColor: "red",
                  lineGap: 10,
                  strokeOpacity: 1.0
              }
              mappls.draw({
                  map: map,
                  type: 'polygon',
                  callback: draw_callback,
                  options: options
              });
          });

          function draw_callback(data) {
            console.log(data);
            console.log(data.map.coordinates);
          // setLongitude(data.features[0].geometry.coordinates[0][0]);
          // setLatitude(data.features[0].geometry.coordinates[0][1]);
          // const coordinates = [data.features[0].geometry.coordinates[0][1], data.features[0].geometry.coordinates[0][0]]
          // const geoAddress = mappls.reverseGeocode({coordinates: coordinates})
          // const placeName = geoAddress.results[0].addressParts.countryName ? geoAddress.results[0].addressParts.countryName : geoAddress.results[0].addressParts.locality
          // setPlaceName(placeName);

          }
        }

        document.head.appendChild(script);

        return () => {
            // Clean up function to remove the script when the component unmounts
              document.head.removeChild(script);
              delete window.initMap1;
        };
    }, []);



  return (
    <>
       <div className="container mx-auto p-4">
      <div className="bg-gray-200 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Data</h2>
        <div className="mb-4">
          <div className="text-xl mb-2">{generatedText}</div>
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-2"
          />
          <input
            type="text"
            placeholder="Place Name"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="p-2 border border-gray-300 rounded ml-2"
          />
          <button
            onClick={fetchData}
            className={`p-2 bg-blue-500 text-white rounded ml-2 ${
              loadingGenerate ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingGenerate}
          >
            Generate Data
          </button>
          <button
            onClick={handleConvertToJsonClick}
            className={`p-2 bg-green-500 text-white rounded ml-2 ${
              loadingConvert ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loadingConvert}
          >
            Convert to JSON
          </button>
          {jsonEditorVisible && (
            <button
            onClick={() => setJsonEditorVisible(false)}
            className="p-2 bg-gray-500 text-white rounded ml-2"
            >
              Hide JSON Editor
            </button>
          )}
        </div>       
        {jsonEditorVisible && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">JSON Editor</h2>
            <textarea
              value={editedJson}
              onChange={(e) => setEditedJson(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
              />
            <button
              onClick={handlePostButtonClick}
              className={`mt-2 p-2 bg-purple-500 text-white rounded ${
                loadingConvert ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loadingConvert}
              >
              Post Data
            </button>
          </div>
        )}
      </div>
        <div id="map" style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}></div>
    </div>
    </>
  );
};

export default Testai;

