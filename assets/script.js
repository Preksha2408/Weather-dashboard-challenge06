const searchFormEl = document.querySelector('#search-form');
const resultContentEl = document.querySelector('#result-content');
const forecastEl = document.querySelector('#forecast-cards');
const savedHistoryEl = document.querySelector('#saved-history')

function handleSearchFormSubmit(event) {    // Event is the functions paramter here //
  event.preventDefault();                  // Prevents the default action of submitting and reloading the page , the page would get updated without refreshing //
  const searchInputVal = document.querySelector('#search-input').value;  // Takes in the search input value and now this value is declared as searchInputVal().//
  if (!searchInputVal) {                      // If a wrong searchInputVal is given for eg :number , it prints the error msg else returns the search input value.//
    console.error('You need a search input value!');
    return;
  }
  searchApi(searchInputVal);      // The search Api function is called //
  saveSearchHistory(searchInputVal);
}

function searchApi(query) {
  const apiKey = '3f9df787edd45363cc431263e4e562cf';   // Key is generated through openWeather Api//
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)         // The fetch(apiUrl) initiates a fetch request to the specified URL in apiUrl //
    .then(function(response) {        // provides a response object //
      if (!response.ok) {             // Checks if the response is ok //
        throw new Error('City not found');      // If the server doesnt contain the requested city , it throws an error //
      }
      return response.json();       // the object or response body is converted to JSON //
    })
    .then(function(data) {       // the JSON data is provided // 
      displayWeather(data);         // displayWeather() function and displayForecast() function are called to extract specifics from the data //
      displayForecast(data.coord.lat, data.coord.lon);
    })
    .catch(function(error) {      // The catch function handles errors durinf the fetch request //
      console.error('Error fetching data:', error);
      resultContentEl.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function displayWeather(data) {              
  const { name, main, weather, wind } = data;    // Extracts name , main weather , wind from the data Object .//
  const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;    // used for icon image //
  
  const currentDate = new Date().toLocaleDateString();    // New Date object is been created and is converted to a string //
  const temp = main.temp;     // temp, windSpeed , humidty is extracted from main and wind objects within data object //
  const windSpeed = wind.speed;
  const humidity = main.humidity;

  const weatherHTML = `                
    <h1>${name} (${currentDate}) <img src="${weatherIcon}" alt="Weather Description"></h1>
    <p><strong>Temperature:</strong> ${temp} &deg;F</p>
    <p><strong>Wind:</strong> ${windSpeed} m/s</p>
    <p><strong>Humidity:</strong> ${humidity}%</p>
  `;

 
  resultContentEl.innerHTML = weatherHTML;   // Sets the innerHTML of the resultContentEl to the weatherHTML , updates the content of element on the webpage //
}

function displayForecast(lat, lon) {
  const apiKey = '3f9df787edd45363cc431263e4e562cf';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
  
  fetch(apiUrl)
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Forecast not available');
      }
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      
      let forecastHTML = '<h2></h2><div class="forecast-row">';

      for (let i = 0; i < data.list.length; i += 8) {             // This loops through list in the data , filtering out the data after every 8th count//
        const element = data.list[i];
        const date = new Date(element.dt_txt).toLocaleDateString();    // extracts date (dt_text) //
        const icon = `https://openweathermap.org/img/wn/${element.weather[0].icon}.png`;
        const temp = element.main.temp;
        const windSpeed = element.wind.speed;
        const humidity = element.main.humidity;

        forecastHTML += `
          <div class="forecast-card">
            <h4>${date}</h4>
            <img src="${icon}" alt="Weather Icon">
            <p><strong>Temp:</strong> ${temp} &deg;F</p>
            <p><strong>Wind:</strong> ${windSpeed} m/s</p>
            <p><strong>Humidity:</strong> ${humidity}%</p>
          </div>
        `;
      }

      forecastHTML += '</div>';
      forecastEl.innerHTML = forecastHTML;
    })
    .catch(function(error) {
      console.error('Error fetching forecast:', error);
      forecastEl.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function saveSearchHistory(cityName) {                                            
  const cityCard = document.createElement('div');                               // creates a new div element //
  cityCard.classList.add('card', 'bg-dark', 'text-light', 'mb-2', 'p-2');     // multiple classes are added to the element cityCard//
  cityCard.textContent = cityName;  // the text content of citycard is the value of cityName //
  savedHistoryEl.appendChild(cityCard);     // Basically the cityName value will be appended to savedHistoryEl//
}





searchFormEl.addEventListener('submit', handleSearchFormSubmit);   // handleSearchFormSubmit() function is called when search button is clicked //
