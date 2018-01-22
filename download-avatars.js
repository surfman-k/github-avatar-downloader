var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var input = process.argv.slice(2);


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  if(!repoOwner || !repoName)
    console.log("Please enter both an owner and a name!");

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
   cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url).pipe(fs.createWriteStream(filePath));
}

function callback(err, result){
   console.log("Errors:", err);
    for(var i = 0; i < result.length; i++){
      downloadImageByURL(result[i].avatar_url, ("./avatars/" + result[i].login + ".jpg"));
    }
}


getRepoContributors(input[0], input[1], callback);




