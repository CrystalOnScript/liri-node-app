var twitterKeys = require('./keys.js');

var Twitter = require('twitter');

var spotify = require('spotify');

var request = require('request');

var fs = require('fs');

var command = process.argv[2];

var whatIsIt = process.argv.slice(3);


function tellMe(command){

	switch(command){
		case 'my-tweets':
		getTweets();
		break;

		case 'spotify-this-song':
		spotifySong(whatIsIt);
		break;

		case 'movie-this':
		movieData();
		break;

		case 'do-what-it-says':
		doIt();
		break;
	}
}


// var parameters = process.argv.slice([3]);

function getTweets(){

	var client = new Twitter({
	  consumer_key: twitterKeys.twitterKeys.consumer_key,
	  consumer_secret: twitterKeys.twitterKeys.consumer_secret,
	  access_token_key: twitterKeys.twitterKeys.access_token_key,
	  access_token_secret: twitterKeys.twitterKeys.access_token_secret
	});

	  var returned = " ";
	
	client.get('statuses/user_timeline', function(error, tweets, response) {

		console.log(tweets)

		if(error) throw error;

		for (i=0; i<20; i++)
        {
            //console.log(tweets[i].text);
            returned += '\n'+tweets[i].user.screen_name;
            returned += '\n'+tweets[i].text;
             returned += '\n'+tweets[i].created_at;
            returned += '\r\n';
        }
        console.log(returned);
		  
	   
	  });
}

function spotifySong(whatIsIt){

	var returned = " ";

	if(whatIsIt.length < 1){
    	whatIsIt = 'never gonna give you up'
    }
    	spotify.search({ type: 'track', query: whatIsIt }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
		 	
		 	var firstResult = data.tracks.items[0];

		 	returned += '\n Artist: ' +firstResult.artists[0].name;
		 	returned += '\n Name: '+ firstResult.name;
		 	returned += '\n Listen: '+ firstResult.external_urls.spotify;
		 	returned += '\n Albulm: '+ firstResult.album.name
		 	returned += '\r\n';
		    console.log(returned)

	})


}

function movieData(){
	var returned = ' ';

	if(whatIsIt.length < 1){
    	whatIsIt = 'Mr. Nobody'
    }
    request("http://www.omdbapi.com/?t="+whatIsIt+"&y=&plot=short&r=json", function(err, response, body){

    	returned += '\n Movie: ' + JSON.parse(body).Title;
    	returned += '\n Released: ' + JSON.parse(body).Year;
    	returned += '\n Rated: ' + JSON.parse(body).imbdRating;
    	returned += '\n Country: ' + JSON.parse(body).Country;
    	returned += '\n Language: ' + JSON.parse(body).Language;
    	returned += '\n\n Plot: ' + JSON.parse(body).Plot +'\n';
    	returned += '\n Actors: ' + JSON.parse(body).Actors;
    	returned += '\n Website: ' + JSON.parse(body).Website;
    	returned += '\n RT Rated: ' + JSON.parse(body).Ratings[1].Value + '\n'
    	
    	console.log(response)
    	console.log(returned);
    

	})


}

function doIt(){
	var doItFile = 'random.txt';

	fs.readFile(doItFile, 'utf8', function(err, data){
		if (err){
			console.log(err);
		}

		var commandArray = data.split(',');

		console.log(commandArray);

		command = commandArray[0];
		whatIsIt = commandArray[1];
		tellMe(command);


	})
}

function logMe(){

	var logfile = 'log.txt';

	var dataJoin = whatIsIt.join('');

	var dataLog = command + ',' + '"'+dataJoin+'"'+'\n';

	fs.appendFile(logfile, dataLog, function(err){
		if(err) throw err;
		console.log('Logged!')
	})
}


tellMe(command);
logMe();

