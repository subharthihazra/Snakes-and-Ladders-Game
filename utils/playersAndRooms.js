const players = {};
const rooms = {};
const gamesData = {};

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
    return rooms[roomCode];
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

const initGameState = (roomCode) => {
    if(roomCode){
        let colors = ['red', 'green', 'blue', 'yellow'];

        const playerAuthCodes = getRoom(roomCode);
        
        if(playerAuthCodes && playerAuthCodes.length >= 2 && playerAuthCodes.length <= 4){

            gamesData[roomCode] = {};
            gamesData[roomCode].players ={};
            gamesData[roomCode].count = playerAuthCodes.length;
            gamesData[roomCode].turn = undefined;
            gamesData[roomCode].lastTime = Date.now();
            
            for(playerAuthCode in playerAuthCodes){
                gamesData[roomCode].players[playerAuthCode] = {};
                gamesData[roomCode].players[playerAuthCode].color = colors[0];
                colors.splice(0, 1);
                gamesData[roomCode].players[playerAuthCode].lastTime = Date.now();
            }

            console.log(gamesData);
        }
    }
}

module.exports = {addPlayer, createRoom, getPlayer, getRoom, addPlayerToRoom, removePlayerFromRoom, initGameState};