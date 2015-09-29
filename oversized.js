    var gm = require('gm');
    var fs = require('fs');



function Oversized(params) {
  'use strict';
  var self = this;

  this.info = function () {
    var stats = fs.statSync(params.file);
    var bytes = stats["size"]
    var mb = bytes / 1000000.0

    if (mb > params.max) self.reduce(params.file);
    else return null;
    };



  this.reduce = function reduce(file) {
    var tg = file.substring(0, file.length -4);
    console.log(tg);
    tg = tg + params.suffix + file.substring(file.length -4, file.lengh);
    console.log(tg);

    gm(file)
      .resize(params.max_width, params.max_height)
      .write(tg, function(err){
        if (err) return false;
        else  return true;
      });
    }




  this.init = function() {
    if (! params.max)     params.max = 1024;
    if (! params.suffix)  params.suffix = "_prvw";
    console.log(params.max);
  };

  self.init();
    self.info();

  };


var test = new Oversized({

  file: "oversized.jpg",
  max: 1.4,
  max_width: 1920,
  max_height: 1080,
  crop: true
  });



test.redcue
