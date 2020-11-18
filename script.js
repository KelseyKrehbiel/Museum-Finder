"use strict";

const myKey = '5ae2e3f221c38a28845f05b6dab77e254cd36150a97eb1ef1812beef'


function getCoordinates(stateList) {
    return new Promise(function(resolve, reject) {
      var otmAPI =
        "https://api.opentripmap.com/0.1/en/places/" +
        'geoname' +
        "?apikey=" +
        myKey+ `&name=${stateList}`;

      fetch(otmAPI)
        .then(response => response.json())
        .then(data => {
          resolve(data)
          let coordinates = {"lat": data.lat, "lon":data.lon}
          console.log(data);
          getPlaces(coordinates);
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
        console.log("This is the json");
        

    });
  }

  function getPlaces(coordinates){
    //use lat and lon to get list of museums in area
    let placesURL = "https://api.opentripmap.com/0.1/en/places/radius?radius=30000"+
      `&lon=${coordinates.lon}&lat=${coordinates.lat}`+
      "&kinds=museums"+
      "&format=json"+
      `&apikey=${myKey}`;

    fetch(placesURL)
    .then(response => response.json())
    .then(data => {
      //resolve(data)
      console.log(data)
      displayResults(data);
    })
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
  }

  function getFacilityMap(){
      //get map location of facility based on longitude and latitude
      //use Google maps
  }

  //
  
  function displayResults(data) {
    console.log("display results");
    //Clear the previous results
    $('body').remove('ul','li');
    //For each place make a list item
    //place Name
    //Description
    //Address
    //Website
    //Google Map
    $('main').append('<ul class="place-list"></ul>')
    data.forEach(element => {
      let itemName = element.name;
      if (itemName != ""){
        $('ul').append(`<li>${itemName}</li>`);
      }     
        
    })

    //Add it to the DOM


  }
  
  function watchForm() {
      //console.log("submitted")
    $('form').submit(event => {
      event.preventDefault();
      //console.log($('#state-list').val());
      //console.log($('#result-size').val());
      let stateList = $('#state-list').val();
      let results = $('#result-size').val();
      getCoordinates(stateList);
    });
  }
  //wait for submission
  $(watchForm());




  /*
let xid = element.xid;
      let placeURL = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${myKey}`
      console.log(placeURL);
      fetch(placeURL)
      .then(response => response.json())
      .then(pdata => {
        //resolve(data)
        console.log(pdata)
  */