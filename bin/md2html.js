#!/usr/bin/env node
(function () {
  "use strict";

  var fs = require('fs')
    , markdown = require('markdown').markdown
    , nopt = require("nopt")
    , stream
    , opts
    , buffer = ""
    , dialects = Object.keys( markdown.Markdown.dialects )
    ;

  opts = nopt(
    { "dialect": dialects
    , "help": Boolean
    }
  );

  if (opts.help) {
    var name = process.argv[1].split('/').pop()
    console.warn( require('util').format(
      'usage: %s [--dialect=DIALECT] FILE\n\nValid dialects are ' + 
        dialects.map(function(x, i) {
          return x + (i == 0 ? ' (the default)' : '') 
        }).join(', '),
      name
    ) );
    process.exit(0);
  }

  var fullpath = opts.argv.remain[0];

  if (fullpath && fullpath !== "-") {
    stream = fs.createReadStream(fullpath);
  } else {
    stream = process.stdin;
  }
  stream.resume();
  stream.setEncoding('utf8');

  stream.on('error', function(error) {
    console.error(error.toString());
    process.exit(1);
  });

  stream.on('data', function(data) {
    buffer += data;
  });

  stream.on('end', function() {
    var html = markdown.toHTML(buffer, opts.dialect);
    console.log(html);
  });

}())
