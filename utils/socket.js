// require('dotenv').config()
const { Server : socketServer } = require('socket.io')

// SOCKET_PORT = process.env.SOCKET_PORT || 3000;

const createSocketServer = (port) => {
const io = new socketServer(port, {
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

    socket.on('disconnecting', () => {
        const rooms =socket.rooms;
        console.log("rooms",rooms);
        rooms.forEach((room) => {
            console.log("room",room)
          if (room !== socket.id) {
            console.log(`User left room: ${room}`);
            // Perform additional actions if needed
            io.emit("popq", { room:room})
          }
        });
    });

    socket.on("join-room", (data, callback) => {
        const {roomCode, playerAuthCode, playerName} = data;
        if(roomCode && roomCode.trim().length == 6) {
            socket.join(roomCode)
            socket.to(roomCode).emit("msg-joined", {playerAuthCode: playerAuthCode, playerName: playerName})
            callback({status: 'success'});
        }else{
            callback({status: 'error'});
        }
    })
})
}


module.exports = createSocketServer;
