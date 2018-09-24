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
          /*"outputContexts": [
              {
                "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/agente_destinazione-followup",
                "lifespanCount": 2,
                "parameters": {
                  "street-address1": req.body.queryResult.parameters.street-address1,
                  "geo-city1": req.body.queryResult.parameters.geo-city1
                }
              }
            ],*/
          "fulfillmentText": "Si, certamente! Per quante persone vorrebbe l'auto ?"
        /*"followupEventInput": {
          "name": "Agente_Destinazione",
          "languageCode": "it-IT",
          "parameters": {
            "param": "param value"
          }
        }*/};
      break;

      case "Agente-NumeroPasseggeri":
          numPass = req.body.queryResult.parameters.Num_passeggeri;
          respJSON2 = { 
            /*"outputContexts": [
            {
              "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/agente_destinazione-followup",
              "lifespanCount": 1,
              "parameters": {
                "Num_passeggeri": req.body.queryResult.parameters.Num_passeggeri,
                "geo-city1": req.body.queryResult.parameters.geo-city1,
                "street-address1": req.body.queryResult.parameters.street-address1
              }
            },
            {
              "name": "projects/${PROJECT_ID}/agent/sessions/${SESSION_ID}/contexts/agente-numeropasseggeri-followup",
              "lifespanCount": 2,
              "parameters": {
                "Num_passeggeri": req.body.queryResult.parameters.Num_passeggeri
              }
            }
        
          ],*/
            "fulfillmentText": "Perfetto, mi dica da dove vuole partire."
            /*"followupEventInput": {
              "name": "Agente-NumeroPasseggeri",
              "languageCode": "it-IT",
              "parameters": {
                "param": "param_value"
              }
            }*/};
            break;

            case "Agente-CittaDiPartenza":
            //partCity = req.body.queryResult.parameters.geo-city;
            respJSON2 = {
            "fulfillmentText": "Bene !! Per quale giorno prenoterebbe l'auto ?"
            /*"followupEventInput": {
              "name": "Agente-CittaDiPartenza",
              "languageCode": "it-IT",
              "parameters": {
                "param": "param value"
              }
            }*/};
            break;

            case "Agente-GiornoPartenza":
            respJSON2 = {"fulfillmentText": "Per che ora gradirebbe partire ?"
            /*"followupEventInput": {
              "name": "Agente-GiornoPartenza",
              "languageCode": "it-IT",
              "parameters": {
                "param": "param value"
              }
            }*/};
            break;

            case "Agente-OraPartenza":
            respJSON2 = {"fulfillmentText": "Mi servirebbe cortesemente la sua mail ?"
            /*"followupEventInput": {
              "name": "Agente-OraPartenza",
              "languageCode": "it-IT",
              "parameters": {
                "param": "param value"
              }
            }*/};
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
                      /*{
                        "basicCard": {
                          "title": "Città di partenza: " + mail + ", città arrivo: " + destCity,
                          "image": {
                            "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                            "accessibilityText": "Google Logo"
                          },
                          "buttons": [
                            {
                              "title": "Button Title",
                              "openUrlAction": {
                                "url": "https://www.google.com"
                              }
                            }
                          ],
                          "imageDisplayOptions": "WHITE"
                        }
                      }*/
                      {
                        "tableCard": {
                          "title": "AoG Table Card title",
                          "subtitle": "AoG Table Card subtitle",
                          "image": {
                            "url": "",
                            "accessibilityText": "Image description for screen readers"
                          },
                          "columnProperties": [
                            {
                              "header": "Header 1"
                            },
                            {
                              "header": "Header 2",
                              "horizontalAlignment": "CENTER"
                            },
                            {
                              "header": "Header 3",
                              "horizontalAlignment": "CENTER"
                            }
                          ],
                          "rows": [
                            {
                              "cells": [
                                {
                                  "text": "Cell A1"
                                },
                                {
                                  "text": "Cell A2"
                                },
                                {
                                  "text": "Cell A3"
                                },
                                "dividerAfter": true
                              ]
                            },
                            {
                              "cells": [
                                {
                                  "text": "Cell B1"
                                },
                                {
                                  "text": "Cell B2"
                                },
                                {
                                  "text": "Cell B3"
                                }
                              ]
                            },
                            {
                              "cells": [
                                {
                                  "text": "Cell C1"
                                },
                                {
                                  "text": "Cell C2"
                                },
                                {
                                  "text": "Cell C3"
                                }
                              ]
                            }
                          ],
                          "buttons": [
                            {
                              "title": "Button title",
                              "openUrlAction": {
                                "url": ""
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              }
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