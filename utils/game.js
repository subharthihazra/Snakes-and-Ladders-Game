const players = {};
const rooms = {};
const gamesData = {};
const sockets = {};

const {generateRandomString, rollADice} = require("./random");
const {snakesMap, laddersMap} = require("./gameMap")

const colors = ['red', 'green', 'blue', 'yellow'];

const generateRoomCode = () => {
    return generateRandomString(6);
}

const generatePlayerAuthCode = () => {
    return generateRandomString(4);
}


const createRoom = (roomCode = undefined) => {
    if(roomCode == undefined){
        do{
            roomCode = generateRoomCode();
        }while(rooms[roomCode])

    }
    
    rooms[roomCode] = [];
    
    // console.log(rooms);
    return roomCode;
}

const addPlayer = (playerName, playerAuthCode = undefined) => {
    
    if(playerAuthCode == undefined){
        do{
            playerAuthCode = generatePlayerAuthCode();
        }while(players[playerAuthCode])
    }

    players[playerAuthCode] = playerName;

    // console.log(players);
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
        // console.log("room while adding player to room" , rooms);
        return true;
    }
    return false;
}

const checkPlayerInRoom = (roomCode, playerAuthCode) => {
    if(roomCode && playerAuthCode && rooms[roomCode] && rooms[roomCode].indexOf(playerAuthCode) != -1) {
        return true;
    }else{
        return false;
    }
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

const getSnake = (score) => {
    return snakesMap[score];
}


const getLadder = (score) => {
    return laddersMap[score];
}

const passTurn = (roomCode) => {
    if(roomCode){
        const curGameState = getGameState(roomCode);
        if(curGameState != undefined){

            const curTurn = curGameState.turn;
            // console.log(curTurn);
            if(curGameState.players[curTurn]){
                const curColor = curGameState.players[curTurn].color;

                let indexOfColor = undefined;
                let nextColor = curColor;
                let nextTurn = undefined;
                let i = 0; // to prevent infinite loop at any circumstances
                do{
                    indexOfColor = ( ( colors.indexOf(nextColor) + 1 ) % (colors.length) );
                    if(indexOfColor >=0 && indexOfColor < colors.length){

                        nextColor = colors[indexOfColor];

                        // console.log(curColor,nextColor);
                        // console.log("huiiiiiiiiiiiiiiiii", Object.keys(curGameState.players))
                        // console.log(colors)

                        for(player of Object.keys(curGameState.players)){
                            if(curGameState.players[player].color == nextColor) {
                                // console.log("=>",curGameState.players[player].color);
                                gamesData[roomCode].turn = player;
                                
                                return;
                            }
                        }
                    }

                    i++;

                }while(nextTurn == undefined && i<20);
            }
        }
    }
}

const initGameState = (roomCode) => {
    if(roomCode){
        // if(getGameState(roomCode) == undefined){
            let curColors = ['red', 'green', 'blue', 'yellow'];;

            const playerAuthCodes = getRoom(roomCode);
            // console.log(roomCode,playerAuthCodes);
            
            if(playerAuthCodes && playerAuthCodes.length >= 2 && playerAuthCodes.length <= 4){

                gamesData[roomCode] = {};
                gamesData[roomCode].players ={};
                gamesData[roomCode].count = playerAuthCodes.length;
                gamesData[roomCode].lastTime = Date.now();
                
                for(playerAuthCode of playerAuthCodes){
                    gamesData[roomCode].players[playerAuthCode] = {};
                    gamesData[roomCode].players[playerAuthCode].color = curColors[0];
                    if(curColors[0] == 'red'){
                        gamesData[roomCode].turn = playerAuthCode;
                    }
                    curColors.splice(0, 1);
                    gamesData[roomCode].players[playerAuthCode].score = 0;
                    gamesData[roomCode].players[playerAuthCode].lastTime = Date.now();
                }

                // console.log(gamesData);
                return {gameState: getGameState(roomCode)};
            }
        // }else{
        //     // console.log("hus");
        //     return {gameState: getGameState(roomCode)};
        // }
    }
    return false;
}

const updateGameState = (roomCode, playerAuthCode) => {
    if(roomCode && playerAuthCode){
        const curGameState = getGameState(roomCode);
        if(curGameState != undefined){
            if(curGameState.turn == playerAuthCode){
                let dataToSend = {};
                const curDice = rollADice();
                const newScore = parseInt(gamesData[roomCode].players[playerAuthCode].score) + curDice;

                if(newScore == 100){

                    gamesData[roomCode].players[playerAuthCode].score = newScore;
                    gamesData[roomCode].turn = "";
                    dataToSend.winner = playerAuthCode;

                }else if(newScore > 100){

                    passTurn(roomCode);

                }else{

                    const gotSnake = getSnake(newScore);
                    const gotLadder = getLadder(newScore);
                    
                    
                    if(gotSnake){
                        dataToSend.gotSnake = gotSnake;

                        gamesData[roomCode].players[playerAuthCode].score = parseInt(gotSnake);
    
                        passTurn(roomCode);
    
                    }else if(gotLadder){
                        dataToSend.gotLadder = gotLadder;
    
                        gamesData[roomCode].players[playerAuthCode].score = parseInt(gotLadder);
    
                    }else{
    
                        gamesData[roomCode].players[playerAuthCode].score = newScore;
    
                        passTurn(roomCode);
                    }

                }

                dataToSend.curDice = curDice;
                dataToSend.gameState = getGameState(roomCode);
                
                return dataToSend;

            }
        }
    }
}

const fixGameState = (roomCode, playerAuthCode) => {
    
    // console.log('fixGameState', roomCode, playerAuthCode);

    if(roomCode && playerAuthCode){

        const curGameState = getGameState(roomCode);
        
        if(curGameState != undefined){
            if(curGameState.turn == playerAuthCode){

                passTurn(roomCode);
            }
            if(curGameState.players[playerAuthCode]){

                delete gamesData[roomCode].players[playerAuthCode];

                gamesData[roomCode].count -= 1;
            }

            return {gameState: getGameState(roomCode)}
        }
    }
}

const addSocket = (socketid, playerAuthCode) => {
    if(socketid && playerAuthCode){

        sockets[socketid] = playerAuthCode;
    }
}

const removeSocket = (socketid) => {
    delete sockets[socketid];
}

const getSocket = (socketid) => {
    return sockets[socketid];
}

module.exports = {
    addPlayer,
    createRoom,
    getPlayer,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    initGameState,
    getGameState,
    updateGameState,
    fixGameState,
    addSocket,
    removeSocket,
    getSocket,
    checkPlayerInRoom
};