const express = require('express');
const { env } = require('process')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const {v4: uuid4} = require('uuid');


app.use('/peerjs', peerServer);

app.use(express.static('public'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.redirect(`/${uuid4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})


io.on('connection', socket => {
    socket.on('Join-room', (roomId, user_id) => {
        console.log(user_id);
        
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', user_id)

        socket.on('chatMessages', (msg)=>{
            io.to(roomId).emit('message', msg)
        })
    })
})


const PORT = 3030 || process.env.PORT;

server.listen(PORT, () => console.log(PORT))