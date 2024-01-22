async function getWeather() {
	const city = document.getElementById('cityInput').value;
	try {
	  // Get weather data
	  const weatherData = await fetchWeatherData(city);
	  displayWeather(weatherData);
  
	  // Get air quality data
	  const airQualityData = await fetchAirQualityData(city);
	  displayAirQuality(airQualityData);
  
	  // Get location and map
	  const locationData = await fetchLocationData(city);
	  displayMap(locationData);
	} catch (error) {
	  console.error(error);
	}
  }
  
  async function fetchWeatherData(city) {
	try {
	  const response = await fetch(`http://localhost:3000/weather?city=${city}`);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  return await response.json();
	} catch (error) {
	  console.error('Error fetching weather data:', error);
	  throw error;
	}
  }
  
  async function fetchAirQualityData(city) {
	try {
	  // Use your Air Quality API key and endpoint
	  const airQualityApiKey = 'd2d5feac866ae2b9a3aa85449b24d43612c158f7';
	  const response = await fetch(`https://api.waqi.info/feed/?city=${city}&apikey=${airQualityApiKey}`);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  return await response.json();
	} catch (error) {
	  console.error('Error fetching air quality data:', error);
	  throw error;
	}
  }
  
  async function fetchLocationData(city) {
	try {
	  const geolocationApiKey = 'pk.eyJ1IjoiZGltYXNoMSIsImEiOiJjbHJwMnZoaTUwMTlxMmtubWc1anFicGx3In0.gqHwtp1Z18PTg3avbKTdWQ';
	  const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${geolocationApiKey}`);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  return await response.json();
	} catch (error) {
	  console.error('Error fetching location data:', error);
	  throw error;
	}
  }
  
  
  function displayWeather(data) {
	const weatherInfoDiv = document.getElementById('weatherInfo');
	const rainVolume = data.rain && data.rain['3h'] ? `${data.rain['3h']} mm` : 'N/A';
  
	weatherInfoDiv.innerHTML = `
	  <h2>${data.name}, ${data.sys.country}</h2>
	  <p>Temperature: ${data.main.temp - 273} &deg;C</p>
	  <p>Description: ${data.weather[0].description}</p>
	  <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
	  <p>Coordinates: [${data.coord.lat}, ${data.coord.lon}]</p>
	  <p>Feels Like: ${data.main.feels_like} &deg;C</p>
	  <p>Humidity: ${data.main.humidity}%</p>
	  <p>Pressure: ${data.main.pressure} hPa</p>
	  <p>Wind Speed: ${data.wind.speed} m/s</p>
	  <p>Rain (last 3 days): ${rainVolume}</p>
	`;
  }
  
  function displayAirQuality(data) {
	const airQualityInfoDiv = document.getElementById('airQualityInfo');
	const airQualityValue = data.aqi !== undefined ? data.aqi : 'N/A';
	const airQualityStatus = getAirQualityStatus(airQualityValue);
  
	airQualityInfoDiv.innerHTML = `
	  <h2>Air Quality</h2>
	  <p>AQI: ${airQualityValue} (${airQualityStatus})</p>
	`;
  }
  
  function getAirQualityStatus(aqi) {
	if (aqi >= 0 && aqi <= 50) {
	  return 'Good';
	} else {
	  return 'Bad';
	}
  }
  
  function displayMap(locationData) {
	const mapDiv = document.getElementById('map');
	const locationInfoDiv = document.getElementById('locationInfo');
	const { lat, lon } = locationData.coord;
  
	// Create a simple Leaflet map
	const mymap = L.map(mapDiv).setView([lat, lon], 13);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: '© OpenStreetMap contributors'
	}).addTo(mymap);
  
	// Add a marker to the map
	L.marker([lat, lon]).addTo(mymap)
	  .bindPopup(`${locationData.name}, ${locationData.sys.country}`)
	  .openPopup();
  
	// Display location information
	locationInfoDiv.innerHTML = `
	  <h2>Location</h2>
	  <p>City: ${locationData.name}</p>
	  <p>Country: ${locationData.sys.country}</p>
	`;
  }
  