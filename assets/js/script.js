const searchButton = $('#search-button');
const searchInput = $('#search-input');
const listGroup = $('#history');
const todaySection = $('#today');
const forecast = $('#forecast');
const divContainer = $('<div>');
const rowContainer = $('<div>');
const attactionsTitle = $('#attractionsTitle');
const clearSearchHistory = $('#clearSearchHistory');
const places = $('#places');

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
    btnEl = $('<button>').addClass('btn btn-light m-1 text-capitalize').text(lsCity);
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

  // If the city doesn't exist in the local storage, call function displayForecast(city)
  if (cityExists === 0 && city !== '') {
    // Set the key of the new city to localStorage.length + 1
    localStorage.setItem(localStorage.length + 1, city);
    displayForecast(city);
    let btnEl = $('<button>').addClass('btn btn-light m-1 text-capitalize').text(city);
    // Append the button to the list button group below the search form
    btnEl.attr('data-city', city);
    listGroup.append(btnEl);
    searchInput.val('');
  } else {
    searchInput.addClass('is-invalid');
  }
});

function displayForecast(city) {

  const currencyExchangeDiv = $('#currencyExchange');
  currencyExchangeDiv.empty();

  // Create variable queryURL and store the URL with parameters city and appid to make an API call
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6a43ea209a0fd6d7d6a35882a4db10c4`;
  
  rowContainer.empty();
  divContainer.empty();
  forecast.empty();
  places.empty();
  attactionsTitle.empty();

  //  Method to call 5 day / 3 hour forecast data
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function (result) {

      lat = result.city.coord.lat;
      lon = result.city.coord.lon;

      let countryCode = result.city.country;
      const h2El = $('<h2>');
      h2El.text(`5-day Weather Forecasts in ${city}, ${countryCode} `).addClass('w-100 text-capitalize text-center primary-dark-text');
      forecast.append(h2El);

      attactionsTitle.append(`Attractions in ${city}, ${countryCode} `);

      //  Loop through the 3 hour forecast data and increase the count by 8 to get the next 5-day forecast 
      for (let i = 1; i < result.cnt; i += 8) {

        // Get the icon from the API response
        let icon = result.list[i].weather[0].icon;
        iconForecast = $('<img>');

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
        } else if (icon === '10d' || icon === '10n') {
          iconSrc = './assets/images/icons/rain.svg'
        } else if (icon === '11d' || icon === '11n') {
          iconSrc = './assets/images/icons/thunder.svg'
        } else if (icon === '13d' || icon === '13n') {
          iconSrc = './assets/images/icons/snow.svg'
        } else {
          iconSrc = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        }

        iconForecast.addClass('iconForecast').attr('src', iconSrc);

        // Get the date from the API response and add it into <h4> tag 
        let cityDate = result.list[i].dt_txt;
        let date = dayjs(cityDate).format('ddd D/M/YYYY');
        let pDate = $('<p>');
        pDate.addClass('fw-bold mb-0 small-text').text(date);

        // Get the temperature value from the API response and add it into <p> tag 
        let temperature = Math.floor(result.list[i].main.temp - 273.15);
        const pTemp = $('<p>');
        pTemp.addClass('mb-0 small-text').text(`Temperature: ${temperature} °C`);

        // Get the wind speed value from the API response and add it into <p> tag
        // Multiply the speed value by 3.6 to convert meter per second to kilometer per hour
        let wind = result.list[i].wind.speed * 3.6;
        const pWind = $('<p>');
        pWind.addClass('mb-0 small-text').text(`Wind: ${wind.toFixed(2)} KPH`);

        // Get the humidity value from the API response and add it into <p> tag 
        let humidity = result.list[i].main.humidity;
        const pHumidity = $('<p>');
        pHumidity.addClass('mb-0 small-text').text(`Humidity: ${humidity} %`);

        // Create divCol variable and append elements to display 5 day weather forecast 
        const divCol = $('<div>');
        divCol.addClass('col-sm col-xs-12 px-2 py-3 bg-forecasts rounded-2 text-center m-1');
        divCol.append(pDate, iconForecast, pTemp, pWind, pHumidity);

        // Append divCol to rowContainer
        rowContainer.append(divCol).addClass('row m-0 align-content-center flex-row justify-content-center');

        // Append rowContainer to forecast section
        forecast.append(rowContainer);

      }

      let currency;
      //console.log(countryCode);

      //Set Base Exchange from GBP
      const queryURLExchange = 'https://open.er-api.com/v6/latest/GBP';
      fetch(queryURLExchange)
        .then(function (response) {
          return response.json();
        }).then(function (result) {

          let queryCountryCode = 'https://restcountries.com/v3.1/alpha/' + countryCode;
          fetch(queryCountryCode)
            .then(function (response) {
              return response.json();
            }).then(function (resultCountryCode) {

              let resultFlag = resultCountryCode[0].flag;

              if (resultFlag) {
                attactionsTitle.append(resultFlag);
                h2El.append(resultFlag);
              }

              // Get the Currency Code
              currency = Object.keys(resultCountryCode[0].currencies).toString();

              // Exclude Country Code GB 
              if (currency && countryCode != 'GB') {
                let currencyRate = result.rates[currency].toFixed(2);

                if (currencyRate) {
                  let currencyData = `<p class='currencyText rounded-1 w-auto'>1 GBP = ${currencyRate} ${currency}</p>`;
                  currencyExchangeDiv.append(currencyData);
                } else {
                  currencyExchangeDiv.empty();
                }
              }

            });
        });

      // Create the map.
      let nearby = { lat: lat, lng: lon };
      let map = new google.maps.Map(document.getElementById("map"), {
        center: nearby,
        zoom: 14,
        mapId: "8d193001f940fde3",
      });

      // Create the places service.
      let service = new google.maps.places.PlacesService(map);
      let getNextPage;
      let moreButton = document.getElementById("more");

      moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) {
          getNextPage();
        }
      };

      // Perform a nearby search.
      service.nearbySearch(
        { location: nearby, radius: 5000, type: 'tourist_attraction' },
        (results, status, pagination) => {
          if (status !== "OK" || !results) return;

          addPlaces(results, map);
          moreButton.disabled = !pagination || !pagination.hasNextPage;
          if (pagination && pagination.hasNextPage) {
            getNextPage = () => {
              // Note: nextPage will call the same handler function as the initial call
              pagination.nextPage();
            };
          }
        },
      );

      $('#page1').css('background', 'none');
      $('.weather-header').removeClass('invisible').css({ 'margin-top': '50px', 'transition': 'all .5s ease-out' });
      $('.weather-header img').css('width', '220px');
      $('#container,#attractions,#clearSearchHistory').removeClass('d-none').fadeIn("slow");

    });
}

listGroup.on('click', 'button', function (event) {
  let city = $(event.target).data('city');
  displayForecast(city);
});

// Clear search history
clearSearchHistory.on('click', function (event) {
  localStorage.clear();
  location.reload();
});

function addPlaces(places, map) {
  let placesList = document.getElementById("places");
  let infowindow = new google.maps.InfoWindow();

  // Add Google maps animated marker
  const customMarker = {
    url: `./assets/images/marker.gif`, 
    scaledSize: new google.maps.Size(40, 40),
  };

  for (let place of places) {
    if (place.geometry && place.geometry.location) {
      let image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(20, 20),
      };

      let marker = new google.maps.Marker({
        map,
        animation: google.maps.Animation.DROP,
        icon: customMarker,
        title: place.name,
        position: place.geometry.location,
      });

      let photos = place.photos;
      let content = document.createElement("div");
      let placeImage = document.createElement("img");
      let nameElement = document.createElement("h4");
      let nameElement2 = document.createElement("h3");
      let placeRating = document.createElement("div");
      let vicinity = document.createElement("div");
      let placeAddressElement = document.createElement("div");

      content.className = 'contentMarker';
      vicinity.className = 'fs-6 mb-2';
      placeRating.className = 'fs-6';

      google.maps.event.addListener(marker, "click", () => {

        if (photos) {
          let placeImageURL = photos[0].getUrl();
          placeImage.src = placeImageURL;
          placeImage.className = 'placeImageMarker';
          content.append(placeImage);
        }

        nameElement2.textContent = place.name;
        content.appendChild(nameElement2);

        vicinity.textContent = place.vicinity;
        content.appendChild(vicinity);

        if (place.rating >= 4) {
          placeRating.textContent = 'Rating: ' + place.rating;
          content.appendChild(placeRating);
          placeAddressElement.textContent = place.formatted_address;
          content.appendChild(placeAddressElement);
        }
        infowindow.setContent(content);
        infowindow.open(map, marker);
      });

      let li = document.createElement("li");

      if (photos && place.rating >= 4) {
        // Add sidebar places images
        let placeImageURL = photos[0].getUrl();
        placeImage.src = placeImageURL;
        placeImage.className = 'placeImage';
        li.style.backgroundImage = `url(${placeImageURL})`;
        nameElement.textContent = place.name;

        li.appendChild(nameElement);
        placesList.appendChild(li);

        li.addEventListener("click", () => {

          map.setCenter(place.geometry.location);

          content.appendChild(placeImage);

          nameElement2.textContent = place.name;
          content.appendChild(nameElement2);

          vicinity.textContent = place.vicinity;
          content.appendChild(vicinity);

          placeRating.textContent = 'Rating: ' + place.rating;
          content.appendChild(placeRating);

          placeAddressElement.textContent = place.formatted_address;
          content.appendChild(placeAddressElement);

          infowindow.setContent(content);
          infowindow.open(map, marker);

        });

      }

    }
  }
}