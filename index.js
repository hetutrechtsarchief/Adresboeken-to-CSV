#!/usr/bin/env node
//usage: $ ./index.js input_xml_file.xml > output.csv

const fs = require('fs');
const path = require('path');
const replaceStream = require('replacestream');
const node_xml_stream = require('node-xml-stream-parser');
const parser = new node_xml_stream();
const filename = process.argv[2];
const csv = require('csv-writer').createObjectCsvStringifier;

const items = [];
const scanNr = parseInt(filename.match(/_(\d{5})_/)[1]);
const basename = path.basename(filename);
const stream = fs.createReadStream(filename, 'UTF-8')

stream.on('close', err => done());
stream.pipe(parser);

parser.on('opentag', function(name, attrs) {
  if (name=='String') {

    items.push({
      scanNr: scanNr,
      basename: basename,
      x: attrs["HPOS"],
      y: attrs["VPOS"],
      width: attrs["WIDTH"],
      height: attrs["HEIGHT"],
      content: attrs["CONTENT"]
    });
  }
});

function done() {
  if (items[0]) {
    const header = Object.keys(items[0]).map(key => { return {id:key, title:key} });
    const csvStringifier = csv({header:header});
    console.log(csvStringifier.stringifyRecords(items));
  }
}

