const tenDayForecast = document.getElementById("tenDayForecast");


const apiKey = "be96fa9bd95b7ba44b77b0087a668a30";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const input = document.querySelector("#inputField");
const searchButton = document.querySelector("#searchButton");


const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";





async function getWeather(city){

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);


    if(response.status == 404){
        alert("invalid input");
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
        document.querySelector(".wind").innerHTML = data.wind.speed + " kph" ;

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

        //change bg
        const currentTime = data.dt;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;

        const isDay = currentTime >= sunrise && currentTime < sunset

        let weatherType;

        switch(data.weather[0].main){

            case "Clear":
                weatherType = "clear";
                break;

            case "Clouds":
                weatherType = "cloudy";
                break;

            default:
                weatherType = "rain";
        }

        const time = isDay ? "day" : "night";

        const videoFile =`./${weatherType}_${time}.mp4`;


        dayForecast.innerHTML = " ";
        for(let i = 0; i < 8; i++){
            const hour = forecastData.list[i];
            const time = hour.dt_txt.split(" ")[1].slice(0, 5);

            const card = document.createElement("div");
            card.classList.add("hourCard");

            const icon = hour.weather[0].icon;
            const iconUrl =`https://openweathermap.org/img/wn/${icon}@2x.png`;

            const icon1 = data.weather[0].icon;
            const iconUrl1 = `https://openweathermap.org/img/wn/${icon1}@4x.png`;

            const weatherImage = document.querySelector("#weatherImg");
            weatherImage.src = iconUrl1;

            card.innerHTML = `
                                <h1>${time}</h1>
                                <img src="${iconUrl}" class="hourWeatherIcon">
                                <h1>${Math.round(hour.main.temp)}°</h1>`;

            dayForecast.appendChild(card);

        }


        tenDayForecast.innerHTML = "<h1>5 DAY FORECAST</h1>";
        for (let i = 0; i < forecastData.list.length; i += 8){
            
            const day = forecastData.list[i];

            const date = new Date(day.dt * 1000);

            const dayName = date.toLocaleDateString("en-US",{
                weekday: "short"
            });

            const card = document.createElement("div");
            card.classList.add("dayCard");

            const dayicon = day.weather[0].icon;
            const dayiconUrl = `https://openweathermap.org/img/wn/${dayicon}@2x.png`;

            card.innerHTML = `  <div class="forecastLeft">
                                    <h3>${dayName}</h3>
                                </div>

                                <div class="forecastCenter">
                                    <img src="${dayiconUrl}" class="dayWeatherIcon">
                                    <span>${Math.round(day.pop * 100)}%</span>
                                </div>

                                <div class="forecastRight">
                                    <h3>H ${Math.round(day.main.temp_max)}°</h3>
                                    <h3>L ${Math.round(day.main.temp_min)}°</h3>
                                </div>`;
            tenDayForecast.appendChild(card);

        }

        if(!bgVideo.src.includes(videoFile))
        {
            bgVideo.style.opacity = 0;

            setTimeout(() => {

                bgVideo.src = videoFile;
                bgVideo.load();

                bgVideo.onloadeddata = () => {
                    bgVideo.play();
                    bgVideo.playbackRate = 0.8;
                    bgVideo.style.opacity = 1;
                };

            }, 300);
        }



    }
   return data;
}

searchButton.addEventListener("click",async ()=>{

    const city = input.value;

    if(city === ""){
        return;
    }

    getWeather(city);

    if(!cities.includes(city)){

        cities.push(city);

        const card = document.createElement("div");
        card.classList.add("newCityCard");
        
        const weather = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const cityData = await weather.json();

        const icon = cityData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

        card.innerHTML =`<div class="cityInfo">
                            <h3>${cityData.name}</h3>
                        </div>

                        <img src="${iconUrl}" class="savedCityIcon">

                        <h2>${Math.round(cityData.main.temp)}°</h2>`;

        card.addEventListener("click", ()=>{
            getWeather(city);
        });

        savedCities.appendChild(card);
    }

    input.value = "";
});

const toggleButton = document.querySelector("#toggleButton");
const sideCard = document.querySelector("#sideCard");
const background = document.getElementById("background");

toggleButton.addEventListener("click",()=>{
    sideCard.classList.toggle("collapsed");
    background.classList.toggle("collapsed");
})


//storing new cities
let cities =[];
const savedCities = document.querySelector(".savedCities");
