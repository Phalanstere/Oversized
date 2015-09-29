    var gm = require('gm');
    var fs = require('fs');
    var Q = require('q');
    var recursive = require("recursive-readdir");

var format_list = ["jpg", "png", "tif", "JPG"];

Array.prototype.contains = function (elem) {
    "use strict";
    var q;
    for (q = 0; q < this.length; q++)
        {
        if (elem === this[q])
            {
            return true;
            }
        }

    return false;
};


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




  this.check_files = function(files) {
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


  this.getImageData = function(path)
  {
      "use strict";
      var deferred = Q.defer();

      recursive(path, function (err, files) {
        if (err) { console.log("path is not valid"); }

        if(files) {

          var list = [], len, ext;

            files.map(function(el) {

              len = el.length;
              ext = el.substring(len-3, len);
              if (format_list.contains(ext) === true) {
                  list.push(el);
                  }
            });
          self.temporary = list;
          deferred.resolve(list);
          }
      });

  return deferred.promise;
  }



this.check = function(files) {

  function followUp()
    {
    self.check_files(self.temporary);
    }

  if(Array.isArray(files) === false) {
    if (fs.lstatSync(files).isDirectory()  === true) {
      self.getImageData(files).then(followUp);
      }
    }
  else
    {
    console.log("CHECK DER FILES");
    self.check_files(files);
    }

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

  var a = test.check("../dir");
  // var a = test.check(["normal.jpg", "oversized.jpg"]);


module.exports = exports = Oversized;
