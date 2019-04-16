const fs = require('fs');
const open = require('open');
const path = require('path');
const express = require("express");
const app = express();

const hostname = '127.0.0.1';
const port = 3000;
const url = `http://${hostname}:${port}/`;
const index = path.join(__dirname + '/../index.html');

const cheerio = require('cheerio');

class Server {

  constructor(parsedData) {
    this.startServer(parsedData);
    open(url);
  }

  startServer(parsedData) {

    app.get('/', (req, res) => {
      this.buildHTML(parsedData).then(html => res.send(html));
    });

    app.listen(port);
    console.log(`Server running at ${url}`);
  }

  buildHTML(parsedData) {
    return new Promise((resolve, reject) => {
      if (!parsedData || !parsedData.errors || parsedData.errors.length === 0) {
        reject();
      }

      fs.readFile(index, 'utf8', function (err, data) {

        if (err) throw err;

        var $ = cheerio.load(data);

        let divStart = '<div>';
        let divEnd = '</div>';

        parsedData.errors.forEach(element => {
          divStart += `<div class='error'>${element}</div>`;
        });

        divStart += divEnd;

        $('#data').append(divStart);
        resolve($.html());
      });
    });

  }
}

module.exports = Server;