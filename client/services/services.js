// services go here
angular.module("crowdcart.services",[])

.factory("Auth", function($http, $location, $window) {

  // signin
  var signin = function(user) {
    return $http({
      method: "POST",
      url: "/api/signin",
      // clarify on data format
      data: JSON.stringify(user)
    })
    .then(function(res) {
      return res.data
    })
  }

  // signup
  var signup = function(user) {
    console.log(user)
    return $http({
      method: "POST",
      url: "/api/signup",
      // clarify on data format
      data: JSON.stringify(user)
    })
    .then(function(res) {
      return res.data
    })
  }

  var isAuthenticated = function () {
    // check local to see if token exists
    // going by name crowdcarttoken for time being
    return !!$window.localStorage.getItem("crowdcarttoken")
  }

  var signout = function () {
    $window.localStorage.removeItem("crowdcarttoken");
    $window.localStorage.removeItem("crowdcartuser");
    $location.path("/signin")
  }

  return {
    signin: signin,
    signup: signup,
    isAuthenticated: isAuthenticated,
    signout: signout
  }


})

.factory("Lists", function($http) {

  // get all lists for specific user; since with routing to decide if that's the right meaning
  var getLists = function (id) {
    // console.log("getting all lists for", id)
    var user = {userid: id}
    // console.log(JSON.stringify(user))
    return $http({
      method: "GET",
      url: "/api/lists/" + id
      // data: JSON.stringify(user)
    })
    .then(function(res) {
      // console.log('lists: ', res.data)
      return res.data;
    })
  }

  // get one list when given listid
  var getOneList = function(listid) {
    return $http({
      method: "GET",
      url: "/api/list/" + listid
    })
    .then(function(res) {
      return res.data
    })
  }

  //get all lists in system
  var getAllList = function() {
    return $http({
      method: "GET",
      url: "/api/crowd"
    })
    .then(function(res){
      // console.log('ALL LISTS: ', res.data);
      return res.data;
    })
  }

  // posting a new lists
  var newList = function (list) {
    return $http({
      method: "POST",
      url: "/api/lists",
      data: list
    });
  }

  var deleteList = function (listid) {
    return $http({
      method: "DELETE",
      url: "/api/lists/" + listid
    })
  }

  // added because server route looks to handle, not sure if we will need it
  var updateStatus = function (listId, status) {
    return $http({
      method: "POST",
      url: "api/status",
      // need to decide on format for this call
      data: listId, status
    })
  }

  // Used when Updating Job Deliverer_id
  var updateList = function (list) {
    return $http({
      method: "PUT",
      url: "/api/lists",
      data: list
    })
  };

  var getOnePlayList = function(listid) {
    return $http({
      method: "GET",
      url: "/api/playlist/" + listid
    })
        .then(function(res) {
          return res.data
        })
  };

  var addOnePlaylist = function(list) {
    return $http({
      method: "POST",
      url: "/api/playlists",
      data: list
    });
  };

  var getAllPlaylists = function() {
    return $http({
      method: "GET",
      url: "/api/allPlaylists"
    })
        .then(function(res){
          // console.log('ALL LISTS: ', res.data);
          return res.data;
        })
  };

  function getUser(id) {
    return $http({
      method: "GET",
      url: "/api/users/" + id
    })
        .then(function(res){
          // console.log('User Name: ', res.data);
          return res.data;
        })
  };
  return {
    getLists: getLists,
    getAllList: getAllList,
    getOneList: getOneList,
    newList: newList,
    updateStatus: updateStatus,
    newList: newList,
    updateList: updateList,
    deleteList: deleteList,
    getOnePlayList: getOnePlayList,
    getAllPlaylists:getAllPlaylists,
    getUser:getUser
  }

})

.factory("Tracks", function($http){
  var getTracksByPlaylistID = function(playlistID) {
    console.log('herrrrrrrrrr33333333333333333re');

    return $http({
      method: "GET",
      url: "/api/trackToPlaylist/" + playlistID
    })
        .then(function(res) {
          return res.data;
        })
  };

  var getTrackById = function(trackID) {
    return $http({
      method: "GET",
      url: "/api/tracks/" + trackID
    })
        .then(function(res) {
          return res.data
        })
  };

  var addLikeToTrack = function(playListId, trackId, userName) {
    return $http({
      method: "POST",
      url: "/api/tracksLikes",
      data: { playlistID: playListId, trackID: trackId, userName: userName}
    });
  };

  var removeLikeFromTrack = function(playListId, trackId, userName) {
    return $http({
      method: "POST",
      url: "/api/tracksDeleteLikes",
      data: { playlistID: playListId, trackID: trackId, userName: userName}
    });
  };

  return {
    getTracksByPlaylistID : getTracksByPlaylistID,
    getTrackById : getTrackById,
    addLikeToTrack: addLikeToTrack,
    removeLikeFromTrack: removeLikeFromTrack
  };
})

.factory("Jobs", function($http) {

  // get all jobs for specific user
  var getJobs = function (id) {
    var user = {userid: id}
    return $http({
      method: "GET",
      url: "/api/jobs/" + id,
      data: JSON.stringify(user)
    })
    .then(function (res) {
      return res.data
    })
  }

  // update job status when task complete
  var updateJobStatus = function (listId, status) {
    return $http({
      method: "POST",
      url: "api/jobs",
      data: listId, status
    })
  }

  // maybe mvp
  var deleteJob = function (list) {
    return $http({
      method: "DELETE",
      url: "/api/jobs",
      data: list /*id*/
    })
  }

  return {
    getJobs: getJobs,
    updateJobStatus: updateJobStatus,
    deleteJob: deleteJob
  }

})