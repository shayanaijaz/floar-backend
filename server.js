// packages needed 
const express = require('express')
const request = require('request')
const bodyparser = require('body-parser')
const { MongoClient } = require('mongodb')
const cors = require("cors")
const { all } = require('proxy-addr')
const { type } = require('os')

// init app and database 
const app = express()
app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }))  
app.use(express.static("public"))

// connect to database 
const url = "mongodb+srv://floar-admin:floarpass@cluster0.t2uu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongo = new MongoClient(url)
mongo.connect(); 


// basic test route to check if we can talk to API 
app.get('/', (req, res) => {
  /*
  var options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/teams/city/Atlanta',
    headers: {
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': '71b806f988msh6c00084b722b3a3p17923cjsnee5cd7d8c0af',
      useQueryString: true
    }
  }

  request(options, function (error, response, body) {
	  if (error) throw new Error(error);

    console.log("Response recieved. \n")

    // grab specific info about team and add to console 
    JsonOutput = JSON.parse(body)
    console.log(JsonOutput.api.teams)
    console.log("----------")
    testJson = JsonOutput.api.teams[0].fullName
    console.log(testJson)
  })
  */
  // placeholder website page 
  res.send('Floar Server')
})

// pull all TEAMS
app.get('/teams', (req, res) => {
  var gamesoptions = { 
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/teams/league/standard',
    headers: {
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': '71b806f988msh6c00084b722b3a3p17923cjsnee5cd7d8c0af',
      useQueryString: true
    }
  }

  request(gamesoptions, function (error, response, body) {
	  if (error) throw new Error(error);

    console.log("Response recieved. \n")

    // grab specific info about team and add to console 
    JsonOutput = JSON.parse(body)
    var teams = JsonOutput.api.teams
    console.log(JsonOutput.api.teams)
    res.send(teams)
  })
})

// get info about games from a specific year 
app.get('/games', (req, res) => {
  var gamesoptions = { 
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020',
    headers: {
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': '71b806f988msh6c00084b722b3a3p17923cjsnee5cd7d8c0af',
      useQueryString: true
    }
  }

  request(gamesoptions, function (error, response, body) {
	  if (error) throw new Error(error);

    console.log("Response recieved. \n")

    // get all games played in 2020 from API
    JsonOutput = JSON.parse(body)
    allGames = JsonOutput.api.games
    
    // get user from DB,
    mongo.db("floarDb").collection("floarCollection").findOne({userid: "1"}, function(err, result){
      if (err) throw err;
      console.log(result); 
    })
     
    // loop through all games, print ones that match 
    /*
    for (var i=0; i<allGames.length; i++){
      var game = allGames[i]
      if (game.city == "Atlanta") {
        console.log(game.city)
      }
    }
    */
  })
  // placeholder website page 
  res.send('Floar Games')
})

// start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`server running...`)
})
