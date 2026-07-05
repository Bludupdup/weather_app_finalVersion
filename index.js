const tenDayForecast = document.getElementById("tenDayForecast");

const days = [
    "Today",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon"
];

for (let i = 0; i < 7; i++) {
    const card = document.createElement("div");
    card.classList.add("dayCard");

    card.innerHTML = `
        <h1>${days[i]}</h1>

        <div class="preciCard">
            <h1>☁️</h1>
            <h1>60%</h1>
        </div>

        <h1>${27 + i % 3}°</h1>
    `;

    tenDayForecast.appendChild(card);
}

//


const apiKey = "be96fa9bd95b7ba44b77b0087a668a30";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const input = document.querySelector("#inputField");
const searchButton = document.querySelector("#searchButton");


const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";





async function getWeather(city){

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);


    if(response.status == 404){
        alert("invalid inoput");
        return;
    }else{

        var data = await response.json();
        console.log(data);

        const forecastData = await forecastResponse.json();

        document.querySelector("#cityName").innerHTML = data.name;
        document.querySelector("#temperature").innerHTML = Math.round(data.main.temp) +"℃";
        document.querySelector('#currentCondition').innerHTML = data.weather[0].main;
        document.querySelector("#high").innerHTML = "H: " + data.main.temp_max + "°";
        document.querySelector("#low").innerHTML = "L: " + data.main.temp_min + "°";

        document.querySelector("#humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed ;

        document.querySelector("#feelsLikeTemp").innerHTML = data.main.feels_like + "°";
        document.querySelector("#pressure").innerHTML = data.main.pressure + " hPa";

        var sunsetUTC = data.sys.sunset;
        var timezoneOffset = data.timezone;
        var cityDate = new Date((sunsetUTC + timezoneOffset)  * 1000);
        let hours = cityDate.getUTCHours();
        let minutes = cityDate.getUTCMinutes();

        const period = hours >= 12 ? "PM" : "AM";

        hours = hours % 12;
        hours = hours || 12;

        minutes = minutes.toString().padStart(2, "0");

        const sunsetTime = `${hours}:${minutes} ${period}`;

        document.querySelector("#sunsetTime").innerHTML = sunsetTime;

        document.querySelector("#visibility").innerHTML = `${(data.visibility / 1000).toFixed(1)} km`;

        dayForecast.innerHTML = " ";
        for(let i = 0; i < 8; i++){
            const hour = forecastData.list[i];
            const time = hour.dt_txt.split(" ")[1].slice(0, 5);

            const card = document.createElement("div");
            card.classList.add("hourCard");

        card.innerHTML = `
                            <h1>${time}</h1>
                            <h1>${hour.weather[0].main}</h1>
                            <h1>${Math.round(hour.main.temp)}°</h1>`;

        dayForecast.appendChild(card);

        }


        tenDayForecast.innerHTML = "<h1>5 DAY FORECAST</h1>";
        for (let i = 0; i < forecastData.list.length; i += 8){
            
            const day = forecastData.list[i];

            const date = new Date(day.dt * 1000);

            const dayName = date.toLocaleDateString("en-US",{
                weekday: "long"
            });

            const card = document.createElement("div");
            card.classList.add("dayCard");

            card.innerHTML = `<h1>${dayName}</h1>
                            <div class="preciCard">
                                <h1>${day.weather[0].main}</h1>
                                <h1>${Math.round(day.pop * 100)}%</h1>
                            </div>
                            <div>
                            <h1>H: ${Math.round(day.main.temp_max)}°</h1>
                            <h1>L: ${Math.round(day.main.temp_min)}°</h1>

                            </div>`;
            tenDayForecast.appendChild(card);

        }

    }
   
}

searchButton.addEventListener("click", ()=>{

    const city = input.value;

    if(city === ""){
        return;
    }

    getWeather(city);

    if(!cities.includes(city)){

        cities.push(city);

        const card = document.createElement("div");
        card.classList.add("newCityCard");
        card.textContent = city;

        card.addEventListener("click", ()=>{
            getWeather(city);
        });

        savedCities.appendChild(card);
    }

    input.value = "";
});

const toggleButton = document.querySelector("#toggleButton");
const sideCard = document.querySelector("#sideCard");

toggleButton.addEventListener("click", ()=>{
    sideCard.classList.toggle("collapsed");
})

//storing new cities
let cities =[];
const savedCities = document.querySelector(".savedCities");
