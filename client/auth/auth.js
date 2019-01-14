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

});

// make and auth controller
// signin - delegate to services to call server
// signup - delegate to services to call server