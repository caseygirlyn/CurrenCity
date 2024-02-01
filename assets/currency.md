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
            }else if (countryCode == 'US'){
              currency = 'USD';
            }else if (countryCode == 'BG'){
              currency = 'BGN';
            }else if (countryCode == 'CZ'){
              currency = 'CZK';
            }else if (countryCode == 'DK'){
              currency = 'DKK';
            }else if (countryCode == 'SG'){
              currency = 'SGD';
            }else if (countryCode == 'PH'){
              currency = 'PHP';
            }
            let currencyRate = result.rates[currency];
            let currencyData = `<p>1 GBP = ${currencyRate} ${currency}</p>`;
            let currencyExchangeDiv = $('#currencyExchange');
            currencyExchangeDiv.empty();
            currencyExchangeDiv.append(currencyData);
          });
      }else{
        currencyData = '';
      }