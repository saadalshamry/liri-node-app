// ====== options ======== //
// * `concert-this`
// * `spotify-this-song`
// * `movie-this`
// * `do-what-it-says`
//-------------------------//
//-------------------------//
// env 
require("dotenv").config();
// npm packages
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment')
var fs = require('fs')
// ==== PART 1 : BANDSINTOWN API 
function concertThis(x) {
    var artist = x;
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(function (response) {
        response.data.forEach(function (res) {
            console.error('++++++++++++++++++++++++++++');
            console.log('NAME : ', res.venue.name);
            console.log('-----------------------------');
            console.log('VENUE LOCATION : ', res.venue.city + ", " + res.venue.country);
            console.log('-----------------------------');
            console.log('DATE : ', moment(res.datetime).format('YYYY-MM-DD'));
            console.error('++++++++++++++++++++++++++++');
        })
    }).catch(function (err) {
        console.log(err);
    })
}
if (process.argv[2] === "concert-this") {
    concertThis(process.argv[3])
}

// ==== PART 2 : SPOTIFY API 
function spotifyThisSong(x) {
    var q = x || "The Sign";
    spotify
        .search({ type: 'track', query: q, limit: 10 })
        .then(function (response) {
            response.tracks.items.forEach(function (i) {
                console.log("\x1b[33m%s\x1b[0m", '=============================================================')
                // log names
                console.log("\x1b[44m%s\x1b[0m", "SONG NAME :")
                console.log(i.name)
                console.log('------------------------------------')
                // log artisit(S)
                console.log("\x1b[44m%s\x1b[0m", "ARTIST(s) :")
                i.artists.forEach(function (artist) {
                    console.log(artist.name)
                })
                console.log('------------------------------------')
                //LOG PREVIEW 
                console.log("\x1b[44m%s\x1b[0m", 'PREVIEW LINK :')
                console.log(i.preview_url)
            })

        })
        .catch(function (err) {
            console.log("somthing went wrong");
        });
}
if (process.argv[2] === "spotify-this-song") {
    spotifyThisSong(process.argv[3])
}

// ==== PART 3 : SPOTIFY API
function movieThis(x) {
    var q = x || "Mr. Nobody"
    axios.get('http://www.omdbapi.com/?apikey=9120b19e&t=' + q).then(function (res) {
        console.log("\x1b[33m%s\x1b[0m", '=============================================================');
        console.log("\x1b[44m%s\x1b[0m", "TITLE :")
        console.log(res.data.Title)
        console.log("\x1b[44m%s\x1b[0m", "YEAR :")
        console.log(res.data.Year)
        console.log("\x1b[44m%s\x1b[0m", "RATINGS :")
        res.data.Ratings.forEach(function (r) {
            console.log('SOURCE: ', r.Source, ", SCORE: ", r.Value)
        })
        console.log("\x1b[44m%s\x1b[0m", "COUNTRY :")
        console.log(res.data.Country)
        console.log("\x1b[44m%s\x1b[0m", "LANGUAGE :")
        console.log(res.data.Language)
        console.log("\x1b[44m%s\x1b[0m", "PLOT :")
        console.log(res.data.Plot)
        console.log("\x1b[44m%s\x1b[0m", "ACTORS :")
        console.log(res.data.Actors)
    }).catch(function (err) {
        console.log("somthing went wrong");
    })
}
if (process.argv[2] === "movie-this") {
    movieThis(process.argv[3]);
}


// ==== PART 4 : do-what-it-says

if (process.argv[2] === "do-what-it-says") {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        var command = data.split(',')[0];
        var value = data.split(',')[1];
        switch (command) {
            case "spotify-this-song":
                spotifyThisSong(value);
                break;
            case "movie-this":
                movieThis(value)
                break;
            case "concert-this":
                concertThis(value)
                break;
        }
    })
}