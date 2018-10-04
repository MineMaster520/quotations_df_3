// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
const superagent = require('superagent');
var unirest = require("unirest");

let errorResponse = {
    results: []
};

var port = process.env.PORT || 8080;

//Variabili (purtroppo) globali, contengono i dati immessi dall'utente
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
var destString = ""; //Stringa che vedrà l'utente nella conferma, contiene tutto
var partString = ""; // ""
var distanzaPercApi = "";
var tempoPercApi = "";

var pointsPath = ""; //Punti del percorso acquisiti da gmaps, codificati

var todayDate = new Date();


var bodyJSON = {};

// create server and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/webhook',function (req,res)  {

//Funzione che restituisce il JSON contenente le opzioni dei veicoli, 'opz' è in base all'intent (se vuole cambiare l'email oppure no)
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


  // Inizio if-else statement (di nuovo, purtroppo) in base all'intent in cui è l'utente


  if(req.body.queryResult.intent.displayName == "Agente-Mail") {

    mail = req.body.queryResult.parameters.email; //Acquisisce il parametro dalla request ricevuta

    var respJSON = listaVeicoli(0); //Richiama la funzione specifica per l'intent

    return res.json(respJSON);


  } else if (req.body.queryResult.intent.displayName != "Agente-Conferma") {

    var respJSON2 = {};

    switch(req.body.queryResult.intent.displayName) { //Switch in base all'intent

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
              var temp = dataPart[0].substring(0,10);
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

          
  } else if (req.body.queryResult.intent.displayName == "Agente-Conferma") {

    var partStringN = "";
    var destStringN = "";

    if (destStreet != "") { // Creazione delle stringhe che visualizzerà l'utente, contenenti tutto l'indirizzo e la città, se presenti
      destString = destStreet + ", " + destCity;
    } else if (destStreet == "" && destLoc != "") {
      destString = destLoc + ", " + destCity;
    } else {
      destString = destCity;
    }

    if (partStreet != "") {
      partString = partStreet + ", " + partCity;
    } else if (partStreet == "" && partLoc != "") {
      partString = partLoc + ", " + partCity;
    } else {
      partString = partCity;
    }

    /*partStringN = partString.replace(/\s/g, "+"); // Ho cercato di mettere tutta la località nell'url, e quindi cambiare gli spazi con
    destStringN = destString.replace(/\s/g, "+");*/ // un "+", ma il programma crasha senza apparente motivo, quindi ho lasciato solo le città

    //Definizione URL per la distanza e il tempo previsti
    var mapMatrixUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + partCity + ",ITALIA&destinations=" + destCity + ",ITALIA&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";
    //Definizione URL per i punti del percorso
    var urlPoints= "https://maps.googleapis.com/maps/api/directions/json?origin=" + partCity + ",ITALIA&destination=" + destCity +",ITALIA&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";


    superagent.get(mapMatrixUrl).end((err3, resp3) => { //Non essendo riuscito a utilizzare l'async, ho dovuto utilizzare questa soluzione
      superagent.get(urlPoints).end((err4, resp4) => {
          var respBody2 = resp3.text;
          var bodyJSON2 = JSON.parse(respBody2); //Acquisizione del JSON del 'mapMatrixUrl', per la distanza e il tempo

          distanzaPercApi = bodyJSON2['rows']['0']['elements']['0']['distance']['text'];
          tempoPercApi = bodyJSON2['rows']['0']['elements']['0']['duration']['text'];

          var respBodyPath = resp4.text;
          var bodyJSONPath = JSON.parse(respBodyPath); // Acquisizione del JSON del 'urlPoints', per i punti del percorso

          pointsPath = bodyJSONPath['routes']['0']['overview_polyline']['points'];

              
          //Definizione URL per la visualizzazione della mappa (non più usata)
          var mapUrl = "https://maps.googleapis.com/maps/api/staticmap?path=weight:5|" + partCity + ",ITALY|" + destCity + ",ITALY" + "&size=600x300&maptype=roadmap&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";
          //Definizione URL per la visualizzazione della mappa con l'utilizzo dei punti del percorso
          var mapPointsUrl = "https://maps.googleapis.com/maps/api/staticmap?path=weight:5|enc:" + pointsPath + "&size=600x300&maptype=roadmap&key=AIzaSyCIeu1JhV_R4AGNnaiv74gHF5t6b-ilVhU";
                

          var respJSONConf = {
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
                                "url": mapPointsUrl,
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

          return res.json(respJSONConf);

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