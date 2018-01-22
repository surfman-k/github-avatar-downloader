var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

//Checks if arguments were given by user
  if(!repoOwner || !repoName)
    console.log("Please enter both an owner and a name!");

//API request options. Keeps Github Token secret by using module
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

//Requests data from api and parses it
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

//Function that will download picture from avatar url and put it into the specified filepath
function downloadImageByURL(url, filePath) {
  request.get(url).pipe(fs.createWriteStream(filePath));
}

//Callback function that takes each contributor and finds their avatar url and login info
function callback(err, result){
   console.log("Errors:", err);
    for(var i = 0; i < result.length; i++){
      downloadImageByURL(result[i].avatar_url, ("./avatars/" + result[i].login + ".jpg"));
    }
}

//main function call that uses command line arguments
getRepoContributors(input[0], input[1], callback);
