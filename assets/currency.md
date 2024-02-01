let currency;
//console.log(countryCode);
if (countryCode != 'GB') {
//Set Base Exchange from GBP
let queryURLExchange = 'https://open.er-api.com/v6/latest/GBP';
fetch(queryURLExchange)
.then(function (response) {
return response.json();
}).then(function (result) {
if (countryCode == 'BE'
|| countryCode == 'BG'
|| countryCode == 'CZ'
|| countryCode == 'DK'
|| countryCode == 'DE'
|| countryCode == 'EE'
|| countryCode == 'IE'
|| countryCode == 'EL'
|| countryCode == 'ES'
|| countryCode == 'FR'
|| countryCode == 'HR'
|| countryCode == 'IT'
|| countryCode == 'CY'
|| countryCode == 'LV'
|| countryCode == 'LT'
|| countryCode == 'LU'
|| countryCode == 'HU'
|| countryCode == 'MT'
|| countryCode == 'NL'
|| countryCode == 'AT'
|| countryCode == 'PL'
|| countryCode == 'PT'
|| countryCode == 'RO'
|| countryCode == 'SI'
|| countryCode == 'SK'
|| countryCode == 'FI'
|| countryCode == 'SE'
) {
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
}else if (countryCode == 'IS'){
currency = 'ISK';
}else if (countryCode == 'NO'){
currency = 'NOK';
}else if (countryCode == 'LI'){
currency = 'CHF';
}else if (countryCode == 'CH'){
currency = 'CHF';
}else if (countryCode == 'BA'){
currency = 'BAM';
}else if (countryCode == 'ME'){
currency = 'EUR';
}else if (countryCode == 'MD'){
currency = 'MDL';
}else if (countryCode == 'MK'){
currency = 'MKD';
}else if (countryCode == 'GE'){
currency = 'GEL';
}else if (countryCode == 'AL'){
currency = 'ALL';
}else if (countryCode == 'RS'){
currency = 'RSD';
}else if (countryCode == 'TR'){
currency = 'TRY';
}else if (countryCode == 'UA'){
currency = 'UAH';
}else if (countryCode == 'XK'){
currency = 'EUR';
}else if (countryCode == 'AM'){
currency = 'AMD';
}else if (countryCode == 'BY'){
currency = 'BYN';
}else if (countryCode == 'AZ'){
currency = 'AZN';
}else if (countryCode == 'DZ'){
currency = 'DZD';
}else if (countryCode == 'LB'){
currency = 'LBP';
}else if (countryCode == 'SY'){
currency = 'SYP';
}else if (countryCode == 'EG'){
currency = 'EGP';
}else if (countryCode == 'LY'){
currency = 'LYD';
}else if (countryCode == 'TN'){
currency = 'TND';
}else if (countryCode == 'IL'){
currency = 'ILS';
}else if (countryCode == 'MA'){
currency = 'MAD';
}else if (countryCode == 'JO'){
currency = 'JOD';
}else if (countryCode == 'PS'){
currency = 'ILS';
}else if (countryCode == 'AR'){
currency = 'ARS';
}else if (countryCode == 'AU'){
currency = 'AUD';
}else if (countryCode == 'BR'){
currency = 'BRL';
}else if (countryCode == 'CA'){
currency = 'CAD';
}else if (countryCode == 'CN_X_HK'){
currency = 'CNY';
}else if (countryCode == 'HK'){
currency = 'HKD';
}else if (countryCode == 'IN'){
currency = 'INR';
}else if (countryCode == 'JP'){
currency = 'JPY';
}else if (countryCode == 'MX'){
currency = 'MXN';
}else if (countryCode == 'NG'){
currency = 'NGN';
}else if (countryCode == 'NZ'){
currency = 'NZD';
}else if (countryCode == 'RU'){
currency = 'RUB';
}else if (countryCode == 'SG'){
currency = 'SGD';
}else if (countryCode == 'ZA'){
currency = 'ZAR';
}else if (countryCode == 'KR'){
currency = 'KRW';
}else if (countryCode == 'TW'){
currency = 'TWD';
}else if (countryCode == 'UK'){
currency = 'GBP';
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
