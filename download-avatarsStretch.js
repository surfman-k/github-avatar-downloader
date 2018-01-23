require('dotenv').config();
var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');
function getRepoContributors(repoOwner, repoName, cb) {

//Checks if arguments were given by user
  if(input.length !== 2){
    console.log("Please enter a Repo owner and a Repo name!");
    return;
  }

//API request options. Keeps Github Token secret by using module
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.TOKEN
    }
  };

//Verifies that Repo Owner and Name exist
  request(options).on('response', function (response) {                           
         if(response.statusCode !== 200){
          console.log(response.statusMessage);
          console.log("Repo or Owner does not exist");
        }
       });

//Requests data from api and parses it
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

//Function that will download picture from avatar url and put it into the specified filepath
function downloadImageByURL(url, filePath) {
  request.get(url).pipe(fs.createWriteStream(filePath));
  if(filePath.slice(0,10) !== "./avatars/"){
    console.log("Please make sure you have an 'avatars' folder in your current directory!");
  }
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
