
var map;
var resturantInfo = [];
var marker;
var contentString = 'error';
var infowindow;

// initialize the Google map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.768038, lng: -73.981895},
      zoom: 13,
      fullscreenControl: true
      });
      infowindow = new google.maps.InfoWindow({
        content:contentString
      });
      marker = new google.maps.Marker({});
    }
// function that takes marker to animate
  function bounceOnClick(mark){
    resturantInfo().forEach(function(item){
      item.pin.setAnimation(null);
    });
    mark.setAnimation(google.maps.Animation.BOUNCE);
  }

//adds the api's parameters to the url.
    var url = "https://api.locu.com/v1_0/venue/search/";
    url += '?' + $.param({
      "locality": "new york",
      "has_menu": true,
      'api_key': "75165871b0d46f037be7e2fb1b3fbf2e2cf028b0"
    });

  $.ajax({
      url: url,
      dataType: "jsonp",
      success:function(data){
        for (var i = 0; i < data.objects.length; i++) {
          //creates marker for the current resturant
          var marker = new google.maps.Marker({
              position: {lat:data.objects[i].lat, lng:data.objects[i].long},
              map: map,
              animation: google.maps.Animation.DROP,
              title: data.objects[i].name
          });
          //click event for when the user clicks on the marker it bounces and opens the infowindow
          google.maps.event.addListener(marker, 'click', (function(marker,i) {
            return function() {
                bounceOnClick(marker);
                infowindow.setContent('<div>' + data.objects[i].name + '</div>' + '<div>' + data.objects[i].street_address + '</div>' + '<a href=' + data.objects[i].website_url + '>Website</a>');
                infowindow.open(map, marker);
            }
        })(marker,i));
        //adds info about the resturants to the resturantInfo array.
          resturantInfo.push({name:data.objects[i].name,lat:data.objects[i].lat,long:data.objects[i].long,pin:marker,address:data.objects[i].street_address,website:data.objects[i].website_url})
        }
      }
      // if the request fails alert the user
    }).fail(function(){
      alert("Sorry, it appers the resturants info failed to load");
    });

    // If google maps fails to load after 3 seconds alert the user.
    setTimeout(function(){
      if(!window.google || !window.google.maps) {
       alert("Sorry, Google Maps has failed to load");
     }
   }, 3000);


function AppViewModel() {

  var self = this;
  //make resturantInfo and the search query observable arrays
  resturantInfo = ko.observableArray();
  self.query = ko.observable('');

// every time a input is entered into the search the filteredResturants computed function is run.
    self.filteredResturants = ko.computed(function(){
      var filter = self.query().toLowerCase();

      if(!filter){
        //if the search is empty make sure all markers are visible.
        resturantInfo().forEach(function(item){
          item.pin.setVisible(true);
        });
        return resturantInfo();
      } else {
        return ko.utils.arrayFilter(resturantInfo(),function(item){
          //make the marker not visible and if the item.name matchs the query set the marker to visible.
          //if not leave if not visible.
          item.pin.setVisible(false)
          if(item.name.toLowerCase().indexOf(filter) !== -1){
            item.pin.setVisible(true);
            return true;
          }
        });
      }
    });

//when show info called it animates the selected pin,sets the content of the infowindow and opens it.
  self.showInfo = function() {
               bounceOnClick(this.pin);
               infowindow.setContent('<div>' + this.name + '</div>' + '<div>' + this.address + '</div>' + '<a href=' + this.website + '>Website</a>');
               infowindow.open(map,this.pin);
             };
  }

  // Activates knockout.js
  ko.applyBindings(new AppViewModel());
