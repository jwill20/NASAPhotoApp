/********************************************************************************/
/* Name:       PictureApplication                                               */
/*                                                                              */
/* Purpose:    There is no server side code for the PictureApplication.  Simply */
/*             using the Node project structure to host the web app.            */
/*                                                                              */
/* Interfaces:                                                                  */
/*                                                                              */
/* Author:     Jim Williams                                                     */
/*                                                                              */
/********************************************************************************/
var http       = require('http');
var express    = require('express');
var request    = require('request');
var bodyParser = require('body-parser');
var async      = require('async');

/***************************************************************/
/* Set up express server                                       */
/***************************************************************/
var app        = express();
var server     = http.createServer(app);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

/******************************************************/
/* Health check for PictureApplication                */
/******************************************************/
app.get('/health', function (req, res)
{
   console.log("PictureApplication - Health check");
   res.status(200).send("Health status for V1.0 of PictureApplication is good");
});
/**********************************************/
/* Start the server                           */
/**********************************************/
server.listen(8080);
console.log("Starting server on port 80");
