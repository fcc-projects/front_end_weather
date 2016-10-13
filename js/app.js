$(document).ready(function () {

    var coordinates;
    var weather;
    var temperature; //temperature in Celcius
    var location;
    var is_celcius = true;

    getLocation();

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(queryWrapper, showError);

        } else {
            $('error_notice').text("Geolocation is not supported by this browser.");
        }
    }

    function queryWrapper(position) {
        getCoordinates(position)
        queryApi(buildUri(coordinates, "1e04afc8abdcfdc9e9b3cc8bbfa91791"));

    }

    function getCoordinates(position) {
        coordinates = "lat=" + position.coords.latitude +
                            "&lon=" + position.coords.longitude;
    }

    function showError(error) {

        var error_notice = $('.error_notice');

        switch(error.code) {
            case error.PERMISSION_DENIED:
                error_notice.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                error_notice.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                error_notice.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                error_notice.innerHTML = "An unknown error occurred."
                break;
        }
    }

    function buildUri(location_str, api_key) {
        var uri = "http://api.openweathermap.org/data/2.5/weather?" + location_str + "&appid=" + api_key;
        return uri;
    }

    function queryApi(uri) {
        console.log("queryApi");
        $.ajax({
            dataType: "json",
            url: uri,
            success: function(response) {
                console.log(response);
                var data = response;
                location = data["name"];
                weather = data["weather"][0]["description"];
                temperature = (data["main"]["temp"] - 273.15).toFixed(1);

                var weather_code = data["cod"];
                setIcon(weather_code);
                setTemp(temperature);
                setWeather(weather);
                setLocation(location);
                setUnit();
            }
        })
    }

    function setIcon(code) {
        $('.owf').addClass('owf-' + code);
    }

    function setLocation(loc) {
        $('.loc-container').text(loc);
    }

    function setTemp(temp_c) {
        if (is_celcius) {
            $('.temp-container').text(temp_c);
        } else {
            $('.temp-container').text(celToFahr(temp_c));
        }
    }

    function setWeather(weather) {
        $('.weather-container').text(weather);
    }

    function setUnit() {
        if (is_celcius) {
            $('.unit-container').text(String.fromCharCode(176) + "C")
        } else {
            $('.unit-container').text(String.fromCharCode(176) + "F")
        }
    }
    function celToFahr(temp) {
        return (temp * (9.0 / 5.0) + 32).toFixed(1);
    }

    function fahrToCel(temp) {
        return (temp - 32 * (5.0 / 9.0)).toFixed(1);
    }

    $('.unit-container').click( function() {
        is_celcius = !is_celcius;
        setUnit();
        setTemp(temperature);
    });


});