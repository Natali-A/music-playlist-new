/**
 * Created by Natali on 12/25/2018.
 */
var helper = require('../config/helpers.js');
var TrackToPlaylist = require('../trackToPlaylist/trackToPlaylistModel.js');
var Playlists = require('../playlists/playlistsModel.js');

module.exports = {
    addTrackToPlayList: function (req, res) {
        console.log('adding....');

        var newListObj = req.body.newTrackToPlaylist;

        TrackToPlaylist.create(newListObj, function (err, list) {
            if (err) { // notifies if error is thrown
                console.log("mongo create list err: ", err);
                helper.sendError(err, req, res);
            } else { // list created, sends 201 status
                //res.status(201);
                res.json(list);
            }
        });
    },

    // getOneList method
    getTracksByPlaylistID: function (req, res) {
        var listid = req.params.id;

        TrackToPlaylist.find({'playlist_id': listid}, function (err, list) {
            if (err) { // notifies if error is thrown
                console.log("mongo findOne list err: ", err);
                helper.sendError(err, req, res);
            } else {
                if (!list) { // notifies if list is not found
                    helper.sendError("List not found", req, res);
                } else { // list found, returns list
                    res.json(list);
                }
            }
        });
    },

    getTrackById: function (req, res) {
        var trackID = req.params.id;

        TrackToPlaylist.findOne({'track_id': trackID}, function (err, list) {
            if (err) { // notifies if error is thrown
                console.log("mongo findOne list err: ", err);
                helper.sendError(err, req, res);
            } else {
                if (!list) { // notifies if list is not found
                    helper.sendError("List not found ... sorry", req, res);
                } else { // list found, returns list
                    res.json(list);
                }
            }
        });
    },




    addLikeToTrack: function (req, res) {
        //console.log("rex", req.body);
        var playlistID = req.body.playlistID;
        var trackID = req.body.trackID;
        var userName = req.body.userName;
        console.log("playlistID ", playlistID);
        console.log("trackID: ", trackID);
        console.log("userNamer: ", userName);

        TrackToPlaylist.findOneAndUpdate({'playlist_id': playlistID, 'track_id': trackID},
                                         { "$push": { likes : userName} },
                                         {safe: true, upsert: true},
            function(err, result){
                if (err) { // notifies if error is thrown
                    console.log("mongo update err: ", err);
                } else { // update successful, returns result
                    res.json(result);
                }
        });
    },


    removeLikeFromTrack: function (req, res) {
        var playlistID = req.body.playlistID;
        var trackID = req.body.trackID;
        var userName = req.body.userName;
        console.log("playlistID ", playlistID);
        console.log("trackID: ", trackID);
        console.log("userNamer: ", userName);

        TrackToPlaylist.findOneAndUpdate({'playlist_id': playlistID, 'track_id': trackID},
            { "$pull": { likes : userName} },
            {safe: true, upsert: true},
            function(err, result){
                if (err) { // notifies if error is thrown
                    console.log("mongo update err: ", err);
                } else { // update successful, returns result
                    res.json(result);
                }
            });
    }
};


