// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');

var unirest = require("unirest");


let errorResposne = {
    results: []
};

var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/getMovies',function (req,res)  {

    /*if(request.body.queryResult.parameters['vehicle']) {
        return response.json({
              fulfillmentText: 'Prova'
        });
    }*/

    if(req.body.queryResult.allRequiredParamsPresent) {

        https.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00', (resp) => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
            return res.json( {
                fulfillmentText: 'Resp: ' + JSON.parse(data).explanation
            });
          });

            }).on("error", (err) => {
              console.log("Error: " + err.message);
        });
        
    }


  
});


server.get('/getName',function (req,res){
    res.send('Swarup Bam PRO 3');
    console.log("GETNAME LOG");

});

server.listen(port, function () {
    console.log("Server is up and running...");
});