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
    console.log("connected!",payload,socket.id, socket.recovered);
})
socket.on("msg-joined", (payload) => {
    const {playerAuthCode, playerName} = payload;
    if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

        initPlayerName(playerAuthCode, playerName);
        // console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
        viewJoinedMessage(playerAuthCode);
    }
})


socket.on("msg-left", (payload) => {
    const {playerAuthCode, playerName} = payload;
    if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

        viewLeftMessage(playerAuthCode);
        // console.log(playerName.trim(),"with code",playerAuthCode.trim(),"left!");
        removePlayerName(playerAuthCode);
    }
})


socket.on("popq", (payload) => {
    console.log(payload);
})

function joinRoom(data, callback){
    socket.emit("join-room", data, (payload) => {
        const { status, showPlayBut : showPlayButBool, data } = payload;
        
        if(status == "success") {
            callback(status);
            if(playerAuthCode && playerName && playerAuthCode.trim().length == 4 && playerName.trim() != ""){

                initPlayerName(playerAuthCode, playerName);
                // console.log(playerName.trim(),"with code",playerAuthCode.trim(),"joined!");
                viewRoomCodeMessage();
                viewJoinedMessage(playerAuthCode);
            }

            if(data && data.playerNames){

                initPlayerNames(data.playerNames);   
            }         

            if(showPlayButBool){
                showPlayBut();
            }
        }

        if(status == "observer"){
            callback(status);
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
    
    if(!observer){
        hidePlayBut();
    }

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

        const { gameState, curDice, winner, gotLadder, gotSnake, steps } = data;
        
        updateGameState(gameState, steps);
        hideDiceBut();

        showGameInfoText({
            curDice : curDice,
            winner : winner,
            gotLadder : gotLadder,
            gotSnake : gotSnake
        });

        if(winner && winner.trim().length == 4){
            console.log(playerNames[winner.trim()], "won!");
            viewWonMessage(winner.trim());

            setTimeout(showPlayBut, GAME_INFO_WAIT_DURATION * 1000);
        }

        if(gameState.turn == playerAuthCode){

            setTimeout(() => {
                showDiceBut();
            }, GAME_STEP_ANIM_DURATION * (steps.length + 1) * 1000)
        }
    });
}

socket.on("update-game-state", (data) => {

    const { gameState, curDice, winner, gotLadder, gotSnake, steps } = data;

    updateGameState(gameState, steps);
    
    showGameInfoText({
        curDice : curDice,
        winner : winner,
        gotLadder : gotLadder,
        gotSnake : gotSnake
    });

    if(winner && winner.trim().length == 4){
        console.log(playerNames[winner.trim()], "won!");
        viewWonMessage(winner.trim());
        
        setTimeout(showPlayBut, GAME_INFO_WAIT_DURATION * 1000);
    }
    
    if(gameState.turn == playerAuthCode){

        setTimeout(() => {
            showDiceBut();
        }, GAME_STEP_ANIM_DURATION * (steps.length + 1) * 1000)
    }
})


socket.on("fix-game-state", (data) => {
    const { gameState, winner } = data;

    removeTokens(gameState);

    showGameInfoText({
        winner : winner
    });

    if(gameState.turn == playerAuthCode){
        
        showDiceBut();
    }

    if(winner && winner.trim().length == 4){
        console.log(playerNames[winner.trim()], "won!");
        viewWonMessage(winner.trim());

        if(curGameState.turn == playerAuthCode){
            hideDiceBut();
        }
        
    }
})

socket.on("chat-conversation", (data) => {
    const {chatMessage, sender} = data;
    if(chatMessage && sender){
        viewChatMessage(sender, chatMessage);
    }
})

function sendMessage(chatMessage, callback = () => {}){
    if(chatMessage && chatMessage.trim() != "" && playerAuthCode){
        chatMessage = chatMessage.trim();
        socket.emit("chat-conversation", {chatMessage: chatMessage, sender: playerAuthCode, roomCode: roomCode}, () => {
            callback();
        });
    }
}