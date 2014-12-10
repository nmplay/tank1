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
    window.onload = function () {
      var MAX_MESSAGES = 10;
      var d = document;
      var $message = d.getElementById('message');
      var $messages = d.getElementById('messages');
      var $first;
      function pr(msg) {
        msg = new Date().toLocaleTimeString() + ' ' + msg;
        console.log(msg);
        var $div = d.createElement('div');
        $div.appendChild(d.createTextNode(msg));
        if (!$first) $messages.appendChild($div);
        else $messages.insertBefore($div, $first);
        $first = $div;
        while ($messages.childNodes.length > MAX_MESSAGES)
          $messages.removeChild($messages.lastChild);
      }
      window.pr = pr;
      window.kd = function (keyCode) {
        pr('keyCode = ' + keyCode);
      };
      $message.setAttribute('onkeydown', 'kd(event.keyCode)');
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
      // socket.on('interval', function () { pr('interval'); });
    };
  } // clientApp

  function app(req, res) {
    res.statusCode = 200;
    res.end(
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
    socket.on('disconnect', function () { console.log('disconnect'); });
  });

  // setInterval(function () { io.emit('interval', 'interval'); }, 3000);

  server.listen(PORT, function () {
    console.log('port %s server started', PORT);
  });

})();
