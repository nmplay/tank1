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

  var app = require('express')();
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

  app.get('/', function (req, res) {
    res.statusCode = 200;
    res.end(
      '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta http-equiv="X-UA-Compatible" content="IE=Edge, Chrome=1">\n' +
      '<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>\n' +
      '<script src="/socket.io/socket.io.js"></script>\n' +
      '</head>\n' +
      '<body>\n' +
      '<input id="message" type="text" id="message" style="width: 400px">\n' +
      '<pre id="messages"></pre>\n' +
      '<script>\n(' + clientApp + ')();\n</script>\n' +
      '</body>\n' +
      '</html>\n');
  });

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
