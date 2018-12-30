/**
 * Created by Natali on 12/25/2018.
 */
var mongoose = require('mongoose');

var TracksToPlaylistsSchema = new mongoose.Schema({
    id: String,
    playlist_id: String,
    track_id: String,
    likes : []
});

module.exports = mongoose.model('tracksToPlaylists', TracksToPlaylistsSchema);