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

//Agente_Destinazione.Agente_Destinazione-yes.Agente-NumeroPasseggeri-yes.Agente-CittaDiPartenza-yes.Agente-GiornoPartenza-yes.Agente-OraPartenza-yes

var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/webhook',function (req,res)  {

    if(req.body.queryResult.action == Agente_Destinazione.Agente_Destinazione-yes.Agente-NumeroPasseggeri-yes.Agente-CittaDiPartenza-yes.Agente-GiornoPartenza-yes.Agente-OraPartenza-yes) {

        superagent.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00')
        .end((err, resp) => {
            if (err) { return console.log(err); }

            var respBody = resp.text;
            var bodyJSON = JSON.parse(respBody);

            var respJSON = {
              "payload": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Scegli un'opzione"
                        }
                      }
                    ]
                  },
                  "systemIntent": {
                    "intent": "actions.intent.OPTION",
                    "data": {
                      "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                      "listSelect": {
                        "title": "Veicoli disponibili",
                        "items": [
                          {
                            "optionInfo": {
                              "key": "first title key"
                            },
                            "description": "Prezzo: € " + bodyJSON['0']['price'] + ", Info: " + bodyJSON['0']['info'],
                            "image": {
                              "url": "http://quote.moveolux.com:8080/assets/img/cars/c" + bodyJSON['0']['category'] + ".jpg",
                              "accessibilityText": bodyJSON['0']['categoryName']
                            },
                            "title": "req.body.queryResult.parameters.email"
                          },
                          {
                            "optionInfo": {
                              "key": "second"
                            },
                            "description": "Prezzo: € " + bodyJSON['1']['price'] + ", Info: " + bodyJSON['1']['info'],
                            "image": {
                              "url": "http://quote.moveolux.com:8080/assets/img/cars/c" + bodyJSON['1']['category'] + ".jpg",
                              "accessibilityText": bodyJSON['1']['categoryName']
                            },
                            "title": "2° - " + bodyJSON['1']['categoryName']
                          },
                          {
                            "optionInfo": {
                              "key": "third"
                            },
                            "description": "Prezzo: € " + bodyJSON['2']['price'] + ", Info: " + bodyJSON['2']['info'],
                            "image": {
                              "url": "http://quote.moveolux.com:8080/assets/img/cars/c" + bodyJSON['2']['category'] + ".jpg",
                              "accessibilityText": bodyJSON['2']['categoryName']
                            },
                            "title": "3° - " + bodyJSON['2']['categoryName']
                          }
                        ]
                      }
                    }
                  }
                }
              }
        };



        //if(bodyJSON['3']['price'] == undefined) {
          //respJSON['payload']['google']['systemIntent']['data']['listSelect']['items'].remove(3);
          /*var appFourth = {
                            "optionInfo": {
                              "key": "fourth"
                            },
                            "description": "Prezzo: € " + bodyJSON['3']['price'] + ", Info: " + bodyJSON['3']['info'],
                            "image": {
                              "url": "http://quote.moveolux.com:8080/assets/img/cars/c" + bodyJSON['3']['category'] + ".jpg",
                              "accessibilityText": bodyJSON['3']['categoryName']
                            },
                            "title": "4° - " + bodyJSON['3']['categoryName']
                          };

          respJSON.append(appFourth);*/
        //}


        return res.json(respJSON);


    //if(req.body.queryResult.)

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