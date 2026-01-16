
// ================== CONFIG ==================
const weatherApi = {
  key: "4eb3703790b356562054106543b748b2", // move to env variable if possible
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

// ================== DOM ELEMENTS ==================
const elements = {
  input: document.getElementById("input-box"),
  body: document.getElementById("weather-body"),
  parent: document.getElementById("parent"),
};

// ================== EVENT LISTENERS ==================
elements.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherReport(elements.input.value.trim());
  }
});

window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) getWeatherReport(lastCity);
});

// ================== FETCH WEATHER ==================
async function getWeatherReport(city) {
  if (!city) {
    swal("Empty Input", "Please enter a city name", "error");
    return;
  }

  try {
    const response = await fetch(
      `${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    localStorage.setItem("lastCity", city);
    showWeatherReport(data);
  } catch (error) {
    swal("City Not Found", "Please enter a valid city name", "warning");
  } finally {
    reset();
  }
}

// ================== DISPLAY WEATHER ==================
function showWeatherReport(weather) {
  elements.body.style.display = "block";

  const today = new Date();

  elements.body.innerHTML = `
    <div class="location-details">
      <div class="city">${weather.name}, ${weather.sys.country}</div>
      <div class="date">${formatDate(today)}</div>
    </div>

    <div class="weather-status">
      <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>
      <div class="weather">
        ${weather.weather[0].main}
        <i class="${getIconClass(weather.weather[0].main)}"></i>
      </div>
      <div class="min-max">
        ${Math.floor(weather.main.temp_min)}&deg;C (min) /
        ${Math.ceil(weather.main.temp_max)}&deg;C (max)
      </div>
      <div class="updated">
        Updated as of ${formatTime(today)}
      </div>
    </div>

    <hr>

    <div class="day-details">
      <div class="basic">
        Feels like ${weather.main.feels_like}&deg;C |
        Humidity ${weather.main.humidity}% <br>
        Pressure ${weather.main.pressure} mb |
        Wind ${weather.wind.speed} km/h
      </div>
    </div>
  `;

  elements.parent.append(elements.body);
  changeBackground(weather.weather[0].main);
}

// ================== UTIL FUNCTIONS ==================
function formatTime(date) {
  return `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

function formatDate(date) {
  const days = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday",
  ];

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]}), ${date.getFullYear()}`;
}

function addZero(value) {
  return value < 10 ? `0${value}` : value;
}

function reset() {
  elements.input.value = "";
}

// ================== BACKGROUND & ICONS ==================
const weatherMap = {
  Clouds: { bg: "clouds.jpg", icon: "fas fa-cloud" },
  Rain: { bg: "rainy.jpg", icon: "fas fa-cloud-showers-heavy" },
  Clear: { bg: "clear.jpg", icon: "fas fa-cloud-sun" },
  Snow: { bg: "snow.jpg", icon: "fas fa-snowman" },
  Sunny: { bg: "sunny.jpg", icon: "fas fa-sun" },
  Thunderstorm: { bg: "thunderstorm.jpg", icon: "fas fa-bolt" },
  Drizzle: { bg: "drizzle.jpg", icon: "fas fa-cloud-rain" },
  Mist: { bg: "mist.jpg", icon: "fas fa-smog" },
  Haze: { bg: "mist.jpg", icon: "fas fa-smog" },
  Fog: { bg: "mist.jpg", icon: "fas fa-smog" },
};

function changeBackground(status) {
  const bg = weatherMap[status]?.bg || "bg1.jpg";
  document.body.style.backgroundImage = `url('./${bg}')`;
}


function getIconClass(status) {
  return weatherMap[status]?.icon || "fas fa-cloud-sun";
}


