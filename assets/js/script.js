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

let cityContainer = document.querySelector("#previous-searches");

// array to hold previously entered cities
let citiesArr = [];

// function to display the dates upon page load
$(document).ready(function() {
    // set variable for date
    let currentDate = moment().format("dddd, MMM Do YYYY");
    $("#current-day").html("(" + currentDate + ")");

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
        // push city to the array and save to local storage
        citiesArr.push(cityName);
        saveCities();
        // call function to create an element for the city
        displayCityLinks();
        // send the imput to the getWeatherData function
        getWeatherData(cityName);
        // reset the value 
        cityInput.value = "";
    }
};

// call the current weather data api when a city is entered
var getWeatherData = function (city) {
    // format the api url
    var apiUrl = fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=459a5e31598a1077257e521e66bb2960");
    console.log(apiUrl);
};

// function to load previously saved cities and print new ones to the page as they are added
let displayCityLinks = function() {
    // clear container of items
    cityContainer.textContent = "";
    // load saved cities from local storage
    citiesArr = JSON.parse(localStorage.getItem("citiesArr"));
    console.log(citiesArr);
    // loop over the array to create link containers for each saved city
    for (let i=0; i < citiesArr.length; i++) {
        
        // create link element
        var cityEl = document.createElement("a");
        cityEl.classList = "list-item flex-row";
        cityEl.setAttribute("href", "http://api.openweathermap.org");
        
        // create span element to hold city name
        var cityName = document.createElement("span");
        cityName.textContent = citiesArr[i];

        // append to container
        cityEl.appendChild(cityName);

        cityContainer.appendChild(cityEl);
    }
};

let saveCities = function() {
    localStorage.setItem("citiesArr", JSON.stringify(citiesArr));
};

userFormEl.addEventListener("submit", submitButtonHandler);
// getWeatherData();
displayCityLinks();