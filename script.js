$(document).ready(function(){
    // SETTING VARIABLES
    let listItem = []; 
    city = $("#userInput").val();
    
    // CALL TO DISPLAY LAST SEARCHED CITY
    lastCity();
     
    // CALL TO RETRIEVE SEARCHED CITY WHEN PAGE LOADS | Search History
     storeCities();
     
     // CALL TO DISPLAY SEARCHED CITIES WHEN PAGE LOADS | Search History
     showCities(listItem);

     // METHOD FOR SAVING SEARCHED CITY TO LOCAL STORAGE | Search History
     function searchHistory(){
        localStorage.setItem("citySearch", JSON.stringify(listItem));
    };

    // METHOD FOR RETRIEVING SEARCHED CITY FROM LOCAL STORAGE | Search History
    function storeCities(){
        const storedCities = JSON.parse(localStorage.getItem("citySearch"));
        if (storedCities){
            listItem = storedCities;
        }
    }

    //METHOD FOR DISPLAYING SEARCHED CITY | Search History
    function showCities(listItem){
        listItem.splice(5);
        let sortCities = [...listItem];
        sortCities.forEach(function (city){
            let historyList = $('<li>').addClass('list-group-item city');
            let anchor = $('<a>').addClass('btn btn-light cityLink').text(city);
            historyList.append(anchor)
            $('.list-group').append(historyList)
        })
    }

    // METHOD FOR CREATING URL FOR API CALL
    function buildURL (city) {
        if (city) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=865d0d74e45ddea9b5eed9363a2a88ab&units=imperial`;
        }
    }

    // METHOD FOR CHANGING UV INDEX COLOR ACCORDING TO EPA COLOR SCALE | CITY INFO
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

    // METHOD TO SEARCH CITY 
    function searchFunction(query) { 
        $.ajax({
            url: query,
            method: "GET",
        }).then(function (response){

            // METHOD TO BUILD ARRAY FOR SEARCH HISTORY
            let search = response.name;
            if (listItem[0]) {
                listItem = $.grep(listItem, function (a) {
                    return search == a.search
                })
            }
            listItem.unshift(search);

            // CALL TO POPULATE SEARCH HISTORY
            searchHistory();

            // CALL TO DISPLAY SEARCHED CITIES
            showCities(listItem);

            // METHOD FOR CURRENT DAY WEATHER 
            $("#cityName").html(response.name + " (" + moment.unix(response.dt).format('L') + ")");
            $("img#icon").attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`).attr("alt", response.weather[0].description);
            $("#temp").html("Temperature: " + response.main.temp.toFixed(1) + " <span>&#8457;</span>");
            $("#humidity").text(`Humidity: ${response.main.humidity}%`);
            $("#wind").text(`Wind Speed: ${response.wind.speed} MPH`);
            
            // METHOD FOR RETRIEVING UV INDEX & 5 DAY FORECAST
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=865d0d74e45ddea9b5eed9363a2a88ab&units=imperial`,
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
                        $(`div.day${i} .forecastImg`).attr("src", `https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}.png`).attr("alt", forecastDay.weather[0].description);
                        $(`div.day${i} .forecastTemp`).html(`Temp: ${forecastDay.temp.day.toFixed(1)} <span>&#8457;</span>`);
                        $(`div.day${i} .forecastHumidity`).text(`Humidity: ${forecastDay.humidity}%`);
                               
                    }
                }
            });  

        });    
    };

    // METHOD TO DISPLAY LAST SEARCH CITY
    function lastCity() {
        if(listItem[0]){
            let query = buildURL(listItem[0].search)
            searchFunction(query)
        } else {
            let query = buildURL("Detroit");
            searchFunction(query);
        }
    }
    
    // METHOD FOR RETRIEVING WEATHER DATA ONCE SEARCH BUTTON IS CLICKED 
    $("#searchBtn").on("click", function(event){
        event.preventDefault();
        let city = $("#userInput").val(); 
        $("#userInput").val("");
        let query = buildURL(city)
        searchFunction(query);
    });

    // METHOD FOR RETRIEVING WEATHER DATA FOR CITIES IN SEARCH HISTORY
    $(document).on("click", ".cityLink", function (event) {
        let city = $(this).text();
        let query = buildURL(city);
        searchFunction(query)
    })

});
