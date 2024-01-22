const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  try {
    const city = req.query.city;
    const weatherApiKey = '16d311977fced07064aa910221a6b04c';
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`);
    
    if (weatherResponse.status !== 200) {
      throw new Error(`OpenWeather API error! Status: ${weatherResponse.status}`);
    }

    const weatherData = weatherResponse.data;
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
