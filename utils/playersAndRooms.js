const players = {};
const rooms = {};
const gamesData = {};

const generateRandomString = require('./generateRandomString');

const generateRoomCode = () =>{
    return generateRandomString(6);
}

const generatePlayerAuthCode = () =>{
    return generateRandomString(4);
}


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
        console.log("room while adding player to room" , rooms);
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

const getGameState = (roomCode) => {
    return gamesData[roomCode];
}

const initGameState = (roomCode) => {
    if(roomCode){
        if(getGameState(roomCode) == undefined){
            let colors = ['red', 'green', 'blue', 'yellow'];

            const playerAuthCodes = getRoom(roomCode);
            console.log(roomCode,playerAuthCodes);
            
            if(playerAuthCodes && playerAuthCodes.length >= 2 && playerAuthCodes.length <= 4){

                gamesData[roomCode] = {};
                gamesData[roomCode].players ={};
                gamesData[roomCode].count = playerAuthCodes.length;
                gamesData[roomCode].lastTime = Date.now();
                
                for(playerAuthCode of playerAuthCodes){
                    gamesData[roomCode].players[playerAuthCode] = {};
                    gamesData[roomCode].players[playerAuthCode].color = colors[0];
                    if(colors[0] == 'red'){
                        gamesData[roomCode].turn = playerAuthCode;
                    }
                    colors.splice(0, 1);
                    gamesData[roomCode].players[playerAuthCode].score = 0;
                    gamesData[roomCode].players[playerAuthCode].lastTime = Date.now();
                }

                console.log(gamesData);
                return getGameState(roomCode);
            }
        }else{
            console.log("hus");
            return getGameState(roomCode);
        }
    }
    return false;
}


module.exports = {addPlayer, createRoom, getPlayer, getRoom, addPlayerToRoom, removePlayerFromRoom, initGameState, getGameState};