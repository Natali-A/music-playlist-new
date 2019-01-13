// require userHandler, listHandler
var userHandler = require('../users/userHandler.js');
var listHandler = require('../lists/listHandler.js');
var PlaylistsHandler = require('../playlists/PlaylistsHandler');
var TrackToPlaylistHandler = require('../trackToPlaylist/trackToPlaylistHandler.js');
var Spotify = require('../spotify/spotify');


// export function
module.exports = function(app, express){

  //        the request url names ('/api/...')

  // POST - signin
  app.post('/api/signin', userHandler.signin);
  // POST - signup
  app.post('/api/signup', userHandler.signup);

  // Spotify
  app.get('/api/SpotifyLogin', Spotify.login);
  app.get('/api/SpotifyCallback', Spotify.callback);
  app.get('/api/SpotifyRefresh_token',Spotify.refresh_token);
  app.post('/api/getLoggedInUser', Spotify.getLoggedInUser);
  app.post('/api/getLoggedInPlaylists', Spotify.getLoggedInPlaylists);


  // POST - addList
  app.post('/api/lists', listHandler.addList);
  // GET - getList (single list)
  app.get('/api/list/:id', listHandler.getOneList);
  // GET - getLists (users lists)
  app.get('/api/lists/:id', listHandler.getLists);
  // PUT - for updating list
  app.put('/api/lists', listHandler.updateList);
  // DELETE - deletes a single list
  app.delete('/api/lists/:id', listHandler.deleteList);
  // GET - getAllLists
  app.get('/api/crowd', listHandler.getAllLists);
  // GET - getJobs (users accepted jobs)
  app.get('/api/jobs/:id', listHandler.getJobs);
  // POST - getJobs (user updates job when completed)
  app.post('/api/jobs', listHandler.updateJobStatus);
  // POST - updateStatus (reflects when jobs/lists are assigned)
  app.post('/api/status', listHandler.updateStatus);

  // Will probably need more routes over time
  // POST - addList
  app.post('/api/playlists', PlaylistsHandler.addList);
  // GET - getList (single list)
  app.get('/api/playlist/:id', PlaylistsHandler.getOneList);
  // GET - getLists (users lists)
  app.get('/api/playlists/:id', PlaylistsHandler.getLists);
  // PUT - for updating list
  //app.put('/api/lists', PlaylistsHandler.updateList);
  // DELETE - deletes a single list
  app.delete('/api/playlists/:id', PlaylistsHandler.deleteList);
  // GET - getAllLists
  app.get('/api/allPlaylists', PlaylistsHandler.getAllLists);
  // POST - updateStatus (reflects when jobs/lists are assigned)
  //app.post('/api/status', PlaylistsHandler.updateStatus);

  app.post('/api/tracks', TrackToPlaylistHandler.addTrackToPlayList);
  app.get('/api/trackToPlaylist/:id', TrackToPlaylistHandler.getTracksByPlaylistID);
  app.get('/api/tracks/:id', TrackToPlaylistHandler.getTrackById);
};