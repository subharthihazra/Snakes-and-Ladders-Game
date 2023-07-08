// require('dotenv').config()
const { Server : socketServer } = require('socket.io')

const {
    removePlayerFromRoom,
    getGameState,
    initGameState,
    updateGameState,
    fixGameState,
    addSocket,
    removeSocket,
    getSocket,
    getRoom,
    getPlayer

} = require("./game")

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

    socket.on("connection", () => {
        const abf="hull";
    })

    socket.on('disconnecting', () => {
        const rooms = socket.rooms;
        
        for(room of rooms){
            if (room !== socket.id && room.trim().length == 6) {
                
                //NOTE: if function is used instead of () => , then this.id also works instead of socket.id

                const playerAuthCode = getSocket(socket.id)
                const playerName = getPlayer(playerAuthCode)

                if(playerAuthCode){
                
                    removePlayerFromRoom(room, playerAuthCode)

                    socket.to(room).emit("msg-left", {playerAuthCode: playerAuthCode, playerName: playerName})

                    const curGameState = getGameState(room);
                    if(curGameState){
                        if(curGameState.players[playerAuthCode]){

                            const data = fixGameState(room, playerAuthCode)
                            socket.to(room).emit("fix-game-state",data)
                        }
                    }
                }
                removeSocket(socket.id)

                console.log(getPlayer(playerAuthCode), "left room", room, "!!!!");
                
                // Perform additional actions if needed
                io.emit("popq", { room:room})
            }
        };
    });

    socket.on("disconnect", () => {

    })

    socket.on("join-room", (data, callback) => {

        const {roomCode, playerAuthCode, playerName} = data;

        if(roomCode && roomCode.trim().length == 6) {

            socket.join(roomCode)
            socket.to(roomCode).emit("msg-joined", {playerAuthCode: playerAuthCode, playerName: playerName})
            addSocket(socket.id, playerAuthCode)

            if(io.sockets.adapter.rooms.get(roomCode).size <= 4){

                if(io.sockets.adapter.rooms.get(roomCode).size >= 2){
                    callback({status: 'success', showGameBut: true})
                    socket.to(roomCode).emit("show-game-but");
                }else{
                    callback({status: 'success'});
                }
            }
        }else{
            callback({status: 'error'});
        }
    })

    socket.on("start-actual-game", (data, callback) => {
        const { roomCode } = data;
        if(roomCode){
            console.log("Pee Here",roomCode);
            const data = initGameState(roomCode);
            if(data && data.gameState){
                socket.to(roomCode).emit("starting-actual-game",data)
                callback(data)
            }
        }
    })

    socket.on("roll-dice", (data, callback) => {
        const { roomCode, playerAuthCode } = data;
        if(roomCode && playerAuthCode){
            const data = updateGameState(roomCode, playerAuthCode);
            if(data && data.gameState){
                socket.to(roomCode).emit("update-game-state",data)
                callback(data)
            }
        }
    })


})
}


module.exports = createSocketServer;
