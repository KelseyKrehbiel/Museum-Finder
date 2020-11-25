//import { google } from "https://maps.googleapis.com/maps/api/js?key=AIzaSyB1tEvB-iDEeyFXyjp2FC122VPDzXrWqcE&callback=initMap&libraries=&v=weekly";
"use strict";

const otmKey = '5ae2e3f221c38a28845f05b6dab77e254cd36150a97eb1ef1812beef'

let offset = 0;

let coordinates = {"lat":0, "lon":0};

let radius = 3000;

const pageLength = 5

function getCoordinates(location) {
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
          coordinates = {"lat": data.lat, "lon":data.lon}
          console.log(data);
          getPlaces(coordinates,radius);
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
        //console.log("This is the json");
        

    });
  }

  function getPlaces(){
    //use lat and lon to get list of museums in area
    let placesURL = "https://api.opentripmap.com/0.1/en/places/radius?"+
      `radius=${radius}`+
      `&limit=${pageLength}`+
      `&offset=${offset}`+
      `&lon=${coordinates.lon}&lat=${coordinates.lat}`+
      "&kinds=museums"+
      "&format=json"+
      `&apikey=${otmKey}`;
    console.log(placesURL); 

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

  function getPlaceMap(coordinates,xid){
      //get map location of facility based on longitude and latitude
      //use Google maps
      console.log("getting map");
      let gCoords = {'lat': coordinates.lat, 'lng': coordinates.lon}

      // The map, centered at gCoords
      const map = new google.maps.Map(document.getElementById(xid), {
        zoom: 17,
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
    $("no-result").remove();
    $("#next-button").remove();
    //For each place make a list item
    //Description,Google Map
    $('main').append('<ul class="place-list"></ul>')
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
          let wikiExtract = pdata.wikipedia_extracts ? pdata.wikipedia_extracts.text : "No info available.";
        
          //add items to list
          $('.place-list').append(`<li>
                            <h2 class="center">${itemName}</h2>
                            <fieldset class="place-container">
                              <div class="place-data"><p>${wikiExtract}</p></div>
                              <div class="place-data" id=${xid}></div>
                            </fieldset>
                          </li>`);

          //get map for location
          getPlaceMap(pdata.point,xid);
        })
        
      } 
    });
    //check if more results available
    if(data.length < 5){
      $('main').append(`<h2 class="no-result center">End of results</h2>`);
    }
    else{
      //button to load next set of results
      $('main').append(`<button id="next-button" name="next-button" class="center">Load More</button>`);
    }
    //Add it to the DOM

  }
  
  function watchForm() {
      //console.log("submitted")
    $('form').submit(event => {
      event.preventDefault();
      //console.log($('#location').val());
      //console.log($('#search-radius').val());
      let location = $('#location').val();
      //convert kilometers to meters
      radius = ($('#search-radius').val())*1000;
      //reset offset to 0
      offset = 0;
      getCoordinates(location,radius);
    });

    $('main').on('click', '#next-button', event => {
      console.log("next")
      event.preventDefault();
      offset += 5;
      getPlaces();
    });

  }
  //wait for submission
  $(watchForm());