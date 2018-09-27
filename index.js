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
var numPass = "";
var partLoc = "";
var partStreet = "";
var partCity = "";
var destLoc = "";
var destStreet = "";
var destCity = "";
var dataPart = "";
var oraPart = "";
var mail = "";
var bodyJSON = {};

var distanzaPerc = "";
var tempoPerc = "";

var todayDate = new Date();

// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/webhook',function (req,res)  {

  superagent.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00')
  .end((err, resp) => {
    var respBody = resp.text;
    bodyJSON = JSON.parse(respBody);

  });

  function listaVeicoli(opz) {
        var opzText = "Scegli un'opzione";
        if(opz == 1) {
          opzText = "L'indirizzo email è stato cambiato. Scegli un'opzione";
        }

        var respJSONtemp = {
          "payload": {
            "google": {
              "expectUserResponse": true,
              "richResponse": {
                "items": [
                {
                  "simpleResponse": {
                    "textToSpeech": opzText
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

        return respJSONtemp;

  }

  if(req.body.queryResult.intent.displayName == "Agente-Mail") {

    mail = req.body.queryResult.parameters.email;

    /*var respBody = resp.text;
    var bodyJSON = JSON.parse(respBody);*/

    var respJSON = listaVeicoli(0);
  

    return res.json(respJSON);

  } else {

    var respJSON2 = {};

    switch(req.body.queryResult.intent.displayName) {

            case "Agente_Destinazione":
              destLoc = req.body.queryResult.parameters.luogo;
              destStreet = req.body.queryResult.parameters.indirizzo;
              destCity = req.body.queryResult.parameters.destinazione;

              respJSON2 = {
                "fulfillmentText": "Si, certamente! Per quante persone vorrebbe l'auto?"
              };
            break;

            case "Agente-NumeroPasseggeri":
              numPass = req.body.queryResult.parameters.Num_passeggeri;
              respJSON2 = { 
                "fulfillmentText": "Perfetto, mi dica da dove vuole partire."
              };
            break;

            case "Agente-CittaDiPartenza":
              partLoc = req.body.queryResult.parameters.luogo_part;
              partStreet = req.body.queryResult.parameters.indirizzo_part;
              partCity = req.body.queryResult.parameters.partenza;

              respJSON2 = {
                "fulfillmentText": "Bene, per quale giorno prenoterebbe l'auto?"
              };
            break;

            case "Agente-GiornoPartenza":
              dataPart = req.body.queryResult.parameters.date;
              var temp = dataPart.substring(0,10);
              dataPart = temp;
              var quoteDate = new Date(dataPart);

              if ((quoteDate.getTime() + 86400000) > todayDate.getTime()) {
                respJSON2 = {
                "fulfillmentText": "Per che ora gradirebbe partire?"
                };
              } else {
                respJSON2 = {
                  "fulfillmentText": "La data di partenza deve essere almeno domani. Per favore ripetere la data.",
                  "followupEventInput": {
                    "name": "Agente-GiornoPartenza",
                    "languageCode": "it-IT",
                    "parameters": {
                      "param": "param value"
                    }
                  }
                };
              }
              
            break;

            case "Agente-OraPartenza":
              oraPart = req.body.queryResult.parameters.time;
              var temp2 = oraPart.substring(11,16);
              oraPart = temp2;

              respJSON2 = {
                "fulfillmentText": "Mi servirebbe cortesemente la sua mail?"
              };
            break;

            case "Agente-Conferma":

            superagent.get(mapMatrixUrl)
              .end((err3, resp3) => {

              var respBody2 = resp3.text;
              var bodyJSON2 = JSON.parse(respBody2);

              var distanzaPercApi = bodyJSON2['rows']['0']['elements']['0']['distance']['text'];
              var tempoPercApi = bodyJSON2['rows']['0']['elements']['0']['duration']['text'];

              if (destStreet != "") {
                var destString = destStreet + ", " + destCity;
              } else if (destStreet == "" && destLoc != "") {
                var destString = destLoc + ", " + destCity;
              } else {
                var destString = destCity;
              }

              if (partStreet != "") {
                var partString = partStreet + ", " + partCity;
              } else if (partStreet == "" && partLoc != "") {
                var partString = partLoc + ", " + partCity;
              } else {
                var partString = partCity;
              }

              var mapMatrixUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Milano,ITALY&destinations=Roma,ITALY&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";
              var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?path=weight:5|" + partCity + ",ITALY|" + destCity + ",ITALY" + "&size=600x300&maptype=roadmap&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";

              
                

              respJSON2 = {
                  "payload": {
                    "google": {
                      "expectUserResponse": true,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": "Riepilogo richiesta preventivo. Conferma?"
                            }
                          },
                          {
                            "basicCard": {
                              "title": "Conferma dati",
                              "formattedText": "**Partenza**: " + partString + "\n  \n**Destinazione**: " + destString + "\n  \n**Data**: " + dataPart + "\n  \n**Ora**: " + oraPart + "\n  \n**Distanza**: " + distanzaPercApi + ", **Durata prevista**: " + tempoPercApi + "\n  \n**Passeggeri**: " + numPass + "\n  \n**Email**: " + mail,
                              "image": {
                                "url": mapUrl,
                                "accessibilityText": "Map"
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

              });


          

              
            break;

            case "Agente_Destinazione-no":
              destCity = req.body.queryResult.parameters.destinazione;
              respJSON2 = {
                "fulfillmentText": "La destinazione è stata cambiata. Per quante persone?"
              };
            break;

            case "Agente-NumeroPasseggeri-no":
              numPass = req.body.queryResult.parameters.Num_passeggeri;
              respJSON2 = {
                "fulfillmentText": "Il numero di passeggeri è stato cambiato. Da dove dovrebbe partire?"
              };
            break;

            case "Agente-CittaDiPartenza-no":
              partCity = req.body.queryResult.parameters.partenza;
              respJSON2 = {
                "fulfillmentText": "La città di partenza è stata cambiata. Che giorno vuole partire?"
              };
            break;

            case "Agente-GiornoPartenza-no":
              dataPart = req.body.queryResult.parameters.date;

              var temp3 = dataPart[0].substring(0,10);
              dataPart = temp3;
              var quoteDate3 = new Date(dataPart);

              /*respJSON2 = {
                "fulfillmentText": "La data di partenza è stata cambiata. A che ora desidera partire? dataPart: " + dataPart
              };*/

              if ((quoteDate3.getTime() + 86400000) > todayDate.getTime()) {
                respJSON2 = {
                "fulfillmentText": "La data di partenza è stata cambiata. A che ora desidera partire?"
                };
              } else {
                respJSON2 = {
                  "fulfillmentText": "La data di partenza deve essere successiva ad oggi. Per favore ripetere la data.",
                  "followupEventInput": {
                    "name": "Agente-GiornoPartenza-no",
                    "languageCode": "it-IT",
                    "parameters": {
                      "param": "param value"
                    }
                  }
                };
              }
            break;

            case "Agente-OraPartenza-no":
              oraPart = req.body.queryResult.parameters.time;
              respJSON2 = {
                "fulfillmentText": "L'ora di partenza è stata modificata. Mi potrebbe dire il suo indirizzo email?"
              };
            break;

            case "Agente-Mail-no":
              mail = req.body.queryResult.parameters.email;
              respJSON2 = listaVeicoli(1);
            break;
            
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