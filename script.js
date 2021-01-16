$(document).ready(function(){

    // METHOD FOR RETRIEVING WEATHER DATA ONCE SEARCH BUTTON IS CLICKED 
    $("#searchBtn").on("click", function(){
        var city = $("#userInput").val();
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=865d0d74e45ddea9b5eed9363a2a88ab" + "&units=imperial",
            method: "GET",
        }).then(function (response){

            // METHOD FOR CURRENT DAY WEATHER 
            $("#cityName").html(response.name + " (" + moment.unix(response.dt).format('L') + ")");
            $("img#icon").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`);
            $("#temp").html("Temperature: " + response.main.temp.toFixed(1) + " <span>&#8457;</span>");
            $("#humidity").text(`Humidity: ${response.main.humidity}%`);
            $("#wind").text(`Wind Speed: ${response.wind.speed} MPH`);
            
            // METHOD FOR RETRIEVING UV INDEX & 5 DAY FORECAST
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=865d0d74e45ddea9b5eed9363a2a88ab`,
                method: "GET",
                success: function(response){
                    let uvIndex = response.current.uvi;
                    let uviColor = changeUviColor(uvIndex);
                    $("#uv").text(response.current.uvi);
                    $("#uv").attr('style', `background-color: ${uviColor}; color: ${uviColor === "yellow" ? "black" : "white"}`);
            

                    let dailyForecast = response.daily;
                    for (i = 0; i <= 5; i++) {
                        let forecastDay = dailyForecast[i];
                        $(`div.day${i} .date`).text(moment.unix(forecastDay.dt).format('L'));
                        $(`div.day${i} .forecastImg`).attr("src", `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}.png`);
                        $(`div.day${i} .forecastTemp`).html(`Temp: ${forecastDay.temp.day.toFixed(1)} <span>&#8457;</span>`);
                        $(`div.day${i} .forecastHumidity`).text(`Humidity: ${forecastDay.humidity}%`);
                    }
                }
            });  
        });    
    });

    // METHOD FOR CHANGING UV INDEX COLOR ACCORDING TO EPA COLOR SCALE
    function changeUviColor(uvi) {
        if (uvi < 3) {
            return 'green';
        } else if (uvi >= 3 && uvi < 6) {
            return 'yellow';
        } else if (uvi >= 6 && uvi < 8) {
            return 'orange';
        } else if (uvi >= 8 && uvi < 11) {
            return 'red';
        } else return 'purple';
    };
      
});
