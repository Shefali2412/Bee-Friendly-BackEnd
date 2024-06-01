const express = require("express");
const plantRoutes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use("/api/plants", plantRoutes);

module.exports = app;
