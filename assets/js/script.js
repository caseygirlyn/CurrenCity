let searchButton = $('#search-button');
let searchInput = $('#search-input');
let listGroup = $('#history');
let todaySection = $('#today');
let forecast = $('#forecast');
let divContainer = $('<div>');
let rowContainer = $('<div>');
let attactionsTitle = $('#attractionsTitle');
let clearSearchHistory = $('#clearSearchHistory');

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

  // If the city doesn't exist in the local storage, call function displayCurrentWeather(city) and displayForecast(city)
  if (cityExists === 0 && city !== '') {
    // Set the key of the new city to localStorage.length + 1
    localStorage.setItem(localStorage.length + 1, city);
    //displayCurrentWeather(city);
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

  let currencyExchangeDiv = $('#currencyExchange');
  currencyExchangeDiv.empty();

  // Create variable queryURL and store the URL with parameters city and appid to make an API call
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6a43ea209a0fd6d7d6a35882a4db10c4`;
  rowContainer.empty();
  divContainer.empty();
  forecast.empty();
  $('#places').empty();
  attactionsTitle.empty();

  //  Method to call 5 day / 3 hour forecast data
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function (result) {

      lat = result.city.coord.lat;
      lon = result.city.coord.lon;

      let countryCode = result.city.country;
      let h2El = $('<h2>');
      h2El.text(`${city} 5-day Weather Forecasts:`).addClass('w-100 text-capitalize text-center primary-dark-text');
      forecast.append(h2El);

      attactionsTitle.append(`Attractions in ${city}`);

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
        } else if (icon === '10d' || icon === '10n') {
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
        pDate.addClass('fw-bold mb-0 small-text').text(date);

        // Get the temperature value from the API response and add it into <p> tag 
        let temperature = Math.floor(result.list[i].main.temp - 273.15);
        let pTemp = $('<p>');
        pTemp.addClass('mb-0 small-text').text(`Temperature: ${temperature} °C`);

        // Get the wind speed value from the API response and add it into <p> tag
        // Multiply the speed value by 3.6 to convert meter per second to kilometer per hour
        let wind = result.list[i].wind.speed * 3.6;
        let pWind = $('<p>');
        pWind.addClass('mb-0 small-text').text(`Wind: ${wind.toFixed(2)} KPH`);

        // Get the humidity value from the API response and add it into <p> tag 
        let humidity = result.list[i].main.humidity;
        let pHumidity = $('<p>');
        pHumidity.addClass('mb-0 small-text').text(`Humidity: ${humidity} %`);

        // Create divCol variable and append elements to display 5 day weather forecast 
        let divCol = $('<div>');
        divCol.addClass('col-sm col-xs-12 px-2 py-3 bg-forecasts rounded-2 text-center m-1');
        divCol.append(pDate, iconForecast, pTemp, pWind, pHumidity);

        // Append divCol to rowContainer
        rowContainer.append(divCol).addClass('row m-0 align-content-center flex-row justify-content-center');

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

            if (countryCode == 'BE' || countryCode == 'BG' || countryCode == 'CZ' || countryCode == 'DK' || countryCode == 'DE' || countryCode == 'EE' || countryCode == 'IE' || countryCode == 'EL' || countryCode == 'ES' || countryCode == 'FR' || countryCode == 'HR' || countryCode == 'IT' || countryCode == 'CY' || countryCode == 'LV' || countryCode == 'LT' || countryCode == 'LU' || countryCode == 'HU' || countryCode == 'MC' || countryCode == 'MT' || countryCode == 'NL' || countryCode == 'AT' || countryCode == 'PL' || countryCode == 'PT' || countryCode == 'RO' || countryCode == 'SI' || countryCode == 'SK' || countryCode == 'FI' || countryCode == 'SE' || countryCode == 'GR' || countryCode == 'ME' || countryCode == 'XK'
            ) {
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
            } else if (countryCode == 'IS') {
              currency = 'ISK';
            } else if (countryCode == 'NO') {
              currency = 'NOK';
            } else if (countryCode == 'LI') {
              currency = 'CHF';
            } else if (countryCode == 'CH') {
              currency = 'CHF';
            } else if (countryCode == 'BA') {
              currency = 'BAM';
            } else if (countryCode == 'MD') {
              currency = 'MDL';
            } else if (countryCode == 'MK') {
              currency = 'MKD';
            } else if (countryCode == 'GE') {
              currency = 'GEL';
            } else if (countryCode == 'AL') {
              currency = 'ALL';
            } else if (countryCode == 'RS') {
              currency = 'RSD';
            } else if (countryCode == 'TR') {
              currency = 'TRY';
            } else if (countryCode == 'UA') {
              currency = 'UAH';
            } else if (countryCode == 'AM') {
              currency = 'AMD';
            } else if (countryCode == 'BY') {
              currency = 'BYN';
            } else if (countryCode == 'AZ') {
              currency = 'AZN';
            } else if (countryCode == 'DZ') {
              currency = 'DZD';
            } else if (countryCode == 'LB') {
              currency = 'LBP';
            } else if (countryCode == 'SY') {
              currency = 'SYP';
            } else if (countryCode == 'EG') {
              currency = 'EGP';
            } else if (countryCode == 'LY') {
              currency = 'LYD';
            } else if (countryCode == 'TN') {
              currency = 'TND';
            } else if (countryCode == 'IL') {
              currency = 'ILS';
            } else if (countryCode == 'MA') {
              currency = 'MAD';
            } else if (countryCode == 'JO') {
              currency = 'JOD';
            } else if (countryCode == 'PS') {
              currency = 'ILS';
            } else if (countryCode == 'AR') {
              currency = 'ARS';
            } else if (countryCode == 'AU') {
              currency = 'AUD';
            } else if (countryCode == 'BR') {
              currency = 'BRL';
            } else if (countryCode == 'CA') {
              currency = 'CAD';
            } else if (countryCode == 'CN_X_HK') {
              currency = 'CNY';
            } else if (countryCode == 'HK') {
              currency = 'HKD';
            } else if (countryCode == 'IN') {
              currency = 'INR';
            } else if (countryCode == 'JP') {
              currency = 'JPY';
            } else if (countryCode == 'MX') {
              currency = 'MXN';
            } else if (countryCode == 'NG') {
              currency = 'NGN';
            } else if (countryCode == 'NZ') {
              currency = 'NZD';
            } else if (countryCode == 'RU') {
              currency = 'RUB';
            } else if (countryCode == 'SG') {
              currency = 'SGD';
            } else if (countryCode == 'ZA') {
              currency = 'ZAR';
            } else if (countryCode == 'KR') {
              currency = 'KRW';
            } else if (countryCode == 'TW') {
              currency = 'TWD';
            } else if (countryCode == 'TH') {
              currency = 'THB';
            } else if (countryCode == 'AE') {
              currency = 'AED';
            } else if (countryCode == 'MO') {
              currency = 'MOP';
            } else if (countryCode == 'MY') {
              currency = 'MYR';
            } else if (countryCode == 'CN') {
              currency = 'CNY';
            } else if (countryCode == 'IN') {
              currency = 'INR';
            } else if (countryCode == 'BB') {
              currency = 'BBD';
            } else if (countryCode == 'BD') {
              currency = 'BDT';
            } else if (countryCode == 'BS') {
              currency = 'BSD';
            } else if (countryCode == 'BZ') {
              currency = 'BZD';
            }

            if (currency) {
              let currencyRate = result.rates[currency].toFixed(2);

              if (currencyRate) {
                let currencyData = `<p class='currencyText rounded-1'>1 GBP = ${currencyRate} ${currency}</p>`;
                currencyExchangeDiv.append(currencyData);
              } else {
                currencyExchangeDiv.empty();
              }
            }

          });
      }


      // Create the map.
      let pyrmont = { lat: lat, lng: lon };
      let map = new google.maps.Map(document.getElementById("map"), {
        center: pyrmont,
        zoom: 16,
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
        { location: pyrmont, radius: 500, type: "tourist_attraction" },
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

  console.log(places);

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
        icon: image,
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

        if (place.rating) {
          placeRating.textContent = 'Rating: ' + place.rating;
          content.appendChild(placeRating);
        };

        placeAddressElement.textContent = place.formatted_address;
        content.appendChild(placeAddressElement);

        infowindow.setContent(content);
        infowindow.open(map, marker);
      });

      let li = document.createElement("li");

      if (photos) {
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

          if (place.rating) {
            placeRating.textContent = 'Rating: ' + place.rating;
            content.appendChild(placeRating);
          }

          placeAddressElement.textContent = place.formatted_address;
          content.appendChild(placeAddressElement);

          infowindow.setContent(content);
          infowindow.open(map, marker);

        });

      }

    }
  }
}
