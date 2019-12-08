const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const internModels = require('./internModels');
const coursesModels = require('./coursesModels');

async function connectToMongoDb () {
    await mongoose.connect("mongodb://127.0.0.1:27017:/MentorBot",{
        useNewUrlParser:true,
        useCreateIndex: true,
         useUnifiedTopology: true 
    });
    console.log("Connected");
}

var app = express();
var PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());                 //Parsing incoming JSON to objects so that we can access it usinng 'dot operator'


// Route

app.get('/',async(req,res) => {

async function runSample(projectId = 'test-mfqxln') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  var query = "I want to learn Java";

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  if (result.intent.displayName === "Subject") {
    coursesModels.find({title: /neural networks/ }).then((docs)=>{
      console.log("Ferran",docs);
    }).catch((err)=>{
      console.error(err);
    });
  } else if(result.intent.displayName === "Internships") {
    internModels.find({title: { $eq: "content writer" }}).then((docs)=>{
      console.log("Rahul",docs);
    }).catch((err)=>{
      console.error(err);
    });
  }
}

runSample();

});


app.listen(PORT,(req,res)=>{
    console.log("Server is up & running on",PORT);
})

async function main(){
  await connectToMongoDb();
}

main();