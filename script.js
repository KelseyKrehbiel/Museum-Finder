"use strict";

const myKey = 'c6e13536-98fd-4945-9835-bdd4ad77bf31'

function buildAddressRequest(stateList,results){
    //build request URL for getting facility addresses
    console.log("building request");
    let requestURL = "https://ridb.recreation.gov/api/v1/facilityaddresses?";

    const options = {
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
    getFacilityAddresses(requestURL,options)
}

function getFacilityAddresses(requestURL,options) {
    fetch("https://ridb.recreation.gov/api/v1/facilityaddresses?query=az&limit=3&offset=0",options)
    .then(response => response.json())
    .then(responseJson => {
        console.log(responseJson);
        displayResults(responseJson.data)
    })

    //extract facility IDs from address list

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