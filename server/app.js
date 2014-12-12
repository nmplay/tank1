(function () {
  'use strict';

  var http = require('http');
  var PORT = process.env.PORT || 3000;

  var headers = {'Content-Type': 'text/html; charset=UTF-8',
    'Cahche-Control': 'private, no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': 'Thu, 01 Dec 1994 16:00:00 GMT'};

  function httpDate(d) {
    var s = d + '';
    return s.slice(0, 3)+ ', ' + s.slice(8, 10) + ' ' +
           s.slice(4, 7) + ' ' + s.slice(11, 24) + ' GMT';
  }

  // var app = require('express')();
  // var server = http.createServer(app);

  function clientApp() {
    $(function () {
      var MAX_MESSAGES = 20;
      var $message = $('#message');

      // pr(msg) to messages
      var $messages = $('#messages');
      var $first;
      function pr(msg) {
        msg = new Date().toLocaleTimeString() + ' ' + msg;
        console.log(msg);
        var $div = $('<div>');
        $div.text(msg);
        if (!$first) $messages.append($div);
        else $messages.prepend($div);
        $first = $div;
        if ($messages.children().length > MAX_MESSAGES)
          $messages.children().last().remove();
      }

      // JSON
      if (typeof window.JSON === 'undefined') {
        var rep = [
          [new RegExp('"', 'g'), '\\"'],
          [new RegExp('\\', 'g'), '\\\\'],
          [new RegExp('\b', 'g'), '\\b'],
          [new RegExp('\f', 'g'), '\\f'],
          [new RegExp('\n', 'g'), '\\n'],
          [new RegExp('\r', 'g'), '\\r'],
          [new RegExp('\t', 'g'), '\\t'],
        ];
        window.JSON = {
          parse: function parse(s) { return eval('(' + s + ')'); },
          stringify: function stringify(obj) {
            switch (typeof obj) {
              case 'string':
                return '"' + obj.replace(rep[0][0], rep[0][1])
                                .replace(rep[1][0], rep[1][1])
                                .replace(rep[2][0], rep[2][1])
                                .replace(rep[3][0], rep[3][1])
                                .replace(rep[4][0], rep[4][1])
                                .replace(rep[5][0], rep[5][1])
                                .replace(rep[6][0], rep[6][1])
                                + '"';
              case 'number':
              case 'boolean':
              case 'null':
              case 'undefined':
                return obj + '';
              case 'object':
                if (obj === null) return 'null';
                if (obj instanceof Array)
                  return '[' + obj.map(stringify).join(',') + ']';
                var s = '{', delim = ''; 
                for (var i in obj) {
                  s += delim + stringify(i) + ':' + stringify(obj[i]);
                  delim = ',';
                }
                return s + '}';
                break;
              case '':
            }
          },
        };
      } // if !window.JSON

      // socket.io
      var socket = io(document.location.href);
      socket.on('connect', function () {
        pr('connect');
        socket.emit('first', {first: 'message from client'});
      });
      socket.on('first', function (data) {
        pr(data);
        socket.emit('other event', {other: 'event'});
      });
      socket.on('disconnect', function () { pr('disconnect'); });
      socket.on('message', function (data) { pr('message: ' + data.message); });

      // window key down event procedure
      window.kd = function (keyCode) {
        if (keyCode === 13 && $message.val() !== '') {
          socket.emit('message', {message: $message.val()});
          $message.val('');
        }
      };
      $message.attr('onkeydown', 'kd(event.keyCode)');
    }); // $(fn)
  } // clientApp

  function app(req, res) {
    res.statusCode = 200;
    res.end(
      '<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>\n' +
      '<script src="/socket.io/socket.io.js"></script>\n' +
      '<input id="message" type="text" id="message" style="width: 400px">\n' +
      '<pre id="messages"></pre>\n' +
      '<script>\n(' + clientApp + ')();\n</script>\n');
  }

  var server = http.createServer(function (req, res) {
    for (var i in headers)
      res.setHeader(i, headers[i]);
    res.setHeader('Last-Modified', httpDate(new Date()));
    app(req, res);
  });

  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    socket.emit('first', 'first message from server');
    socket.on('first', function (data) { console.log(data); });
    socket.on('other event', function (data) { console.log(data); });
    socket.on('message', function (data) {
      console.log(data);
      io.emit('message', data);
    });
    socket.on('disconnect', function () { console.log('disconnect'); });
  });

  // setInterval(function () { io.emit('interval', 'interval'); }, 3000);

  server.listen(PORT, function () {
    console.log('port %s server started', PORT);
  });

})();
