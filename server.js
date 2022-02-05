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
// app.use(bodyparser.urlencoded({ extended: true }))  
app.use(express.static("public"))
// app.use(express.urlencoded());
app.use(bodyparser.json())


// connect to database 
const url = "mongodb+srv://floar-admin:floarpass@cluster0.t2uu7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongo = new MongoClient(url)
mongo.connect(); 

// index
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

// route to pull all NBA teams and send them to client 
app.get('/teams', (req, res) => {
  var options = { 
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/teams/league/standard',
    headers: {
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': '71b806f988msh6c00084b722b3a3p17923cjsnee5cd7d8c0af',
      useQueryString: true
    }
  }

  request(options, function (error, response, body) {
	  if (error) throw new Error(error);
    console.log("Response recieved. \n")
    // format list of teams and send them to client
    JsonOutput = JSON.parse(body)
    var teams = JsonOutput.api.teams
    res.send(teams)
  })
})

// Route to match games with teams that user has chosen, then sends list of those games to client
app.get('/games', (req, res) => {
  var options = { 
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/games/seasonYear/2020',
    headers: {
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': '71b806f988msh6c00084b722b3a3p17923cjsnee5cd7d8c0af',
      useQueryString: true
    }
  }
    // get all games played in 2020 from API
  request(options, function (error, response, body) {
	  if (error) throw new Error(error);
    console.log("Response recieved. \n")
    JsonOutput = JSON.parse(body)
    allGames = JsonOutput.api.games
    
    // get teams chosen by user 1 in database 
    mongo.db("floarDb").collection("floarCollection").findOne({userid: "1"}, function(err, result){
      if (err) throw err
      userTeams = result.teams
      // make array of games that include teams from user 
      const filteredGames = allGames.filter(game => {
        return userTeams.includes(game.hTeam.teamId)
      })
      console.log(filteredGames)
      res.send(filteredGames)
    })
  })
})

// post router to edit teams that the user likes 
app.put('/teams', (req, res) => { 
  // var newTry = JSON.parse(req.body.newTeams)
  mongo.db("floarDb").collection("floarCollection").updateOne(
    {userid: "1"},
    {$set: {"teams": req.body.newTeams}}
  )
  res.send('Floar Server')
})

// start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`server running...`)
})
