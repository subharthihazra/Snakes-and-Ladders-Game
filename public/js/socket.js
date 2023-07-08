// msgbox = document.querySelector("#msgbox")
// msgbut = document.querySelector("#msgbut")
// roombox = document.querySelector("#roombox")
// roombut = document.querySelector("#roombut")

// const socket = io();

// msgbut.addEventListener("click", () => {
//     socket.emit("sendu",roombox.value, msgbox.value);
// })

// socket.on("recvu", (message) => {
//     console.log(message);
// })

// roombut.addEventListener("click", () => {
//     socket.emit("joro", roombox.value);
// })
socket.on("connect", (payload) => {
    console.log("connected",payload);
})
socket.on("msg-joined", (payload) => {
    const {playerAuthCode, playerName} = payload;
    if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

        playerNames[playerAuthCode.trim()] = playerName.trim();
        console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
    }
})


socket.on("msg-left", (payload) => {
    const {playerAuthCode, playerName} = payload;
    if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

        delete playerNames[playerAuthCode.trim()];
        console.log(playerName.trim(),"with code",playerAuthCode.trim(),"left!");
    }
})


socket.on("popq", (payload) => {
    console.log(payload);
})

function joinRoom(data, callback){
    socket.emit("join-room", data, (payload) => {
        const { status, showGameBut : showGameButBool } = payload;
        
        if(status == "success") {
            callback(status);
            if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

                playerNames[playerAuthCode.trim()] = playerName.trim();
                console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
            }
        }
        if(showGameButBool){
            showGameBut();
        }
    });
}

socket.on("show-game-but", () => {
    showGameBut();
})

function startActualGame(){
    console.log("pee game started")
    console.log(roomCode)
    socket.emit("start-actual-game", {roomCode : roomCode}, handleStartingActualGame);
}

socket.on("starting-actual-game", handleStartingActualGame)

function handleStartingActualGame(data){
    const { gameState } = data;
    hideGameInfo();

    initTokens(gameState);
    updateGameState(gameState);
    if(gameState.turn == playerAuthCode){
        console.log("me")
        showDiceBut();
    }
}

function reqRollDice(){
    socket.emit("roll-dice", {roomCode : roomCode, playerAuthCode : playerAuthCode}, (data) => {

        const { gameState, curDice, winner, gotLadder, gotSnake } = data;

        updateGameState(gameState);
        hideGameInfo();

        if(winner && winner.trim().length == 4){
            console.log(playerNames[winner.trim()], "won!");
            showPlayAgainBut();
        }

        if(gameState.turn == playerAuthCode){
            showDiceBut();
        }
    });
}

socket.on("update-game-state", (data) => {

    const { gameState, curDice, winner, gotLadder, gotSnake } = data;

    updateGameState(gameState);

    if(winner && winner.trim().length == 4){
        console.log(playerNames[winner.trim()], "won!");
        showPlayAgainBut();
    }
    
    if(gameState.turn == playerAuthCode){
        showDiceBut();
    }
})


socket.on("fix-game-state", (data) => {
    const { gameState } = data;

    removeTokens(gameState);
})