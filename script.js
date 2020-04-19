$(document).ready(function () {
  var cityList = [];
  $("#searchBtn").on("click", function () {
    ///get value of what is in the input
    let city = $("#searchCity").val();
    //clear input box
    $("#searchCity").val("");
    //pass the variable into a function to run your ajax call and call that function
    currentCondition(city);
  });
  //cityList on click ot pass in the city to search weather function with api
  $(".cityList").on("click", "li", function () {
    currentCondition($(this).text());
  });

  ///function to append new cities
  function createList(text) {
    var li = $("<li>").addClass("list-group-item").text(text);
    $(".cityList").prepend(li);
  }

  //current date
  var today = moment().format("MM/DD/YYYY");

  ///current condition includes ajax call and then .then fucntion .success to tell app where/how to place items on the screen
  //api key
  function currentCondition(city) {
    var APIKey = "c55a69a863d405f6eb7cfe74c3391a16";

    //Url to query database

    var queryUrl =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey;

    $.ajax({
      url: queryUrl,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      console.log(response);
      //check in buttons  for the value
      if (cityList.indexOf(city) === -1) {
        cityList.push(city);
        /// add it to local storage
        window.localStorage.setItem("cityList", JSON.stringify(cityList));
        //call create list function and pass in the city
        createList(city);
      }
      $("#currentCity").empty();
      //call the function to append the new buttons
      //empty the daily contect to load city that has been searched

      //create the html contect for daily weather by taking the response index

      var card = $("<div>").addClass("card");
      console.log(card);
      //card body to attatch this to
      var cardbody = $("<div>").addClass("card-body");

      //title for csard
      var title = $("<h3>")
        .addClass("card-title")
        .text(
          response.name + " " + "(" + new Date().toLocaleDateString() + ")"
        );
      //img icon for each card
      var image = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );

      function KtoF(temp) {
        return (temp - 273.15) * 1.8 + 32;
      }

      //temp and humidity
      var temp = $("<p>")
        .addClass("card-text")
        .text("Temperature: " + KtoF(response.main.temp).toFixed(2) + "°F");
      var hum = $("<p>")
        .addClass("card-text")
        .text("Humidity: " + response.main.humidity + "%");
      var wind = $("<p>")
        .addClass("card-text")
        .text("Wind: " + response.wind.speed + " MPH");

      //take the column and append it to the the card then card body then append the tittle

      title.append(image);
      console.log(image);
      // take the card body and append the title temp humidity and windspeed
      cardbody.append(title, temp, hum, wind);
      console.log(title);
      //take the cardbody and append it to the card
      card.append(cardbody);
      console.log(card);
      //append the card to the id it needs to be placed
      $("#currentCity").append(card);

      //call other two functions for ajax calls for the forecast pass in the city and  UX index pass in lon and lat
      fiveDayForecast(city);

      //getuvIndex(response.coord.lat, response.coord.lon);
    });
  }

  function fiveDayForecast(city) {
    var APIKey = "c55a69a863d405f6eb7cfe74c3391a16";

    var queryUrl =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey;

    $.ajax({
      url: queryUrl,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      console.log(response);

      $("#forecast5").empty();

      for (var i = 0; i <= 4; i++) {
        console.log(i);

        var forecastDate = moment()
          .add(1 + i, "days")
          .format("MM/DD/YYY");
        var forecastIcon = response.list[i].weather[0].icon;
        var forecastTemp = Math.round(response.list[i].main.temp);
        var forecastHum = response.list[i].main.humidity;

        if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          //small columns for each card
          var columns = $("<div>").addClass("col-md-2");
          //a card to load blue card with white text
          var card = $("<div>").addClass("card bg-primary text-white");
          //card body to attatch this to
          var cardbody = $("<div").addClass("card-body");
          //title for csard
          var title = $("<h>")
            .addClass("card-title")
            .text(new Date(response.list[i].dt_txt).toLocaleDateString());
          //img icon for each card
          var image = $("<img>").attr(
            "src",
            "http://openweathermap.org/img/w/" +
              response.list[i].weather[0].icon +
              ".png"
          );
          //temp and humidity
          var temp = $("<p>")
            .addClass("card-text")
            .text("Temperature" + response.list[i].main.temp);
          var hum = $("<p>")
            .addClass("card-text")
            .text("Humidity" + response.list[i].main.humidity);
          //take the column and append it to the the card then card body then append the tittle

          columns.append(card.append(cardbody.append(title, image, temp, hum)));
        }
        //}

        // console.log(response);

        function KtoF(temp) {
          return (temp - 273.15) * 1.8 + 32;
        }
      }
    });
  }

  function getuvIndex(lat, lon) {
    var UVIndex =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;
    $.ajax({
      url: UVIndex,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      ///the uv index that is the text of the response

      //button in span tag with the response value

      //if else statement to color the button depending on the UX index
      var UVIndex = $("<p>").text("UVIndex");
      //but variable in a span tag with the bootsrap class of small but and response.valu
      var btn = $("<span>").addClass(" btn btn-sm").text(response.value);
      $("#currentCity .card-body").append(UVIndex.append(btn));

      function KtoF(temp) {
        return (temp - 273.15) * 1.8 + 32;
      }

      ///the output of this function will be appended to current city
    });
  }
  /// get the city if any and upload it to the page
  //decalre city list variable and use JSOn parse to the item from local storage
  if (localStorage.getItem("cityList")) {
    cityList = JSON.parse(window.localStorage.getItem("cityList") || []);
    //only add it cityList legth is greater than 0

    if (cityList.length > 0) {
      currentCondition(cityList[cityList.length - 1]);
    }
    //for loop to create the list with the city list index

    for (var i = 0; i < cityList.length; i++) {
      createList(cityList[i]);
    }
  }
});

$(document).on("click", ".city", function () {
  var city = $(this).attr("data-name");
  currentCondition(city);
  fiveDayForecast(city);
});
