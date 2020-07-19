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
    var li = $("<li>")
      .addClass("list-group-item list-group-item-action")
      .text(text);
    $(".cityList").prepend(li);
  }
  //current date
  var today = moment().format("MM/DD/YYYY");
  ///current condition includes ajax call and then .then fucntion .success to tell app where/how to place items on the screen
  //api key
  function currentCondition(city) {
    var APIKey = "4283d387c93df34e548fe4d99a04d307";
    //Url to query database
    var queryUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey;
    $.ajax({
      url: queryUrl,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
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
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
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
      // take the card body and append the title temp humidity and windspeed
      cardbody.append(title, temp, hum, wind);
      //take the cardbody and append it to the card
      card.append(cardbody);
      //append the card to the id it needs to be placed
      $("#currentCity").append(card);
      //call other two functions for ajax calls for the forecast pass in the city and  UX index pass in lon and lat
      fiveDayForecast(city);
      getuvIndex(response.coord.lat, response.coord.lon);
    });
  }
  function fiveDayForecast(city) {
    var APIKey = "4283d387c93df34e548fe4d99a04d307";
    var queryUrl2 =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;
    $.ajax({
      url: queryUrl2,
      method: "GET",
      dataType: "json",
      success: function (response) {
        $("#forecast")
          .html('<h4 class="mt-3">5-Day Forecast: </h4>')
          .append('<div class="row">');
        //loop over all forecasts
        for (var i = 0; i < response.list.length; i++) {
          if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            //small columns for each card
            var columns = $("<div>").addClass("col-md-2");
            //a card to load blue card with white text
            var card = $("<div>").addClass("card bg-primary text-white");
            //card body to attatch this to
            var cardbody = $("<div>").addClass("card-body p-2");
            //title for csard
            var title = $("<h5>")
              .addClass("card-title")
              .text(new Date(response.list[i].dt_txt).toLocaleDateString());
            // console.log(response.list[i].dt_txt);
            //img icon for each card
            var image = $("<img>").attr(
              "src",
              "https://openweathermap.org/img/w/" +
                response.list[i].weather[0].icon +
                ".png"
            );
            var temp = $("<p>")
              .addClass("card-text")
              .text("Temperature:" + response.list[i].main.temp_max + " °F");
            var hum = $("<p>")
              .addClass("card-text")
              .text("Humidity: " + response.list[i].main.humidity + " %");
            //take the column and append it to the the card then card body then append the title
            columns.append(
              card.append(cardbody.append(title, image, temp, hum))
            );
            $("#forecast .row").append(columns);
          }
        }
      },
    });
  }

  function getUVIndex(lat, lon) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=7ba67ac190f85fdba2e2dc6b9d32e93c&lat=" +
        lat +
        "&lon=" +
        lon,
      method: "GET",
      dataType: "json",
    }).then(function (response) {
      var uv = $("<p>").text("UV Index: ");
      //but variable in a span tag with the bootsrap class of small but and response.valu
      var btn = $("<span>").addClass("btn btn-sm").text(response.value);
      //if else statement to color the button depending on the UX index
      if (response.value < 3) {
        btn.addClass("btn-success");
      } else if (response.value < 7) {
        btn.addClass("btn-warning");
      } else {
        btn.addClass("btn-danger");
      }
      $("#currentCity .card-body").append(uv.append(btn));
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
  $(document).on("click", ".city", function () {
    var city = $(this).attr("data-name");
    currentCondition(city);
    fiveDayForecast(city);
    getUVIndex(city);
  });
});
