// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const superagent = require('superagent');

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

        superagent.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00')
        .end((err, resp) => {
            if (err) { return console.log(err); }

            var respBody = resp.text;
            var bodyJSON = JSON.parse(respBody);

            /*return res.json( {
                fulfillmentText: 'Prima opzione: ' + '\nCategoria veicolo: ' + bodyJSON['0']['categoryName'] + '\nPrezzo: € ' + bodyJSON['0']['price'] + '\nInfo: ' + bodyJSON['0']['info']
            });*/

            return res.json( {

                card: {

                    "title": "card title",

                    "subtitle": "card subtitle",

                    "imageUri": "https://example.com/image.jpg",

                    "buttons": [

                        {

                        "text": "Buttle Text",

                        "postback": "https://example.com"

                        }

                    ]

                }

            });

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