require('dotenv').config()
const { Server : socketServer } = require('socket.io')

SOCKET_PORT = process.env.SOCKET_PORT || 3000;


const io = new socketServer(SOCKET_PORT, {
    cors: {
        origin: ["http://localhost:5000"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id,"Joined!")
    socket.broadcast.emit("recvu", `${socket.id} joined!`)

    socket.on("sendu", (room, message) => {
        console.log(room," -> ",message)
        if(room.trim() === ""){
            socket.broadcast.emit("recvu", message)
        }else{
            socket.to(room).emit("recvu", message)
        }
    })

    socket.on("join-room", (data, callback) => {
        const {roomCode, playerAuthCode, playerName} = data;
        if(roomCode && roomCode.trim().length == 6) {
            socket.join(roomCode)
            socket.to(roomCode).emit("msg-joined", `<b>${playerName}</b> joined!`)
            callback({status: 'success'});
        }else{
            callback({status: 'error'});
        }
    })
})
