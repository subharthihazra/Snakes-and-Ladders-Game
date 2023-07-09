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

        initPlayerName(playerAuthCode, playerName);
        console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
    }
})


socket.on("msg-left", (payload) => {
    const {playerAuthCode, playerName} = payload;
    if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

        removePlayerName(playerAuthCode);
        console.log(playerName.trim(),"with code",playerAuthCode.trim(),"left!");
    }
})


socket.on("popq", (payload) => {
    console.log(payload);
})

function joinRoom(data, callback){
    socket.emit("join-room", data, (payload) => {
        const { status, showPlayBut : showPlayButBool } = payload;
        
        if(status == "success") {
            callback(status);
            if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

                initPlayerName(playerAuthCode, playerName);
                console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
            }
        }
        if(showPlayButBool){
            showPlayBut();
        }

        if(status == "observer"){
            console.log(payload);
            handleInitGame(payload.data, true);
        }
    });
}

socket.on("show-play-but", () => {
    showPlayBut();
})

function startActualGame(){
    console.log("pee game started")
    console.log(roomCode)
    socket.emit("start-actual-game", {roomCode : roomCode}, handleInitGame);
    
}

socket.on("init-game", handleInitGame)

function handleInitGame(data, observer = false){
    const { gameState, playerNames: playerNamesList } = data;

    initPlayerNames(playerNamesList);

    hideGameInfo();

    initTokens(gameState);
    updateGameState(gameState);
    if(gameState.turn == playerAuthCode){
        console.log("me")
        showDiceBut();
    }

    if(!observer){
        playAgainButBool = true;
    }
}

function reqRollDice(){
    socket.emit("roll-dice", {roomCode : roomCode, playerAuthCode : playerAuthCode}, (data) => {

        const { gameState, curDice, winner, gotLadder, gotSnake } = data;

        updateGameState(gameState);
        hideGameInfo();

        if(winner && winner.trim().length == 4){
            console.log(playerNames[winner.trim()], "won!");
            showPlayBut();
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
        showPlayBut();
    }
    
    if(gameState.turn == playerAuthCode){
        showDiceBut();
    }
})


socket.on("fix-game-state", (data) => {
    const { gameState, winner } = data;

    removeTokens(gameState);
    if(gameState.turn == playerAuthCode){
        showDiceBut();
    }

    if(winner && winner.trim().length == 4){
        console.log(playerNames[winner.trim()], "won!");
        if(curGameState.turn == playerAuthCode){
            hideGameInfo();
        }
    }
})