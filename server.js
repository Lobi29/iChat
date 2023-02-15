const express = require('express');
const { Socket } = require('socket.io');
const app = express();

const http = require('http').Server(app);
const port = process.env.PORT || 8080;

const path = require('path');

// Attached http server to the socket.io
const io = require('socket.io')(http);


// telling the express module that the public dir has all or our site assets.
app.use(express.static(__dirname + '/public'));


// route
app.get('/', (req, res) => {
    // res.json("get Request");
    res.sendFile(path.join(__dirname, '/index.html'));
})


const users = {};


// Create a new connection
io.on('connection', socket => {
    // console.log(socket); No output since we are listening to : app.listen
    // console.log(socket.id);
    console.log('A user connected');

    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log(message);
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })


    
})

http.listen(port, () => {
    console.log('App listening on port ' + port); 
})

