require('./package.json');
var response = require('response');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var args = process.argv;

var songOrMovie = '';
var artist = '';

function tweets() {
    keys.twitterKeys.get('statuses/user_timeline', 'hodlfast', function (error, tweets, response) {

        if (!error && response.statusCode === 200) {
            console.log("User's last 20 tweets are: ");
            for (i = 0; i < 20; i++) {
                console.log(tweets[i].text);
            }
        }
    })
};

function spotify(query) {
    songOrMovie = process.argv[3];
    if (songOrMovie === undefined) {
        songOrMovie = "The Sign";
        var band = "Ace of Base";

        keys.spotifyKeys.search({
            type: 'track' || 'artist', query: band || songOrMovie
        }, function (error, data) {
            console.log("The song is:");
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
        })

    } else {
        songOrMovie = process.argv[3];
        // if the song title is longer than a single word
        for (i = 4; i < args.length; i++) {
            songOrMovie += "+" + args[i];
        }
        keys.spotifyKeys.search({
            type: 'track', query: songOrMovie
        }, function (error, data) {
    
            console.log("The song is:");
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
        })
    }
};

function movies() {
    songOrMovie = process.argv[3];
    if (songOrMovie === undefined) {
        songOrMovie = "Mr. Nobody";
        var queryURL = "http://www.omdbapi.com/?t=" + songOrMovie + "&y=&plot=short&apikey=40e9cece";

        request(queryURL, function (error, response, body) {
            console.log("Since you didn't pick a movie, I picked one for you! Your movie is: ");
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log("Starring: " + JSON.parse(body).Actors);
        });
    }
    else {
        // songOrMovie = process.argv[3];
        for (i = 4; i < args.length; i++) {
            songOrMovie += "+" + args[i];
        }
        var queryURL = "http://www.omdbapi.com/?t=" + songOrMovie + "&y=&plot=short&apikey=40e9cece";

        request(queryURL, function (error, response, body) {
            console.log("Your movie is: ");
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log("Starring: " + JSON.parse(body).Actors);
        });
    }
};

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        var dataArray = data.split(',');

        if (dataArray[0] === "spotify-this-song") {
            songOrMovie = dataArray[1];
            keys.spotifyKeys.search({
                type: 'track', query: songOrMovie
            }, function (error, data) {

                console.log("The song is:");
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].external_urls.spotify);
                console.log(data.tracks.items[0].album.name);
            })
        } else if (dataArray[0] === "my-tweets") {
            keys.twitterKeys.get('statuses/user_timeline', 'hodlfast', function (error, tweets, response) {

                if (!error && response.statusCode === 200) {
                    console.log("User's last 20 tweets are: ");
                    for (i = 0; i < 20; i++) {
                        console.log(tweets[i].text);
                    }
                }
            })
        } else if (dataArray[0] === "movie-this") {
            songOrMovie = dataArray[1];
            var queryURL = "http://www.omdbapi.com/?t=" + songOrMovie + "&y=&plot=short&apikey=40e9cece";

            request(queryURL, function (error, response, body) {
                console.log("Your movie is: ");
                console.log(JSON.parse(body).Title);
                console.log(JSON.parse(body).Year);
                console.log("IMDB rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
                console.log(JSON.parse(body).Country);
                console.log(JSON.parse(body).Language);
                console.log(JSON.parse(body).Plot);
                console.log("Starring: " + JSON.parse(body).Actors);
            });
        }
        else {
            console.log("I'm sorry Dave, I did not understand that command. Would you like me to open the pod bay doors instead? Muahhahahahahaha!")
        }
    })
};

if (command === 'my-tweets') {
    tweets();
}
else if (command === 'spotify-this-song') {
    spotify();
}
else if (command === 'movie-this') {
    movies();
}
else if (command === 'do-what-it-says') {
    doIt();
}
else {
    console.log("I'm sorry Dave, I did not understand that command. Would you like me to open the pod bay doors instead? Muahhahahahahaha!")
}
