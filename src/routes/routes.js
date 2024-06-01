const express = require("express");
const { getPlants } = require("../controllers/controller");

const router = express.Router();

router.get("/", getPlants);

module.exports = router;
