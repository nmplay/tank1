(function () {
  'use strict';

  var http = require('http');
  var PORT = process.env.PORT || 3000;

  var headers = {'Content-Type': 'text/html; charset=UTF-8',
    'Cahche-Control': 'private, no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': 'Thu, 01 Dec 1994 16:00:00 GMT'};

  var DateTime = require('date-time-string');
  DateTime.extendDateToDateTimeString();

  var app = require('express')();
  // var server = http.createServer(app);

  function clientApp() {
    $(function () {
      var MAX_MESSAGES = 20;
      var $message = $('#message');

      var timer = null;
      var TIMER_INTERVAL = 5000;

      var last_received_at = null;

      var $status = $('#status');
      var onlineMembersCount = 0;

      // pr(msg) to messages
      var $messages = $('#messages');
      function pr() {
        var msg = DateTime.toTimeString() + ' ' + [].slice.call(arguments).join(' ');
        mpr(msg);
      }
      function mpr() {
        var msg = [].slice.call(arguments).join(' ');
        console.log(msg);
        $('<div>').text(msg).prependTo($messages);
        if ($messages.children().length > MAX_MESSAGES)
          $messages.children().last().remove();
      }

      // socket.io
      var socket = io(document.location.href);
      socket.on('connect', function () {
        // pr('connected');
        socket.emit('get messages', {since: last_received_at});
        $status.attr('class', 'status status-online').text('online');

        // ping message: set interval timer
        if (timer) clearInterval(timer), timer = null;
        timer = setInterval(ping, TIMER_INTERVAL);
        ping();
        function ping() {
          socket.emit('ping', {ping_at: Date.now().toString(36)});
        }
      }); // connect

      socket.on('disconnect', function () {
        // pr('disconnected');
        $status.attr('class', 'status status-offline').text('offline');
        if (timer) clearInterval(timer), timer = null;
      }); // disconnect

      socket.on('message', function (msg) {
        mpr(DateTime.toTimeString(new Date(parseInt(msg.message_at, 36))),
          'message:', msg.message);
        last_received_at = msg.message_at;
        // pr('message:', msg.message);
      });  // message

      socket.on('response messages', function (msgs) {
        var msg;
        while (msg = msgs.pop()) {
          mpr(DateTime.toTimeString(new Date(parseInt(msg.message_at, 36))),
            'message:', msg.message);
          last_received_at = msg.message_at;
        }
      }); // response messages

      // window key down event procedure
      window.kd = function (keyCode) {
        if (keyCode === 13 && $message.val() !== '') {
          socket.emit('message', {message: $message.val()});
          $message.val('');
        }
      }; // kd
      $message.attr('onkeydown', 'kd(event.keyCode)');

      socket.on('status', function (data) {
        if (data.onlineMembersCount) onlineMembersCount = data.onlineMembersCount;
        $status.text('online - count: ' + onlineMembersCount);
      }); // status

      socket.on('pong', function (data) {
        $status.text('online - count: ' + onlineMembersCount + ' - rtt: ' +
          (Date.now() - parseInt(data.ping_at, 36)) + ' ms - diff: ' +
          (parseInt(data.pong_at, 36) - parseInt(data.ping_at, 36)) + ' ms');
      }); // pong
    }); // $(fn)
  } // clientApp

  var MAX_MESSAGES = 20;
  var messages = [];
  var onlineMembersCount = 0;

  app.get('/', function (req, res) {
    res.statusCode = 200;
    res.end(
      '<!DOCTYPE html>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta http-equiv="X-UA-Compatible" content="IE=Edge, Chrome=1">\n' +
      '<style type="text/css">\n' +
      '.status { color: white; border-radius: 0px; }\n' +
      '.status-unknown { background-color: gray; }\n' +
      '.status-offline { background-color: red; }\n' +
      '.status-online  { background-color: green; }\n' +
      '</style>\n' +
      '<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>\n' +
      '<script src="//cdn.socket.io/socket.io-1.2.1.js"></script>\n' +
      '<script src="//lightspeedworks.github.io/date-time-string/lib/date-time.js"></script>\n' +
      '<div id="status" class="status status-unknown">unknown</div>\n' +
      '<input id="message" type="text" id="message" style="width: 400px">\n' +
      '<pre id="messages"></pre>\n' +
      '<script>\n(' + clientApp + ')();\n</script>\n');
  });

  var server = http.createServer(function (req, res) {
    for (var i in headers)
      res.setHeader(i, headers[i]);
    res.setHeader('Last-Modified', DateTime.toHttpDate());
    app(req, res);
  });

  var timeString = (process.platform === 'win32') ?
    function timeString() {
      return DateTime.toTimeString(); } :
    function timeString() {
      return new Date(Date.now() + 9000 * 3600).toTimeString(); };

  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    console.log('connection', ++onlineMembersCount);
    io.emit('status', {onlineMembersCount: onlineMembersCount});

    socket.on('disconnect', function () {
      console.log('disconnect', --onlineMembersCount);
      io.emit('status', {onlineMembersCount: onlineMembersCount});
    }); // disconnect

    socket.on('get messages', function (data) {
      var at = data.since;
      var msgs = messages.filter(function (msg) { return !at || msg.message_at > at; })
      socket.emit('response messages', msgs);
    }); // get messages

    socket.on('message', function (msg) {
      msg.message_at = Date.now().toString(36);
      console.log(msg);
      io.emit('message', msg);
      messages.unshift(msg);
      if (messages.length > MAX_MESSAGES)
        messages.pop();
    }); // message

    socket.on('ping', function (data) {
      data.pong_at = Date.now().toString(36);
      data.onlineMembersCount = onlineMembersCount;
      // console.log('ping', data, parseInt(data.pong_at, 36) - parseInt(data.ping_at, 36));
      socket.emit('pong', data);
    }); // ping

  }); // connection

  server.listen(PORT, function () {
    console.log('port %s server started', PORT);
  }); // listen

})();
