const searchFormEl = document.querySelector('#search-form');
const resultTextEl = document.querySelector('#result-text');
const resultContentEl = document.querySelector('#result-content');
const forecastEl = document.querySelector('#forecast-cards'); // Updated forecast element reference

function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInputVal = document.querySelector('#search-input').value;
  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }
  searchApi(searchInputVal);
}

function searchApi(query) {
  const apiKey = 'b1b15e88fa797225412429c1c50c122a1'; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      displayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      resultContentEl.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
  const weatherDescription = weather[0].description;
  const temp = main.temp;
  const windSpeed = wind.speed;
  const humidity = main.humidity;

  const weatherHTML = `
    <h3>${name}</h3>
    <img src="${weatherIcon}" alt="${weatherDescription}">
    <p><strong>Weather:</strong> ${weatherDescription}</p>
    <p><strong>Temperature:</strong> ${temp} &deg;C</p>
    <p><strong>Wind:</strong> ${windSpeed} m/s</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
  `;

  resultTextEl.textContent = name;
  resultContentEl.innerHTML = weatherHTML;
}

function displayForecast(lat, lon) {
  const apiKey = 'ef6e31ba32d4dfd35a7bd44f263fedb5'; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Forecast not available');
      }
      return response.json();
    })
    .then(data => {
      const forecast = data.daily.slice(1, 6); // Get the next 5 days forecast
      let forecastHTML = '';
      forecast.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        const description = day.weather[0].description;
        const temp = day.temp.day;
        const wind = day.wind_speed;
        const humidity = day.humidity;

        forecastHTML += `
          <div class="forecast-item">
            <p><strong>${date}</strong></p>
            <img src="${icon}" alt="${description}">
            <p><strong>${description}</strong></p>
            <p><strong>Temp:</strong> ${temp} &deg;C</p>
            <p><strong>Wind:</strong> ${wind} m/s</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
          </div>
        `;
      });

      forecastEl.innerHTML = forecastHTML;
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
      forecastEl.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
