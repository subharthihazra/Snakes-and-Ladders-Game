const players = {};
const rooms = {};
const games = {};

const generatePlayerAuthCode = require("./generatePlayerAuthCode")
const generateRoomCode = require("./generateRoomCode")

const createRoom = (roomCode = undefined) => {
    if(roomCode == undefined){
        do{
            roomCode = generateRoomCode();
        }while(rooms[roomCode])

        rooms[roomCode] = [];
    }else{
        rooms[roomCode] = [];
    }
    console.log(rooms);
    return roomCode;
}

const addPlayer = (playerName) => {
    
    let playerAuthCode = undefined;
    do{
        playerAuthCode = generatePlayerAuthCode();
    }while(players[playerAuthCode])

    players[playerAuthCode] = playerName;
    console.log(players);
    return playerAuthCode;
}

const getPlayer = (playerAuthCode) => {
    return players[playerAuthCode];
}

const getRoom = (roomCode) => {
    return (rooms[roomCode]);
}  

const addPlayerToRoom = (roomCode, playerAuthCode) => {
    if(rooms[roomCode].indexOf(playerAuthCode) === -1) {
        rooms[roomCode].push(playerAuthCode);
        return true;
    }
    return false;
}

const removePlayerFromRoom = (roomCode, playerAuthCode) => {
    let index = rooms[roomCode].indexOf(playerAuthCode);
    if(index != -1) {
        rooms[roomCode].splice(index, 1);
        return true;
    }
    return false;
}


module.exports = {addPlayer, createRoom, getPlayer, getRoom, addPlayerToRoom, removePlayerFromRoom};