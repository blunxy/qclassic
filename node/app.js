var express = require('express');
var io = require('socket.io');
var redis = require('redis');
var client = redis.createClient();
client.on('error', function(err) {
  console.log("bam!" + err);
});


var app = express()
, server = require('http').createServer(app)
, io = io.listen(server);



server.listen(3001);

var enque_channel = io.of('/enq').on('connection', function(socket) {
  console.log('connected on enqueue');
  socket.on('message', function(data) {
    console.log("enque channel message received");
    socket.broadcast.emit('message', data);
    client.lpush("messages", data.id, function(err, reply) {
      console.log(reply + " : " + data.id);
      client.lrange("messages", 0, -1, function(err, messages) {
        console.log(messages);
      });
});

  });
});

var deque_channel = io.of('/deq').on('connection', function(socket) {
  console.log('connected on dequeue');
  socket.on('message', function() {
    console.log("deque channel message received");
    socket.broadcast.emit('message');
    client.lpop("messages");
    client.lrange("messages", 0, -1, function(err, messages) {
      console.log(messages);
    })
  });
});

var delete_channel = io.of('/delete').on('connection', function(socket) {
  console.log('connected on delete');
  socket.on('message', function(data) {
    console.log("delete channel message received");
    socket.broadcast.emit('message', data);
    client.lrem("messages", 0, data.id);
    client.lrange("messages", 0, -1, function(err, messages) {
      console.log(messages);
    })
  });
});

io.sockets.on('connection', function (socket) {
  console.log("connected!");
  socket.on('blarg', function(data){
    console.log(data.some);
  });
  socket.on('disconnect', function(){});
});

