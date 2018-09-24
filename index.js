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
var numPass = "";
var partCity = "";
var destCity = "";
var dataPart = "";
var oraPart = "";
var mail = "";
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/webhook',function (req,res)  {


  if(req.body.queryResult.intent.displayName == "Agente-Mail") {

    superagent.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00')
    .end((err, resp) => {
      if (err) { return console.log(err); }

      mail = req.body.queryResult.parameters.email;

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
                    "title": "1° - " + bodyJSON['0']['categoryName']
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


        return res.json(respJSON);



  });



  } else {

    var respJSON2 = {};

    switch(req.body.queryResult.intent.displayName) {

      case "Agente_Destinazione":
        destCity = req.body.queryResult.parameters.destinazione;
        respJSON2 = {
          "fulfillmentText": "Si, certamente! Per quante persone vorrebbe l'auto ?"
        };
      break;

      case "Agente-NumeroPasseggeri":
          numPass = req.body.queryResult.parameters.Num_passeggeri;
          respJSON2 = { 
            "fulfillmentText": "Perfetto, mi dica da dove vuole partire."
          };
            break;

            case "Agente-CittaDiPartenza":
            partCity = req.body.queryResult.parameters.partenza;
            respJSON2 = {
            "fulfillmentText": "Bene !! Per quale giorno prenoterebbe l'auto ?"
            };
            break;

            case "Agente-GiornoPartenza":
            dataPart = req.body.queryResult.parameters.date;
            respJSON2 = {"fulfillmentText": "Per che ora gradirebbe partire ?"
            };
            break;

            case "Agente-OraPartenza":
            oraPart = req.body.queryResult.parameters.time;
            respJSON2 = {"fulfillmentText": "Mi servirebbe cortesemente la sua mail ?"
            };
            break;

            case "Agente-Conferma":
            respJSON2 = {
              "payload": {
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Riepilogo richiesta preventivo:"
                        }
                      },
                      {
                        "basicCard": {
                          "title": "Conferma dati",
                          "formattedText": "**Città di partenza**: " + partCity + "\n  \n**Città di arrivo**: " + destCity + "\n  \n**Data**: " + dataPart + "\n  \n**Ora**: " + oraPart + "\n  \n**Passeggeri**: " + numPass + "\n  \n**Email**: " + mail,
                          "image": {
                            "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            "accessibilityText": "Google Logo"
                          },
                          "buttons": [
                            {
                              "title": "Conferma",
                              "openUrlAction": {
                                "url": "https://www.google.com"
                              }
                            }
                          ],
                          "imageDisplayOptions": "WHITE"
                        }
                      }
                      
                    ]
                  }
                }
              }
            };
            break;

            case "Agente_Destinazione-no":
            destCity = req.body.queryResult.parameters.destinazione;
            respJSON2 = {
              "fulfillmentText": "La destinazione è stata cambiata. Per quante persone?"
            };
            
          }



          return res.json(respJSON2);
        }



      });


server.get('/getName',function (req,res){
    res.send('Swarup Bam PRO 3');
    console.log("GETNAME LOG");

});

server.listen(port, function () {
    console.log("Server is up and running...");
});