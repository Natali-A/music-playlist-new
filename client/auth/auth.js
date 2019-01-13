var app = angular.module('crowdcart.auth', []);// make an auth module

app.controller('AuthController', function ($scope, $window, $location, $http, Auth) {
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
                $scope.playlistsData = res.data.items;
            })
        }



    };


  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        console.log(data.address);
        //Save token, user_id and address to local storage
        $window.localStorage.setItem('crowdcarttoken', data.token)
        $window.localStorage.setItem('crowdcartuser', data.userid);
        $window.localStorage.setItem('playlistUserName', data.name.first + " " + data.name.last);
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signup = function () {
    Auth.signup($scope.user)
      .then(function (data) {
        $window.localStorage.setItem('crowdcarttoken', data.token);
        // saving username to localstorage
        $window.localStorage.setItem('crowdcartuser', data.userid);
        $location.path('/mylists');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

    $scope.spotifyLogin = function() {
        var res;
        Auth.spotifyLogin(res);
    };

    $scope.SpotifyRefresh = function() {
        Auth.refresh_token().then(function(res) {
            console.log('res', res);
        });
    }

    initialize();
});

// make and auth controller
// signin - delegate to services to call server
// signup - delegate to services to call server