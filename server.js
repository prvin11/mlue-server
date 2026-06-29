const express = require('express');
const axios = require('axios');
const app = express();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Proxy TMDB API
app.get('/tmdb/*', async (req, res) => {
  try {
    const tmdbPath = req.params[0];
    const query = req.query;

    const response = await axios.get(`${TMDB_BASE_URL}/${tmdbPath}`, {
      params: {
        ...query,
        api_key: TMDB_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'TMDB fetch failed' });
  }
});

// Proxy TMDB Images
app.get('/image/*', async (req, res) => {
  try {
    const imagePath = req.params[0];
    const response = await axios.get(
      `https://image.tmdb.org/t/p/${imagePath}`,
      { responseType: 'arraybuffer' }
    );
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Image fetch failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));