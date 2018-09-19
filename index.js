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

            var catName1 = bodyJSON['0']['categoryName'];

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

        return res.json(
{
  "payload": {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "carouselBrowse": {
              "items": [
                {
                  "title": bodyJSON['0']['categoryName'],
                  "openUrlAction": {
                    "url": "https://google.com"
                  },
                  "description": "Description of item 1",
                  "footer": "Item 1 footer",
                  "image": {
                    "url": "https://developers.google.com/actions/assistant.png",
                    "accessibilityText": "Google Assistant Bubbles"
                  }
                },
                {
                  "title": "Title of item 2",
                  "openUrlAction": {
                    "url": "https://google.com"
                  },
                  "description": "Description of item 2",
                  "footer": "Item 2 footer",
                  "image": {
                    "url": "https://developers.google.com/actions/assistant.png",
                    "accessibilityText": "Google Assistant Bubbles"
                  }
                }
              ]
            }
          }
        ]
      },
      "userStorage": "{\"data\":{}}"
    }
  },
  "outputContexts": [
    {
      "name": "projects/temperatureconvertersample/agent/sessions/518488a5-09f6-4a36-8950-942f595b70b8/contexts/_actions_on_google",
      "lifespanCount": 99,
      "parameters": {
        "data": "{}"
      }
    }
  ]
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