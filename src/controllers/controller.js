const {
  fetchTreflePlants,
  fetchBiodiversityPlants,
} = require("../services/services");

const getPlants = async (req, res) => {
  try {
    const treflePlants = await fetchTreflePlants();
    const biodiversityPlants = await fetchBiodiversityPlants();
    const combinedPlants = [...treflePlants, ...biodiversityPlants];
    res.json(combinedPlants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plant data" });
  }
};

module.exports = { getPlants };
