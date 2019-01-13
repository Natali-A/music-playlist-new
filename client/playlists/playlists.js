/*
/!**
 * Created by Natali on 1/14/2019.
 *!/
angular.module("crowdcart.lists", ["angularMoment"])

    .controller("NewPlayListController", function ($scope, Lists, Tracks, $window, $location, $http) {
        function getHashParams() {
            var hashParams = {};
            var e, r = /([^&;=]+)=?([^&;]*)/g;
            var data = $window.location.hash;
            q = data.substring(data.indexOf('?') + 1);
            while ( e = r.exec(q)) {
                hashParams[e[1]] = decodeURIComponent(e[2]);
            }
            return hashParams;
        }


        var initialize = function () {

            debugger;
            var params = getHashParams();
            $scope.access_token = params.access_token;
            $scope.refresh_token = params.refresh_token;
            $scope.error = params.error;

            console.log('params', params);

            if ($scope.error) {
                console.log('There was an error during the authentication');
            } else if ($scope.access_token) {
                // save params to localStorage
                $window.localStorage.setItem('access_token',$scope.access_token);
                $window.localStorage.setItem('refresh_token',$scope.refresh_token);

                // get user profile data
                $http.post('/api/getLoggedInUser', {access_token : $scope.access_token}).then(function(res) {
                    console.log('getLoggedInUser res', res);
                    $scope.displayName = res.data.display_name;
                    $scope.user_img = res.data.images[0].url;

                });

                // get user's playlists
                $http.post('/api/getLoggedInPlaylists', {access_token : $scope.access_token}).then(function(res) {
                    console.log('getLoggedInPlaylists res', res);
                    $scope.NumOfPlaylists = res.data.total;
                    $scope.allLists = res.data.items;
                })
            }



        };

        initialize();
    });
*/
