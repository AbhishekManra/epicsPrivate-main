import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AreaDetail from "../../frontend/src/components/AreaDetail";
import Map from "./components/Map";
import Aiapp from "./components/Aiapp";
import Testai from "./components/Testai";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/area/:id" element={<AreaDetail />} />
        <Route path="/map" element={<Map />} />
        <Route path="/ai" element={<Aiapp />} />
        <Route path="/test" element={<Testai />} />
      </Routes>
    </Router>
  );
}

export default App;
