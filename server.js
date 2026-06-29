const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Home
app.get("/", (req, res) => {
  res.json({
    status: "TMDB Proxy Running 🚀",
  });
});

app.use(cors());

// TMDB Proxy
app.use("/tmdb", async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}${req.path.replace("/tmdb", "")}`,
      {
        params: {
          ...req.query,
          api_key: TMDB_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "TMDB fetch failed",
    });
  }
});

// Image Proxy
app.use("/image", async (req, res) => {
  try {
    const imagePath = req.originalUrl.replace("/image/", "");

    const response = await axios.get(
      `https://image.tmdb.org/t/p/${imagePath}`,
      {
        responseType: "arraybuffer",
      }
    );

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Image fetch failed",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Proxy running on port ${PORT}`);
});