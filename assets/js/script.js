/* ***************** Weather Data App **************** 

 1. Upon initial page load, display the current date along with the dates of the next 5 days
 2. Listen for an input of a city name and a click of the button to return weather data
 3. Upon click save the input to local storage and create a link to save this city to the page
 4. Insert the city name into an api call to retrieve weather data for both the current day and the forecast
        4a. Due to the api organization, we will have to first call the weather api from the database, then pull the 
            city coordinates from the api, and then input those into the one call api to retreive the rest of the data
 5. For the current day, retrieve the temp, humidity, wind speed, and uv index
        5a. Use the description from the data pack to pass through a function determining which weather icon to display
        5b. Pass UV index through a function to determine what color the background should be
 6. For the five day forecast, retrieve the description, temp, and humidity for the next 5 days
        6b. Pass the descriptoon through the function created in 5a to determine the icon for each day

*/

// variable to listen to city entered
let userFormEl = document.querySelector("#city-form");
let cityInput = document.querySelector('#city');

let cityContainer = document.querySelector(".previous-searches");

let currentDate;
// array to hold previously entered cities
let citiesArr = [];

// function to display the dates upon page load
$(document).ready(function() {
    // set variable for date
    currentDate = moment().format("dddd, MMM Do YYYY");
    $("#current-day").html("Today is " + currentDate);

    // get the next 5 days for the forecast by looping over them
    for (let i=1; i<=5; i++) {
        let forecast = moment().add(i, 'days').format("MM/DD/YYYY");
        // attach date to each card header
        $('.day-' + i).html(forecast);
    }
});

// button to read city name
let submitButtonHandler = function(event) {
    event.preventDefault();

    let cityName = cityInput.value.trim();

    if (cityName) {

        citiesArr = JSON.parse(localStorage.getItem("citiesArr"));
        // if local storage is empty, create an empty array
        if (!citiesArr) {
            citiesArr = [];
        }
        // push city to the array and save to local storage
        citiesArr.push(cityName);
        saveCities();
        // call function to create an element for the city
        displayCityButtons();
        // send the imput to the getWeatherData function
        getCityCoordinates(cityName);
        // reset the value 
        cityInput.value = "";
    } else {
        alert("Please enter a valid city!");
    }
};

// function to load previously saved cities and print new ones to the page as they are added
let displayCityButtons = function() {
    // clear container of items
    cityContainer.textContent = "";
    // load saved cities from local storage
    citiesArr = JSON.parse(localStorage.getItem("citiesArr"));

    // run loop if there are stored city values
    if (citiesArr) {
        // loop over the array to create link containers for each saved city
        for (let i=0; i < citiesArr.length; i++) {
            
            // create link element
            var cityEl = document.createElement("button");
            cityEl.classList = "cityBtn flex-row";
            cityEl.setAttribute('id', citiesArr[i]);
            cityEl.textContent = citiesArr[i];
            // append to container
            cityContainer.appendChild(cityEl);
        }
    }
};

// one of the buttons of previous cities was clicked
$(".previous-searches").on('click', 'button.cityBtn', function() {
    // determine the button id
    var citySelection = $(this).attr('id');
    // run this through the city coordinates function
    getCityCoordinates(citySelection);
});

// call the current weather data api when a city is entered
let getCityCoordinates = function (city) {
    // format the api url
    let apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=459a5e31598a1077257e521e66bb2960";
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // retrieve the city coordinates and send them to the getweatherdata function
                let cityLatitude = data.coord.lat;
                let cityLongitude = data.coord.lon;
                getWeatherData(cityLatitude, cityLongitude); 

                // print the city name and date to the page
                let cityTitle = data.name;
                $('#city-search-term').html(cityTitle + " Weather for " + currentDate);

                // retrieve the weather icon
                let weatherIcon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
                $('#weather-icon').attr('src', weatherIcon);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

let getWeatherData = function(lat, lon) {
    // format the api url
    let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=459a5e31598a1077257e521e66bb2960"

    fetch(weatherApiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // send to function to create the html
                displayWeatherData(data);
            });
        }
    });
};

// function to display all of the weather data on the page
let displayWeatherData = function(data) {

    // retrieve temperature
    let currentTemp = data.current.temp;
    $('.current-temperature').html(currentTemp + " \u00B0 F");
    // retrieve humidity
    let currentHumidity = data.current.humidity;
    $('.current-humidity').html(currentHumidity + " %");
    // retrieve wind speed
    let windSpeed = data.current.wind_speed;
    $('.current-wind').html(windSpeed + " MPH");
    // retrieve uv index
    let currentUv = data.current.uvi;
    $('.current-uv').html(currentUv);

    // for the daily weather data, loop over each day
    for (let i=1; i <= 5; i++) {
        // retrieve weather icon
        let forecastIcon = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
        $('.weather-img-' + i).attr('src', forecastIcon);
        // retrieve temp
        let forecastTemp = data.daily[i].temp.day;
        $('#day-' + i).html(forecastTemp + " \u00B0 F");
        // retrieve humidity
        let forecastHumidity = data.daily[i].humidity;
        $('#' + i).html(forecastHumidity + " %");
    }
}

// save function
let saveCities = function() {
    localStorage.setItem("citiesArr", JSON.stringify(citiesArr));
};

userFormEl.addEventListener("submit", submitButtonHandler);
// getWeatherData();
displayCityButtons();