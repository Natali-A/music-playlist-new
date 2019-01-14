/**
 * Created by Natali on 12/21/2018.
 */
var mongoose = require('mongoose');

var PlaylistsSchema = new mongoose.Schema({
    id: String,
    name: String,
    created_at: {
        type: Date,
        default: Date.now
    },

    owner_name: String,
    tracks : [],
    images: [],
    href: String
});

module.exports = mongoose.model('Playlists', PlaylistsSchema);