var eventName = '';
var eventCity = '';
var map;
var infowindow;
var mapLat = 0;
var mapLong = 0;
var myLatlng = {
    lat: 40.752664,
    lng: -73.994309
};
var noIMGAvailableURL = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

function initMap() {

    myLatlng = {
        lat: parseFloat(mapLat),
        lng: parseFloat(mapLong)
    };
    console.log(myLatlng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 18
    });

      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var mainMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: iconBase + 'parking_lot_maps.png',
        title: 'EVENT LOCATION'
    });

         map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
        map.panTo(mainMarker.getPosition());
    }, 3000);
});



    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: myLatlng,
        radius: 800,
        type: ['restaurant']
    }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    console.log(place.name);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location


    });


    google.maps.event.addListener(marker, 'click', function() {
        console.log(place.name);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });




 

}

 


// marker.addListener('click', function() {
//     map.setZoom(22);
//     map.setCenter(marker.getPosition());
// });

class myEvent  {
  constructor(resultsEvent) {
    this.nameInfo =     resultsEvent.name != null && resultsEvent.name.trim() != '' ? resultsEvent.name.trim() : 'No Name Provided.';

    this.addressInfo =  resultsEvent.address != null && resultsEvent.address.line1 != null && 
                        resultsEvent.address.line1.trim() != '' ? resultsEvent.address.line1.trim() : 'No Address Provided';

    this.generalInfo =  resultsEvent.generalInfo != null && resultsEvent.generalInfo.generalRule != null &&
                        resultsEvent.generalInfo.generalRule.trim() != '' ? resultsEvent.generalInfo.generalRule.trim() : 'Were sorry, the Venue has not provided any General Info...';
    
    this.parkingInfo =  resultsEvent.parkingDetail;
    
    this.TwitterInfo =  resultsEvent.social != null && resultsEvent.social.twitter != null && resultsEvent.social.twitter.handle != null &&
                        resultsEvent.social.twitter.handle.trim() != '' ? resultsEvent.social.twitter.handle.trim() : 'No Twitter Provided...';

    this.Image =    resultsEvent.images != null && resultsEvent.images[0] != null && resultsEvent.images[0].url != null &&
                    resultsEvent.images[0].url.trim() != '' ? $('<img>').attr('src',resultsEvent.images[0].url.trim()) : $('<img>').attr({'src': noIMGAvailableURL, 'alt': 'No Image Provided', 'style': 'max-width: 100px;'});
  

    this.LattitudeInfo =    resultsEvent.location != null && resultsEvent.location.latitude != null && 
                            resultsEvent.location.latitude.trim() != '' ? resultsEvent.location.latitude.trim() : 'No Info Provided';

    this.LongitudeInfo =    resultsEvent.location != null && resultsEvent.location.longitude != null && 
                            resultsEvent.location.longitude.trim() != '' ? resultsEvent.location.longitude.trim() : 'No Info Provided';
  }
}



function DoWork() {
    eventName = $("#band-input").val().trim();
    eventCity = $("#venue-input").val().trim();
    var queryURL =
        "https://app.ticketmaster.com/discovery/v2/events?apikey=Y68sacNOAQxxvGbr0Du9KNZNykWVrE3m&keyword=" + eventName + "&city=" + eventCity;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        console.log(response._embedded);
        document.preventDefault;
        var results = response._embedded.events[0]._embedded.venues;


    var myEvents=[];

    //maybe try catch here or other functions or pieces
    $.each(results, function(index, element){
      var newEvent = new myEvent(element);
      myEvents.push(newEvent);
    });

    //Do DOM work
        if(myEvents != null && myEvents.length > 0){
            //Empty Container
            $("#band-display").Empty();

            $.each(myEvents, function (index, element){

                var eventsObj = element;

                //Display Event to DOM
                try{
    //throw 'Some Event Display BS Failed';

                    $("#band-display").append("<tr><td><strong> Venue Name:</strong><br> " + eventsObj.nameInfo + "</td></tr>");
                    $("#band-display").append("<tr><td><strong> Address: </strong><br>" + eventsObj.addressInfo + "</td></tr>");
                    $("#band-display").append("<tr><td><strong> General Rules:</strong><br> " + eventsObj.generalInfo + "</td></tr>");
                    $("#band-display").append("<tr><td><strong> Parking:</strong><br> " + eventsObj.parkingInfo + "</td></tr>");
                    $("#band-display").append("<tr><td><strong> Social: </strong><br>" + eventsObj.TwitterInfo + "</td></tr>");
                    $("#band-display").append(eventsObj.Image);
                }
                catch(errorMessage){
                    console.log('Error: Do DOM work Failure  --  ' + errorMessage);
                    console.log('Time: ' + Date().toLocaleString());
                }

                //Display Map for Event to DOM
                try{
    //throw 'Some maps BS Failed';
                    mapLat = eventsObj.LattitudeInfo;
                    mapLong = eventsObj.LongitudeInfo;
                    console.log(mapLat + " " + mapLong);
                    initMap();

                }
                catch(errorMessage){
                    console.log('Error: Do DOM work Failure  --  ' + errorMessage);
                    console.log('Time: ' + Date().toLocaleString());
                }

            })
        }






        // for (var i = 0; i < results.length; i++) {
        //     var eventsObj = results[i];
        //     console.log(eventsObj);
        //     try{$("#band-display").html("<tr><td><strong> Venue Name:</strong><br> " + eventsObj.name + "</td></tr>");}catch(err){}
        //     try{$("#band-display").append("<tr><td><strong> Address: </strong><br>" + eventsObj.address.line1 + "</td></tr>");}catch(err){}

        //     try{$("#band-display").append("<tr><td><strong> General Rules:</strong><br> " + eventsObj.generalInfo.generalRule + "</td></tr>");}catch(err){}
        //     try{$("#band-display").append("<tr><td><strong> Parking:</strong><br> " + eventsObj.parkingDetail + "</td></tr>");}catch(err){}
        //     try{$("#band-display").append("<tr><td><strong> Social: </strong><br>" + eventsObj.social.twitter.handle + "</td></tr>");}catch(err){}
        //     try{
        //     var posterImage = eventsObj.images[0].url;
        //     console.log(posterImage);
        //     var img = $('<img>').attr('src', posterImage)
        //     $("#band-display").append(img);
        //     }catch(err){}
        //     mapLat = eventsObj.location.latitude;
        //     mapLong = eventsObj.location.longitude;
        //     console.log(mapLat + " " + mapLong);



        //     initMap();

        // }


    });




});