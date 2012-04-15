#!/usr/bin/env node

var fs = require('fs');
var request = require('request');
var Salmon = require('../lib/ostatus/index.js').salmon;

if (process.argv.length !== 5) {
  console.error("Usage: " + process.argv[0] + " " + process.argv[1] + " <atom.xml> <private.key> <http://salmon/endpoint>");
  process.exit(1);
}

var atomPayload = fs.readFileSync(process.argv[2]);
var privKey = fs.readFileSync(process.argv[3]);
var salmonEndpoint = process.argv[4];
var envelope = "<?xml version='1.0' encoding='UTF-8'?>\n" + Salmon.signEnvelopeXML(atomPayload, privKey).toString();
console.log('Generated envelope: ' + envelope);
var opts = {
  method: 'POST',
  uri: salmonEndpoint,
  body: envelope,
  headers: {
    'Content-Type': 'application/magic-envelope+xml'
  }
};
request(opts, function(error, response, body) {
  if (error) {
    console.error(error.message);
    return;
  }
  if (response.statusCode === 200) {
    return console.log(body);
  } else {
    console.error(response.statusCode);
    return console.log(body);
  }
});