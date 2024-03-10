import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function AreaDetail() {
  const [area, setArea] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchAreaDetail();
  }, [id]);

  const fetchAreaDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/areas/${id}`);
      setArea(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching area detail:", error);
      setLoading(false);
    }
  };

  const renderAgeRatios = () => {
    return (
      <div>
        <h3 className="text-xl font-bold mb-2">Age Ratio</h3>
        {Object.entries(area.ageRatio).map(([ageGroup, ratios]) => (
          <div key={ageGroup} className="mb-4">
            <h4 className="text-lg font-bold mb-2">{ageGroup} Age Group</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm">Male:</p>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">
                    {ratios.male || 0}
                  </span>
                  <span className="text-sm text-gray-500">percentage</span>
                </div>
              </div>
              <div>
                <p className="text-sm">Female:</p>
                <div className="flex items-center">
                  <span className="text-lg font-bold mr-1">
                    {ratios.female || 0}
                  </span>
                  <span className="text-sm text-gray-500">percentage</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Area Detail</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">{area.name}</h2>
          <p>Topographic Info: {area.topographicInfo || "N/A"}</p>
          <p>Demographic Data: {area.demographicData || "N/A"}</p>
          <p>Population: {area.population || 0}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>{renderAgeRatios()}</div>

            <div>
              <h3 className="text-xl font-bold mb-2">Gender Ratio</h3>
              <p>Male: {area.genderRatio?.male || 0}</p>
              <p>Female: {area.genderRatio?.female || 0}</p>
              <p>Other: {area.genderRatio?.other || 0}</p>
            </div>
          </div>

          <p>Market Trend: {area.marketTrend || "N/A"}</p>

          {area.location?.coordinates && (
            <div className="mt-4" style={{ height: "60vh", width: "100%" }}>
              <MapContainer
                center={[
                  area.location.coordinates[1],
                  area.location.coordinates[0],
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[
                    area.location.coordinates[1],
                    area.location.coordinates[0],
                  ]}
                >
                  <Popup>{area.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AreaDetail;