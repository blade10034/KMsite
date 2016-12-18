var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/getMedia:fileName?', function(req, res, next){
  var gridfs = req.app.get('gridfs');
  console.log(req.query.fileName);
  var readstream = gridfs.createReadStream({
    filename: req.query.fileName
  });

  var range = request.headers.range;
  var total = readstream.length;

  var parts = range.replace(/bytes=/, "").split("-");
  var partialstart = parts[0];
  var partialend = parts[1];

  var start = parseInt(partialstart, 10);
  var end = partialend ? parseInt(partialend, 10) : total-1;

  var chunksize = (end-start)+1;

  res.set({
    'Accept-Ranges' : 'bytes',
    'Content-Range' : 'bytes ' + start + '-' + end + '/' + total,
    'Content-Length': chunksize,
    'Content-Type'  : 'audio/mp3'
  });

  readstream.pipe(res);

});

module.exports = router;
