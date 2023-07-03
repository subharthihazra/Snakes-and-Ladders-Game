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
    console.log(playerName,"with code",playerAuthCode,"joined!");
})


socket.on("popq", (payload) => {
    console.log(payload);
})

function joinRoom(data, callback){
    socket.emit("join-room", data, (payload) => {
        const { status, showGameBut : showGameButBool } = payload;
        
        if(status == "success") {
            callback(status);
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
    hideGameBut();
    initTokens(gameState);
    updateGameState(gameState);
    if(gameState.turn == playerAuthCode){
        showDiceBut();
    }
}

function reqRollDice(){
    socket.emit("roll-dice", {roomCode : roomCode}, (data) => {
        const { gameState } = data;
        hideDiceBut();
        updateGameState(gameState);
        if(gameState.turn == playerAuthCode){
            showDiceBut();
        }
    });
}

socket.on("update-game-state", (data) => {
    const { gameState } = data;
    updateGameState(gameState);
    if(gameState.turn == playerAuthCode){
        showDiceBut();
    }
})
