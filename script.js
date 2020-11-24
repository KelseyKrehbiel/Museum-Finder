import { google } from "https://maps.googleapis.com/maps/api/js?key=AIzaSyB1tEvB-iDEeyFXyjp2FC122VPDzXrWqcE&callback=initMap&libraries=&v=weekly";
"use strict";

const otmKey = '5ae2e3f221c38a28845f05b6dab77e254cd36150a97eb1ef1812beef'


function getCoordinates(location,radius) {
    return new Promise(function(resolve, reject) {
      var otmAPI =
        "https://api.opentripmap.com/0.1/en/places/" +
        'geoname' +
        "?apikey=" +
        otmKey+ `&name=${location}`;

      fetch(otmAPI)
        .then(response => response.json())
        .then(data => {
          resolve(data)
          let coordinates = {"lat": data.lat, "lon":data.lon}
          console.log(data);
          getPlaces(coordinates,radius);
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
        //console.log("This is the json");
        

    });
  }

  function getPlaces(coordinates,radius){
    //use lat and lon to get list of museums in area
    let placesURL = "https://api.opentripmap.com/0.1/en/places/radius?"+
      `radius=${radius}`+
      "&limit=15"+
      `&lon=${coordinates.lon}&lat=${coordinates.lat}`+
      "&kinds=museums"+
      "&format=json"+
      `&apikey=${otmKey}`;
    console.log(placesURL);
    
    //getPlaceMap(coordinates); 

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

  function getPlaceMap(coordinates){
      //get map location of facility based on longitude and latitude
      //use Google maps
      console.log("getting map");
      let gCoords = {'lat': coordinates.lat, 'lng': coordinates.lon}

      // The map, centered at gCoords
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: gCoords,
      });
      // The marker, positioned at gCoords
      const marker = new google.maps.Marker({
        position: gCoords,
        map: map,
      });


  }

  //
  
  function displayResults(data) {
    console.log("display results");
    //Clear the previous results
    $(".place-list").remove();
    //For each place make a list item
    //place Name
    //Description
    //Address
    //Website
    //Google Map
    $('main').append('<ol class="place-list"></ol>')
    data.forEach(element => {
      let itemName = element.name;
      if (itemName != ""){
        let xid = element.xid;
        let placeURL = `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${otmKey}`
        //console.log(placeURL);
        //delay calls to stay in api limit
        
        fetch(placeURL)
        .then(response => response.json())
        .then(pdata => {
          //resolve(data)
          console.log(pdata)

          //get address from place data
          let address = `${pdata.address.city}, ${pdata.address.state}`
          
          //get wikipedia description from place data
          let wikiExtract = pdata.wikipedia_extracts.text;
        
        //add items to list
        $('ol').append(`<li>
                          <h2>${itemName}</h2>
                          <h3>${address}</h3>
                          <p>${wikiExtract}</p>
                          <div id="map">map goes here</div>
                        </li>`);
        })
        .then(sleeper(1000));
      } 
    });

    //Add it to the DOM


  }

  function sleeper(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }
  
  function watchForm() {
      //console.log("submitted")
    $('form').submit(event => {
      event.preventDefault();
      //console.log($('#location').val());
      //console.log($('#search-radius').val());
      let location = $('#location').val();
      //convert kilometers to meters
      let radius = ($('#search-radius').val())*1000;
      getCoordinates(location,radius);
    });
  }
  //wait for submission
  $(watchForm());