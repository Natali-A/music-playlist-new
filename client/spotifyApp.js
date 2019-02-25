/**
 * Created by Natali on 12/24/2018.
 */
const auth = require('spotify-personal-auth');
const SpotifyWebApi = require('spotify-web-api-node');

// Configure module
auth.config({
    clientId: '2e23ac219fa04c92bf1c870156ed0c83', // Replace with your client id
    clientSecret: 'beb1afe554d24776baebefad3dcfe6e7', // Replace with your client secret
    scope: ['user-modify-playback-state', 'user-top-read'], // Replace with your array of needed Spotify scopes
    path: '/path/to/a/tokens.json' // Optional path to file to save tokens (will be created for you)
});

const api = new SpotifyWebApi();

/* Get token promise, the token will refresh if this is called when it has expired,
 * But you can get the refresh token if you would rather handle it
 * It is resolve as an array containing the token and refresh as shown below
 */
debugger;

function a1 (token, refresh) {
    api.setAccessToken(token);
    api.setRefreshToken(refresh);

    return api.getMyTopTracks();
};
function getUser(id) {
    return api.getUser(id);
};
function a22(item) {
    return item['uri'];
}

function a2(data) {
    api.play({
        uris: data['body']['items'].map(a22)
    });
}
auth.token().then(a1).then(a2).catch(console.log);