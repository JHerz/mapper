
$(function() {


    var mapOptions = {
        center: new google.maps.LatLng(0, 350.644),
        zoom: 2
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions),
            iconSize = new google.maps.Size(36, 36),
            $('#sidebar').resizable({resize: function(event, ui) {
            google.maps.event.trigger(map, 'resize');
        }});

    $('#submit').hover(function() {
        $('#submit').animate({color: "teal",
            height: "2.4em",
            width: "4.7em",
            borderRadius: "15px"}, 100, "swing");
    }, function() {
        $('#submit').animate({borderRadius: "6px",
            height: "2em",
            width: "4.6em",
            color: "black"});
    }, 100, "swing");

    $('#submit').click(function() {
        $('.results').remove();
        var input = $('#input').val();

        var url = 'http://www.geonames.org/wikipediaSearch?q=' + input + '&maxRows=15&username=jherz&type=json&callback=?';
        $.getJSON(url, function(data) {

            if ($('input').val() == '') {
                $("<h2 id = 'error'>Don't leave it blank, silly!<br>please try again</h2>").appendTo('#sidebar').show("bounce").fadeOut(4000);
            }

            else if (data.geonames.length == 0)
            {
                $('<h2 id = "error">not found!<br>please try again</h2>').appendTo('#sidebar').show("bounce").fadeOut(4000);
            }

            else {
                $('<h4 class="results" id="choose">please choose from the following locations:</h4>').appendTo('#sidebar').show("blind");

                $.each(data.geonames, function(index, value) {


                    var position = new google.maps.LatLng(value.lat, value.lng);

                    $('<li class="results">' + value.title + '</li>').appendTo('#sidebar').show("blind").click(function() {
                        if (value.thumbnailImg) {
                            icon = {
                                url: value.thumbnailImg,
                                scaledSize: iconSize
                            };
                        }

                        var marker = new google.maps.Marker({map: map,
                            position: position, title: value.title});

                        map.panTo(position);
                        map.setZoom(12);

                        $('.results').hide("blind");
                        // var url2 = 'http://ws.geonames.org/findNearByWeatherJSON?lat=' + value.lat + '&lng=' + value.lng + '&username=slubowsky';
                        /* $.getJSON(url2, function(data) {
                         $('<p>current tempature: ' + data.weatherObservation.temperature + '<br>current cloudiness: '+ data.weatherObservation.clouds + '<br>current windspeed: ' + data.weatherObservation.windSpeed
                         + '</p>').appendTo($('#sidebar'));
                         
                         });*/
                        $("#inSidebar").hide("blind", function() {
                            $('<h2 id = "title" class="results">' + value.title +
                                    '</h2><a id = "wikiLink" class="results"\n\ href ="http://' + value.wikipediaUrl +
                                    '" target="_blank">open wiki page</a><div class="results" id="checks"><input type="checkbox" id="wLayer" class="eachBox">\
                                    \n\show weather<br><input type="checkbox" id="cLayer" class="eachBox">\n\
                                    show clouds<br><input type="checkbox" id="tLayer" class="eachBox">\n\
                                    show transit<br>\<input type="checkbox" id="places" class="eachBox">\n\
                                    show local places<br></div><div class="results">\n\
                                    <br><button id="newSearch">\n\
                                    new search</button></div> ').appendTo('#sidebar').show("blind");

                            if (value.thumbnailImg) {
                                $('<br><img id="thumb" src="' + value.thumbnailImg + '" />').appendTo('#title');
                            }

                            var wLayer = false;
                            var cLayer = false;
                            var tLayer = false;
                            var places = false;

                            if(!weatherLayer){var weatherLayer = new google.maps.weather.WeatherLayer({
                            temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
                            });
                        }
                                var cloudLayer = new google.maps.weather.CloudLayer();
                            var trafficLayer = new google.maps.TrafficLayer();

                            var bounds = map.getBounds(),
                                    ne = bounds.getNorthEast(),
                                    sw = bounds.getSouthWest(),
                                    url = "http://api.geonames.org/wikipediaBoundingBoxJSON?north=" 
                                    + ne.lat() + '&south=' + sw.lat() + '&east=' + ne.lng()
                                    + '&west=' + sw.lng() + '&username=jherz&callback=?';

                            var newMarkers = [];
                            weatherLayer.setMap(null);
                           // cloudLayer.setMap(null);
                          //  trafficLayer.setMap(null);
                            
                            $('#tLayer').click(function() {
                                if (tLayer) {
                                    trafficLayer.setMap(null);
                                    tLayer = false;
                                }
                                else {

                                    trafficLayer.setMap(map);
                                    tLayer = true;
                                }

                            });


                            $('#wLayer').click(function() {
                                if (wLayer) {
                                    weatherLayer.setMap(null);
                                    wLayer = false;
                                }
                                else {

                                    weatherLayer.setMap(map);
                                    wLayer = true;
                                }

                            });

                            $('#cLayer').click(function() {
                                if (cLayer) {
                                    cloudLayer.setMap(null);
                                    cLayer = false;
                                }
                                else {

                                    cloudLayer.setMap(map);
                                    cLayer = true;
                                    map.setZoom(5);
                                }

                            });

                            $('#places').click(function() {
                                if (places) {
                                    for (i in newMarkers) {
                                        newMarkers[i].setMap(null);
                                    }
                                    places = false;
                                }
                                else {
                                    $.getJSON(url, function(data) {

                                        $.each(data.geonames, function(index, value) {
                                            if (value.thumbnailImg) {
                                                icon = {
                                                    url: value.thumbnailImg,
                                                    scaledSize: iconSize
                                                };

                                                var position = new google.maps.LatLng(value.lat, value.lng);
                                                var marker = new google.maps.Marker({map: map,
                                                    position: position, title: value.title, icon: icon});
                                                newMarkers.push(marker);
                                            }
                                            else {
                                                var position = new google.maps.LatLng(value.lat, value.lng);
                                                var marker = new google.maps.Marker({map: map,
                                                position: position, title: value.title});
                                                newMarkers.push(marker);
                                            }

                                        });
                                    });

                                    places = true;
                                }

                            });

                            $("input").val('');
                            
                            $('#newSearch').hover(function() {
                                $('#newSearch').animate({color: "teal",
                                    height: "4em",
                                    width: "5.3em",
                                    borderRadius: "8px"}, 100, "swing");
                            }, function() {
                                $('#newSearch').animate({borderRadius: "21px",
                                    height: "3.5em",
                                    width: "5.1em",
                                    color: "black"});
                            }, 100, "swing").click(function() {
                                $(".results").hide("blind", function() {
                                    $(".home").show("blind");
                                });
                            });
                        });

                    });
                });
            }
        });


    });

});