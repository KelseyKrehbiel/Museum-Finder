"use strict";

const myKey = '5ae2e3f221c38a28845f05b6dab77e254cd36150a97eb1ef1812beef'

function buildAddressRequest(stateList,results){
    //build request URL for getting facility addresses
    console.log("building request");
    let requestURL = "https://ridb.recreation.gov/api/v1/facilityaddresses?";

    const options = {
        mode: 'cors',
        headers: {
          "Accept": "application/json",
          "apiKey": myKey
        }
        
    };
    let encodedStateList = stateList.replace(/\s/g, "");
    //convert commas to %2C for URL
    encodedStateList = encodedStateList.replace(',','%2C');
    //console.log(encodedStateList);
    requestURL += `query=${encodedStateList}&limit=${results}`;

    //console.log(requestURL);
    apiGet(options)
}

function apiGet(query) {
    return new Promise(function(resolve, reject) {
      var otmAPI =
        "https://api.opentripmap.com/0.1/en/places/" +
        'geoname' +
        "?apikey=" +
        myKey+ "&name=arizona";

      fetch(otmAPI)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
    });
  }

  function requestFacilityData(){
      //use address data to build fetch request for facilites
      //"https://ridb.recreation.gov/api/v1/facilities/{facilityID}"
      //for each facility request data
      //get Name, Description, address, longitude, latitude
  }

  function getFacilityMap(){
      //get map location of facility based on longitude and latitude
      //use Google maps
  }

  //
  
  function displayResults() {
    console.log();
    //Clear the previous results

    //For each facility make a list item
    //Facility Name
    //Description
    //Address
    //Website
    //Google Map

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
      buildAddressRequest(stateList,results);
    });
  }
  //wait for submission
  $(watchForm());