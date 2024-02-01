let searchButton = $('#search-button');
let searchInput = $('#search-input');
let listGroup = $('#history');
let todaySection = $('#today');
let forecast = $('#forecast');
let divContainer = $('<div>');
let rowContainer = $('<div>');

let map;
let service;
let infowindow;

// Set default latitude and longitude to London
let lat;
let lon;

// Check if the localstorage has existing data
function checkLSData() {
  for (let i = 1; i < localStorage.length + 1; i++) {
    let lsCity = localStorage.getItem(i);
    if (i === 1) {
      // Display the city and current weather if the localstorage has value
      displayForecast(lsCity);
    }
    // Create the button element and set the text to city name
    btnEl = $('<button>').addClass('btn btn-outline-dark mx-1 text-capitalize').text(lsCity);
    btnEl.attr('data-city', lsCity);
    listGroup.append(btnEl); // Append the button to the list button group
  }
}

checkLSData();

// Displays the current weather when user enters the city and clicks search button
searchButton.on('click', function (event) {
  event.preventDefault();
  cityExists = 0;
  let city = searchInput.val().trim().toLowerCase(); // Converts a string to lowercase letters

  // Loop to check if the city exists in the local storage
  for (let i = 1; i <= localStorage.length; i++) {
    if (localStorage.getItem(i) === city) {
      cityExists++;
    }
  }

  // If the city doesn't exist in the local storage, call function displayCurrentWeather(city) and displayForecast(city)
  if (cityExists === 0 && city !== '') {
    // Set the key of the new city to localStorage.length + 1
    localStorage.setItem(localStorage.length + 1, city);
    //displayCurrentWeather(city);
    displayForecast(city);
    let btnEl = $('<button>').addClass('btn btn-outline-dark m-1 text-capitalize').text(city);
    // Append the button to the list button group below the search form
    btnEl.attr('data-city', city);
    listGroup.append(btnEl);
    searchInput.val('');
  } else {
    searchInput.addClass('is-invalid');
  }
});

function displayForecast(city) {

  // Create variable queryURL and store the URL with parameters city and appid to make an API call
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6a43ea209a0fd6d7d6a35882a4db10c4`;
  rowContainer.empty();
  divContainer.empty();
  forecast.empty();

  //  Method to call 5 day / 3 hour forecast data
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function (result) {

      lat = result.city.coord.lat;
      lon = result.city.coord.lon;

      let countryCode = result.city.country;
      let h3El = $('<h3>');
      h3El.text(`${city} 5-day Weather Forecasts:`).addClass('w-100 text-capitalize text-center primary-dark-text');
      forecast.append(h3El);

      //  Loop through the 3 hour forecast data and increase the count by 8 to get the next 5-day forecast 
      for (let i = 1; i < result.list.length; i += 8) {

        // Get the icon from the API response
        let icon = result.list[i].weather[0].icon;
        iconForecast = $('<img>');

        //console.log(icon);

        if (icon === '01d') {
          iconSrc = './assets/images/icons/day.svg'
        } else if (icon === '01n') {
          iconSrc = './assets/images/icons/night.svg'
        } else if (icon === '03d') {
          iconSrc = './assets/images/icons/cloudy.svg'
        } else if (icon === '03n') {
          iconSrc = './assets/images/icons/cloudy-night-2.svg'
        } else if (icon === '02d' || icon === '02n' || icon === '04d' || icon === '04n') {
          iconSrc = './assets/images/icons/cloudy.svg'
        } else if (icon === '09d' || icon === '09n') {
          iconSrc = './assets/images/icons/shower-rain.svg'
        }else if (icon === '10d' || icon === '10n') {
          iconSrc = './assets/images/icons/rain.svg'
        } else if (icon === '11d' || icon === '11n') {
          iconSrc = './assets/images/icons/thunder.svg'
        } else if (icon === '13d' || icon === '13n') {
          iconSrc = './assets/images/icons/snow.svg'
        } else {
          iconSrc = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        }

        iconForecast.addClass('iconToday').attr('src', iconSrc);

        // Get the date from the API response and add it into <h4> tag 
        let cityDate = result.list[i].dt_txt;
        let date = dayjs(cityDate).format('ddd D/M/YYYY');
        let pDate = $('<p>');
        pDate.addClass('fw-bold mb-0').text(date);

        // Get the temperature value from the API response and add it into <p> tag 
        let temperature = Math.floor(result.list[i].main.temp - 273.15);
        let pTemp = $('<p>');
        pTemp.addClass('mb-0').text(`Temperature: ${temperature} °C`);

        // Get the wind speed value from the API response and add it into <p> tag
        // Multiply the speed value by 3.6 to convert meter per second to kilometer per hour
        let wind = result.list[i].wind.speed * 3.6;
        let pWind = $('<p>');
        pWind.addClass('mb-0').text(`Wind: ${wind.toFixed(2)} KPH`);

        // Get the humidity value from the API response and add it into <p> tag 
        let humidity = result.list[i].main.humidity;
        let pHumidity = $('<p>');
        pHumidity.addClass('mb-0').text(`Humidity: ${humidity} %`);

        // Create divCol variable and append elements to display 5 day weather forecast
        let divCol = $('<div>');
        divCol.addClass('col-sm col-xs-12 p-3 bg-forecasts rounded-2 text-center m-1').css('border', '3px solid #fff')
        divCol.append(pDate, iconForecast, pTemp, pWind, pHumidity);

        // Append divCol to rowContainer
        rowContainer.append(divCol).addClass('row m-0');

        // Append rowContainer to forecast section
        forecast.append(rowContainer);

      }

      let currency;
      //console.log(countryCode);

      if (countryCode != 'GB') {
        //Set Base Exchange from GBP
        let queryURLExchange = 'https://open.er-api.com/v6/latest/GBP';
        fetch(queryURLExchange)
          .then(function (response) {
            return response.json();
          }).then(function (result) {

            if (countryCode == 'ES'
              || countryCode == 'FR'
              || countryCode == 'MC') {
              currency = 'EUR';
            } else if (countryCode == 'US') {
              currency = 'USD';
            } else if (countryCode == 'BG') {
              currency = 'BGN';
            } else if (countryCode == 'CZ') {
              currency = 'CZK';
            } else if (countryCode == 'DK') {
              currency = 'DKK';
            } else if (countryCode == 'SG') {
              currency = 'SGD';
            } else if (countryCode == 'PH') {
              currency = 'PHP';
            }

            let currencyRate = result.rates[currency];
            
            if (currencyRate) {
              let currencyData = `<p>1 GBP = ${currencyRate} ${currency}</p>`;
              let currencyExchangeDiv = $('#currencyExchange');
              currencyExchangeDiv.empty();
              currencyExchangeDiv.append(currencyData);
            }

          });
      }

      let searchCity = new google.maps.LatLng(lat, lon);

      infowindow = new google.maps.InfoWindow();
      map = new google.maps.Map(document.getElementById("map"), {
        center: searchCity,
        zoom: 15,
      });

      const request = {
        query: city,
        fields: ["name", "geometry"],
      };

      service = new google.maps.places.PlacesService(map);
      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }

          map.setCenter(results[0].geometry.location);
        }
      });

      window.initMap = initMap;

      $('#map').css('height','500px');
      $('.weather-header').css({'margin-top': '0', 'transition': 'all .3s ease-out'});
      
    });


}

listGroup.on('click', 'button', function (event) {
  let city = $(event.target).data('city');
  displayForecast(city);
});

function initMap() {
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}
