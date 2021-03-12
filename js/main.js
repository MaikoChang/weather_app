const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const tempMinElement = document.querySelector(".temperature-min p");
const tempMaxElement = document.querySelector(".temperature-max p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const humidityElement = document.querySelector(".humidity-value p");

const weather = {};

weather.temperature = {
    unit : "fahrenheit"
}

weather.humidity = {
    unit : "%"
}
const KELVIN = 273.15

const key = "fc61888b0d48be83d3fb53898a59077c";

if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<P>Browser doesn't Support Geolocation</p>";
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<P> ${error.message} </p>`;

}

function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(((data.main.temp - KELVIN)* 9/5) + 32);
            weather.temperature.min = Math.floor(((data.main.temp_min - KELVIN)* 9/5) + 32);
            weather.temperature.max = Math.floor(((data.main.temp_max - KELVIN)* 9/5) + 32);
            weather.humidity.value = data.main.humidity;
            weather.description = data.weather[0].description;
            weather.iconID = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;
    tempMinElement.innerHTML = `L: ${weather.temperature.min}°<span>F</span>`;
    tempMaxElement.innerHTML = `H: ${weather.temperature.max}°<span>F</span>`;
    humidityElement.innerHTML = `Humidity: ${weather.humidity.value}<span>%`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`; 
}

