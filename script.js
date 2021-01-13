$(document).ready(function(){

    // METHOD FOR RETRIEVING WEATHER DATA ONCE SEARCH BUTTON IS CLICKED 
    $("#searchBtn").on("click", function(){
        var city = $("#userInput").val();
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=865d0d74e45ddea9b5eed9363a2a88ab" + "&units=imperial",
            method: "GET",
        }).then(function (response){

            $("#cityName").text(response.name);
            $("#temp").html("Temperature: " + response.main.temp.toFixed(1) + " <span>&#8457;</span>");
            $("#humidity").text(`Humidity: ${response.main.humidity}%`);
            $("#wind").text(`Wind Speed: ${response.wind.speed} MPH`);
            
            // METHOD FOR RETRIEVING UV INDEX
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=865d0d74e45ddea9b5eed9363a2a88ab`,
                method: "GET",
                success: function(response){
                    let uvIndex = response.current.uvi;
                    let uviColor = changeUviColor(uvIndex);
                    $("#uv").text(response.current.uvi)
                    $("#uv").attr('style', `background-color: ${uviColor}; color: ${uviColor === "yellow" ? "black" : "white"}`);
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
