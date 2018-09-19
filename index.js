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
server.post('/webhook',function (req,res)  {

    if(req.body.queryResult.allRequiredParamsPresent) {

        superagent.get('http://quote.moveolux.com:88/home/testquote?from=milano&to=roma&day=13/12/2018&time=10:00')
        .end((err, resp) => {
            if (err) { return console.log(err); }

            var respBody = resp.text;
            var bodyJSON = JSON.parse(respBody);

            return res.json({
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
                              "url": "https://drive.google.com/uc?id=1QnH0vS2yWTgIrzWtWU3So2TlY_rx9a3h",
                              "accessibilityText": "first alt"
                            },
                            "title": bodyJSON['0']['categoryName']
                          },
                          {
                            "optionInfo": {
                              "key": "second"
                            },
                            "description": "Prezzo: € " + bodyJSON['1']['price'] + ", Info: " + bodyJSON['1']['info'],
                            "image": {
                              "url": "https://drive.google.com/uc?id=1QnH0vS2yWTgIrzWtWU3So2TlY_rx9a3h",
                              "accessibilityText": "second alt"
                            },
                            "title": bodyJSON['1']['categoryName']
                          },
                          {
                            "optionInfo": {
                              "key": "third"
                            },
                            "description": "Prezzo: € " + bodyJSON['2']['price'] + ", Info: " + bodyJSON['2']['info'],
                            "image": {
                              "url": "https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw",
                              "accessibilityText": "second alt"
                            },
                            "title": bodyJSON['2']['categoryName']
                          }
                        ]
                      }
                    }
                  }
                }
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