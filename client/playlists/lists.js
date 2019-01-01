/**
 * Created by Natali on 12/24/2018.
 */
angular.module("crowdcart.lists", ["angularMoment"])

    .controller("PlayListController", function ($scope, Lists, Tracks, $window, $location, $rootScope, $routeParams, $interval) {

        // storage objs
        $scope.data = {};
        $scope.list = {};
        $scope.list.items = [];


        // store userid into local storage (same level as auth token)
        $scope.userid = $window.localStorage.getItem('crowdcartuser');


        function getDuration (a) {
            return a.duration_ms;
        }

       /* $scope.getLikesNumber = function(item) {
            Tracks.getTrackById(item.id).then(function (data) {
                console.log(data.likes);
            });
        }*/

        $scope.millisToMinutesAndSeconds = function (millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };

        $scope.durationTime = 0;
        function calcDuration(list) {
            var ms_sum = 0;
            for(i=0; i<list.length; i++) {
                ms_sum += list[i].duration_ms;
                console.log($scope.durationTime);
            }

            $scope.durationTime = $scope.millisToMinutesAndSeconds(ms_sum);
        };

        $scope.likesDict = {};
        function getLikesPerTrack(list) {
            for(i=0; i < list.length; i++) {
                var elm = list[i];
                Tracks.getTrackById(elm.id).then(function(data) {
                    $scope.likesDict[data.track_id] = data.likes;
                });
            }
        }

        var initialize = function () {
            // console.log('userId: ',$scope.userid)
            // console.log($rootScope)
            // console.log('user', $scope.city)

            // is routePararms exists it means directed here via URL
            if ($routeParams.listid) {
                Lists.getOnePlayList($routeParams.listid)
                    .then(function (list) {
                        console.log('nataaa', list);
                        $scope.displayList = list;
                        calcDuration(list.tracks);
                        $scope.playlistCreated = (new Date(list.created_at)).toLocaleString();
                        getLikesPerTrack(list.tracks);
                    });
            }

            //Get all lists belong to user
            Lists.getLists($scope.userid)
                .then(function (lists) {
                    $scope.data.lists = lists;
                })
                .catch(function (error) {
                    console.error(error);
                });

            Lists.getAllPlaylists()
                .then(function(allLists){
                    $scope.data.allLists = allLists;
                })
                .catch(function(error){
                    console.error(error);
                });
        };

        $scope.displayDetail = function(listid) {
            // simple redirect
            $location.path("/playlistDetail/" + listid)
        };


        function mapFunc(a) {
            return a.name;
        };

        $scope.getArtistsString = function(index) {
            return ($scope.displayList.tracks[index].artists.map(mapFunc).join(', '));
        };




        //add new list method, will be attached into createnewlist.html
        $scope.addList = function () {
            $scope.list.creator_id = $scope.userid;
            // Defaulting deliverer_id to empty string
            $scope.list.deliverer_id = '';

            //If user choose the default address, assign the default address to the list to be added
            if($scope.isDefaultAdd) {
                $scope.list.delivery_address = {
                    street: $scope.street,
                    city: $scope.city,
                    state: $scope.state,
                    zip_code: $scope.zip
                }
            }
            $scope.list.due_at.setHours($scope.list.due_hour);
            $scope.list.due_at.setMinutes($scope.list.due_minute);
            Lists.newList($scope.list)
                .then(function () {
                    $location.path('/mylists');
                })
                .catch(function (error) {
                    console.log(error);
                });
        };

        $scope.deleteList = function(listid, idx) {
            Lists.deleteList(listid)
                .then(function () {
                    $scope.data.lists.splice(idx, 1)
                })
        }


        //Add a job, update the deliverer id to user's id
        $scope.addJob = function(list) {

            // Prefix 786 for all new jobs
            // Note: Prior to this method.. deliverer_id = userid
            // causing issues where every list was being displayed
            // in My Jobs
            list.deliverer_id = '786' + $scope.userid;

            // Update DB list with new deliverer_id
            Lists.updateList(list)
                .then(function () {
                    console.log("add job", list)
                    $location.path('/myjobs');
                })
                .catch(function (error) {
                    console.log(error);
                });
        }


        //Google Map initializer
        $scope.mapInitialize = function() {
            //console.log('alllist',  $scope.data.allLists)

            var locations = [];

            //Convert address objects into string and save into locations

            $scope.data.allLists.forEach(function(item) {
                if(!item.delivery_address) {
                    item.delivery_address = {};
                }
                locations.push(item.delivery_address.street + ' , ' + item.delivery_address.city + ' , ' + item.delivery_address.state + ' ' + item.delivery_address.zip_code)
            });

            //Geocoder for converting address string into coordicates
            //set up map object with some options
            var geocoder;
            var map;
            /* geocoder = new google.maps.Geocoder();
             var latlng = new google.maps.LatLng(-34.397, 150.644);


             var myOptions = {
             zoom: 4,
             center: latlng,
             mapTypeControl: true,
             mapTypeControlOptions: {
             style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
             },
             navigationControl: true,
             mapTypeId: google.maps.MapTypeId.ROADMAP
             };

             map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);


             //Method for converting address and make a marker on map
             var convertAdd = function (address, name) {
             if (geocoder) {
             geocoder.geocode({
             'address': address
             }, function(results, status) {
             if (status == google.maps.GeocoderStatus.OK) {
             if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
             map.setCenter(results[0].geometry.location);

             var infowindow = new google.maps.InfoWindow({
             content: '<p><b>'+ name + '</b></p><p><b>' + address + '</b></p>',
             size: new google.maps.Size(150, 50)
             });

             var marker = new google.maps.Marker({
             position: results[0].geometry.location,
             map: map,
             title: name
             });



             google.maps.event.addListener(marker, 'click', function() {
             infowindow.open(map, marker);
             });

             } else {
             console.log("No results found");
             }
             } else {
             console.log("Geocode was not successful for the following reason: " + status);
             }
             });
             }
             }

             */
            //Iterate over the list of locations and apply convert address on each one
            for (var i = 0; i < locations.length; i++) {
                convertAdd(locations[i], $scope.data.allLists[i].name);
            }
        }

        initialize();

        //Google map got initialize, set timeout for wating the list data to be loaded
        /* google.maps.event.addDomListener(window, 'load', setTimeout($scope.mapInitialize, 500));*/
    })


    // Date Picker ui-bootstrap controller
    .controller('DatepickerPopupDemoCtrl', function ($scope) {
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

    });



