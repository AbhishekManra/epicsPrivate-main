const express = require("express");
const router = express.Router();
const Area = require("../models/model.area.js");

router.get("/areas", async (req, res) => {
  try {
    const vitLocation = { latitude: 23.1881, longitude: 77.4625 };
    const radius = 100 / 6371;

    const areas = await Area.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [vitLocation.longitude, vitLocation.latitude],
            radius,
          ],
        },
      },
    });

    const areasWithDetails = areas.map(
      ({
        id,
        name,
        topographicInfo,
        demographicData,
        population,
        ageRatio,
        genderRatio,
        marketTrend,
      }) => ({
        id,
        name,
        topographicInfo: topographicInfo || "N/A",
        demographicData: demographicData || "N/A",
        population: population || 0,
        ageRatio: ageRatio || {
          "0-14": { male: 0, female: 0 },
          "15-24": { male: 0, female: 0 },
          "25-54": { male: 0, female: 0 },
          "55+": { male: 0, female: 0 },
        },
        genderRatio: genderRatio || { male: 0, female: 0, other: 0 },
        marketTrend: marketTrend || "N/A",
      })
    );

    res.json(areasWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/areas", async (req, res) => {
  try {
    const { name } = req.body;

    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res
        .status(400)
        .json({ error: "Area with the same name already exists" });
    }

    const newArea = await Area.create(req.body);
    res
      .status(201)
      .json({ id: newArea.id, message: "Area added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/areas/:id", async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.json(area);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/areas/:id", async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.json({ message: "Area deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query, latitude, longitude } = req.query;
    const regex = new RegExp(query, "i");

    let searchCriteria = { name: regex };

    if (latitude && longitude) {
      const radius = 10 / 6371; 
      searchCriteria.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(longitude), parseFloat(latitude)],
            radius,
          ],
        },
      };
    }

    const recommendations = await Area.find(searchCriteria);
    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search-suggestions", async (req, res) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, "i");
    const suggestions = await Area.find({ name: regex });
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
