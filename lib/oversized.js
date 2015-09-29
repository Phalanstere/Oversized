    var gm = require('gm');
    var fs = require('fs');
    var Q = require('q');


function Oversized(params) {
  'use strict';
  var self = this;

  this.info = function (file) {
    var stats = fs.statSync(file);
    var bytes = stats["size"]
    var mb = bytes / 1000000.0

    if (mb > params.max) return true;
    else return null;
    };

 this.reduced = [];


this.write = function reduce(file) {
  var deferred = Q.defer(),
  tg = file.substring(0, file.length -4);

  tg = tg + params.suffix + file.substring(file.length -4, file.lengh);

  if (self.info(file) === true)
    {
    gm(file)
      .resize(params.max_width, params.max_height)
      .write(tg, function(err){
        if (err) return false;
        else  {
              self.reduced.push(tg);
              deferred.resolve();
          }
      });
     }
   else {
        self.reduced.push(file);
        deferred.resolve();
        }
   return deferred.promise;
  }


  this.ready = function()  {
    console.log("oversized processing done");
    if (params.callback) params.callback.call(this, self.reduced);
  };


  this.check = function(files) {
        self.reduced = [];

      if(Array.isArray(files) === false) {
        var list = [];
        list.push(files);
        files = list;
        }


    function processing(files) {
      var deferred = Q.defer();
      /////
      return files.reduce(function (previous, job) {
       return previous.then(function () {
           return self.write(job);
       });


       }, Q());
       //////

       deferred.resolve();
       return deferred.promise;
    };

    processing(files).then(self.ready);
  };



  this.init = function() {
    if (! params.max)     params.max = 1024;
    if (! params.suffix)  params.suffix = "_prvw";
    if (params.file) self.info();
  };

  self.init();

  };


  function done(result) {
      console.log("ERLEDIGT " + result);
  };

  var test = new Oversized({
    max: 1.4,
    max_width: 1920,
    max_height: 1080,
    callback: done,
    });

  var a = test.check(["../oversized.jpg", "../oversized2.jpg", "../normal.jpg"]);



module.exports = exports = Oversized;
