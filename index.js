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

            /*return res.json({
                  "payload": {
                    "google": {
                      "expectUserResponse": true,
                      "richResponse": {
                        "items": [
                          {
                            "simpleResponse": {
                              "textToSpeech": "Prima opzione: "
                            }
                          },
                          {
                            "basicCard": {
                              "title": bodyJSON['0']['categoryName'],
                              "image": {
                                "url": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                                "accessibilityText": "Google Logo"
                              },
                              "buttons": [
                                {
                                  "title": "Seleziona",
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
            });*/

        });

        return res.json( {
          "payload": {
            "google": {
              "expectUserResponse": true,
              "richResponse": {
                "items": [
                  {
                    "simpleResponse": {
                      "textToSpeech": "Choose a item"
                    }
                  }
                ]
              },
              "systemIntent": {
                "intent": "actions.intent.OPTION",
                "data": {
                  "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
                  "listSelect": {
                    "title": "Hello",
                    "items": [
                      {
                        "optionInfo": {
                          "key": "first title key"
                        },
                        "description": "first description",
                        "image": {
                          "url": "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
                          "accessibilityText": "first alt"
                        },
                        "title": "first title"
                      },
                      {
                        "optionInfo": {
                          "key": "second"
                        },
                        "description": "second description",
                        "image": {
                          "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                          "accessibilityText": "second alt"
                        },
                        "title": "second title"
                      }
                    ]
                  }
                }
              }
            }
          }
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