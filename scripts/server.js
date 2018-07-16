console.log("Starting Academy Days Test Tool...");

//Create app using express.js
const port = process.env.PORT || 3000;
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dir = path.join(__dirname, "../");

const api_key = process.env.api_key;
const api_secret = process.env.api_secret;
const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);
let email;

app.use(express.static(dir));
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());
app.listen(port, () => console.log("Academy Days Test Tool started on port " + port));

//Post to the appropriate file depending on the req.body.id value
app.post("/email", function(req, res) {
    const endpoint = req.body.id;
    const scripts_url = "./backend/";
    let data = req.body.data;
    data = JSON.parse(data);
    if (data.email) {
        email = data.email;
    }
    data.api_key = api_key;
    data.api_secret = api_secret;
    data = JSON.stringify(data);

    if (endpoint == "browse" || endpoint == "cart") {
        sailthru.apiPost("user", {
            id: email,
            fields: {
                keys : 1
            }
        }, 
            function(err,response) {
                if (err) {
                    res.send(response);
                }
                else if (response) {
                    res.send(response);
                }
            }
        );
        if (endpoint == "cart") {
            setTimeout(function() {
                sailthru.apiPost("purchase", {
                    "email": email,
                    "items":
                    [
                        {
                            "qty": 1,
                            "title": "Spider-Man Bobble Head",
                            "price": 1199,
                            "id": "AF15",
                            "tags": [
                                "cart",
                                "abandon",
                                "test",
                                "spider-man"
                            ],
                            "vars": {
                                "item-type" : "bobble-head"
                            },
                            "url": "http://links.stevedoesitall.com/join/cart"
                        }
                    ],
                    "incomplete": 1
                }, 
                    function(err,response) {
                        if (err) {
                            console.log(err);
                        }
                        else if (response) {
                            console.log(response);
                        }
                    }
                );
            }, 2000);
        }
        else if (endpoint == "browse") {
            sailthru.apiPost("purchase", {
                "email": email,
                "items":
                [ ],
                "incomplete": 1
            }, 
                function(err,response) {
                    if (err) {
                        console.log(err);
                    }
                    else if (response) {
                        console.log(response);
                    }
                }
            );
        }
    }

    else if (endpoint == "lists") {
        console.log("List API running...");

        sailthru.apiGet("list", { 
            type : "normal",
            primary: true,
            fields: {
                vars: 1
            }
        }, 
            function(err,response) {
                if (err) {
                    res.send(err);
                }
                else if (response) {
                    res.send(response);
                }
            }
        );
    }

    else if (endpoint == "templates") {
        sailthru.apiGet("template", { }, 
            function(err,response) {
                if (err) {
                    res.send(err);
                }
                else if (response) {
                    res.send(response);
                }
            }
        );
    }

    else {
        const api_call = require(scripts_url + endpoint + ".js");
        api_call.data_post(data);
    }
});