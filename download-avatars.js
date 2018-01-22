var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var input = process.argv.slice(2);

var output = {};

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

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

getRepoContributors(input[0], input[1], function(err, result) {
  
  console.log("Errors:", err);
    for(var i = 0; i < result.length; i++){
      //console.log('Avatar: ', result[i].avatar_url);
      output[result[i].login] = result[i].avatar_url;
    }
       console.log(output);
});

function downloadImageByURL(url, filePath) {
  request.get(url).pipe(fs.createWriteStream(filePath));
}

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg");

