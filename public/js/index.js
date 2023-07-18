function setCookie(cname, cvalue, exdays = 365) {
    // const dt = new Date();
    // dt.setTime(dt.getTime() + (exdays*24*60*60*1000));
    // let expires = "expires="+ dt.toUTCString();
    document.cookie = cname + "=" + cvalue; // + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function deleteElmWait(elm, time = 0) {
    setTimeout(() => {
        elm.remove();
    }, time*1000);
}

function invisibleElmWait(elm, time = 0) {
    setTimeout(() => {
        elm.classList.add('invisible');
    }, time*1000);
}

if(startCover){
    startCoverButton.onclick = () =>{
        startCover.classList.add("hide")
        setCookie("startCoverButtonClicked", true);
        invisibleElmWait(startCover, 0.3)
    }
}

// entet button after typing name
f1Button.onclick = async () => {
    if(f1Box.value.trim() != ""){
        if(playerName==undefined || playerName.trim() == ""){
            playerName = f1Box.value.trim();
            if(playerName.length > 20){
                playerName = playerName.substring(0, 20);
            }
        }
        if(playerAuthCode==undefined || playerAuthCode.trim().length != 4){
            const { data } = await axios.post("/addplayer", {playerName: playerName});
            console.log(data.data);
            if(data.status && data.status == "success" && data.data.playerAuthCode && data.data.playerAuthCode.trim().length == 4){
                playerAuthCode = data.data.playerAuthCode;

                enableF2();
                // showForm(form2)
            }
        }else{
            enableF2();
            // showForm(form2)
        }
    }
}

async function joinRoomAtStart(){
    if(playerAuthCode != undefined && roomCode != undefined && playerName != undefined){
        const { data } = await axios.post("/joinroom", {roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName});
        console.log(data.status);
        if(data.status){
            if(data.status == "success"){
                joinRoom({roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName},(status) => {
                    console.log(status,"atstart");
                    enterGameBoard();
                });
            }
            if(data.status == "fail"){
                console.log(data.message);
            }
        }
    }
}

// form having create room or join room
function enableF2() {
    f2CreateButton.onclick = () => {
        enableF3c();
        // showForm(form3c);
    }
    f2JoinButton.onclick = () => {
        enableF3j();
        // showForm(form3j);
    }
}

// create room form
async function enableF3c() {
    if(roomCode==undefined || roomCode.trim().length != 6){
        // request to create room
        const { data } = await axios.post("/createroom", {playerAuthCode: playerAuthCode, playerName: playerName});
        console.log(data.data);
        if(data.status && data.status == "success" && data.data.roomCode && data.data.roomCode.trim().length == 6){
            roomCode = data.data.roomCode;
            showRoomCode();

            joinRoom({roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName}, (status) => {
                console.log(status,"iooi");
                enableF3cButton();
            });
        }
    }else{
        showRoomCode();
    }
}

// show room code
function showRoomCode(){
    f3cCode.innerText = roomCode;
}

// enable enter button at ceate room page
function enableF3cButton(){
    f3cButton.onclick = () => {
        enterGameBoard();
    }
}

// join room page
function enableF3j() {
    f3jButton.onclick = async () => {
        if(roomCode == undefined || roomCode.trim().length != 6){
            if(f3jBox.value.trim().length ==6){
                roomCode = f3jBox.value.trim();
                if(playerAuthCode && playerAuthCode.trim().length == 4){
                    // request to join room
                    const { data } = await axios.post("/joinroom", {roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName});
                    console.log(data.status);
                    if(data.status){
                        if(data.status == "success"){
                            joinRoom({roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName},(status) => {
                                console.log(status,"iojoi");
                                enterGameBoard();
                            });
                        }
                        if(data.status == "fail"){
                            console.log(data.message);
                        }
                    }
                    
                }
            }
        }
    }
}


function enterGameBoard(){
    formContainer.classList.add("invisible");
    gameContainer.classList.remove("invisible");

    showLeaveBut();
    viewSwitchGameBoard();
    chatBut.classList.remove("invisible");
}

function showPlayBut(){
    const but_text = (playAgainButBool)? "Play Again" : "Play";

    showGameInfo(`<button id="play_but">${but_text}</button>`, () => {
        
        playBut = document.getElementById("play_but")
        playBut.onclick = () => {
            startActualGame()
        }
        // console.log(startGame)

        playBut.classList.remove("invisible");
        playBut.classList.add("view");
        
    });
}

// function hideGameBut(){
//     hideGameInfo();
// }

function showGameInfo(content, callback = () => {}){
    gameInfo.innerHTML = content;

    callback();
}

// function hideGameInfo(callback = () => {}){
//     gameInfo.innerHTML = "";

//     gameInfo.classList.remove("view");
//     gameInfo.classList.add("invisible");

//     callback();
// }

function hidePlayBut(){
    playBut.classList.add("invisible");
    playBut.classList.remove("view");

    // deleteElmWait(playBut, 0.3);
}

function hideDiceBut(){
    diceBut.classList.add("invisible");
    diceBut.classList.remove("view");

    // deleteElmWait(diceBut, 0.3);
}

function updateGameState(gameState, steps = []){
    // console.log("congo")
    // console.log(playerTokens)
    
    updateTokens(gameState, steps);

    curGameState = gameState;
    
    console.log(gameState);
}

function updateTokens(gameState, steps){

    for(player of Object.keys(gameState.players)){
        let curScore = gameState.players[player].score;

        // console.log(player)

        let prevScore = undefined;
        if(curGameState != undefined && curGameState.players[player] != undefined){

            prevScore = curGameState.players[player].score;
        }
        // console.log("prevScore",prevScore);

        if(prevScore != curScore || prevScore == undefined){
            console.log(steps)
            updateToken(player, steps, curScore);
        }
    }

}

function initTokens(gameState){
    // curGameState = gameState;
    gameBoard.innerHTML = "";

    for(player of Object.keys(gameState.players)){
        initToken(player, gameState.players[player].color)
    }

}

function removeTokens(gameState){
    newPlayers = Object.keys(gameState.players)
    for(player of Object.keys(curGameState.players)){
        if(newPlayers.indexOf(player) == -1){
            gameBoard.removeChild(playerTokens[player]);
            delete playerTokens[player];
        }
    }
}


function initToken(player, color){
    // gameBoard.innerHTML+=`<div id="Token_${player}" class="${gameState.players[player].color}"></div>`;
    player = player.trim();

    const div = document.createElement("div");
    div.id = `Token_${player}`;
    div.className = color;

    gameBoard.appendChild(div);

    playerTokens[player] = div;
}

function updateToken(player, steps, curScore){

    let iter = 0;
    let updateTokenStepsTimer = undefined;

    const updateTokenSteps = () => {
        if(iter < steps.length){

            updateTokenPos(player, steps[iter]);
            iter++;

        }else if(iter == steps.length){

            updateTokenPos(player, curScore);

            if(updateTokenStepsTimer){ clearInterval(updateTokenStepsTimer) };
        }else{

            if(updateTokenStepsTimer){ clearInterval(updateTokenStepsTimer) };
        }
    }
    
    updateTokenSteps();
    updateTokenStepsTimer = setInterval(updateTokenSteps, GAME_STEP_ANIM_DURATION * 1000);
    
}



function updateTokenPos(player, curScore){

    const curPos = getPosToken(curScore);
    // console.log(curGameState.players[player],curScore, curPos);
    if(curPos){
        // console.log(playerTokens[player]);
        console.log(((10*parseInt(curPos.x)+5) + "%"), ((10*parseInt(curPos.y)+5) + "%"))

        // playerTokens[player].style.left = (10*parseInt(curPos.x)+5) + "%";
        // playerTokens[player].style.top = (10*parseInt(curPos.y)+5) + "%";

        playerTokens[player].style.setProperty(`--token-left`, (10*parseInt(curPos.x)+5) + "%");
        playerTokens[player].style.setProperty(`--token-top`, (10*parseInt(curPos.y)+5) + "%");
        
    }

}

function showGameInfoText(data){
    const { curDice, winner, gotLadder, gotSnake } = data;

    let textToShow = "";

    if(winner == undefined){
        if(curDice){
            textToShow += curDice;
        }
        if(gotSnake){
            // &#x1F40D 🐍
            textToShow += " & &#x1F40D;";
        }
        if(gotLadder){
            // &#x1FA9C 🪜
            textToShow += " & &#x1FA9C;";
        }
    
        showGameInfo(`<div id="game_info_text">${textToShow}</div>`);

    }else{
        textToShow = playerNames[winner.trim()] + " won!";

        showGameInfo(`<div id="game_info_won">${textToShow}</div>`);
    }
}


function showDiceBut(){
    console.log("diceee");
    showGameInfo(`<button id="dice_but"></button>`, () => {
        
        diceBut = document.getElementById("dice_but")
        diceBut.onclick = () => {
            reqRollDice()
        }

        diceBut.classList.remove("invisible");
        diceBut.classList.add("view");
        
    });
}

// function hideDiceBut(){
//     hideGameInfo();
// }

// function showPlayAgainBut(){
//     showGameInfo(`<button id="playAgain">Play Again</button>`, () => {
        
//         playAgain = document.getElementById("playAgain")
//         playAgain.onclick = () => {
//             startActualGame()
//         }
//     });
// }

function initPlayerName(playerAuthCode, playerName){
    playerNames[playerAuthCode.trim()] = playerName.trim();
}


function removePlayerName(playerAuthCode){
    delete playerNames[playerAuthCode.trim()];
}


function initPlayerNames(playerNamesList){
    for(player of Object.keys(playerNamesList)){
        initPlayerName(player, playerNamesList[player]);
    }
}

function getPosToken(score = 0){

    if(score < 0 || score >100){
        return null;
    }
    if(score == 0){
        return {x: -1, y: 9}
    }

    const ones = score%10;
    const tens = (Math.floor(score/10))%10;
    const huns = (Math.floor(score/100))%10;
    if(huns == 1){
        return { x: 0, y: 0 };
    }
    if(tens % 2 == 0){ // even
        if(ones == 0){
            return { x: 0, y: (10-tens) };
        }
        else{
            return { x: (ones-1), y: (10-tens-1) };
        }
    }else{ // odd
        if(ones == 0){
            return { x:9, y: (10-tens) }
        }
        else{
            return { x: (10-ones), y: (10-tens-1) };
        }
    }

}

function showLeaveBut(){
    headerbarRightContainer.innerHTML += `<button id="leave_but"><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M645-327q-9-9-9-21.75t9-21.25l80-80H405q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T405-510h318l-81-81q-8-8-8-20.447 0-12.448 9.214-21.5Q651.661-642 664.33-642q12.67 0 21.67 9l133 133q5 5 7 10.133 2 5.134 2 11Q828-473 826-468q-2 5-7 10L687-326q-8 8-20.5 8t-21.5-9ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h261q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T441-780H180v600h261q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T441-120H180Z"/></svg></button>`;

    leaveBut = document.getElementById("leave_but");
    leaveBut.onclick = () => {
        leaveRoom();
    }

}

function leaveRoom(){
    setCookie("roomCode", "");
    setCookie("playerName", "");
    setCookie("playerAuthCode", "");
    /// add func to remove player details from server
    location.reload();
}

chatMsgSendBut.onclick = () => {
    if(chatMsgbox.value.trim() != ""){
        const chatMessage = chatMsgbox.value.trim();
        sendMessage(chatMessage, () => {
            console.log("sent ->", chatMessage);
            msgBouble.classList.add("sent");
        })

        const msgBouble = viewChatMessageSelf(chatMessage);

        chatMsgbox.value = "";
        toggleChatMsgSendBut();
    }
}

function viewChatMessage(sender, chatMessage){
    if(chatMessage && sender){
        let senderName = playerNames[sender];
        if(senderName == undefined){
            senderName = "#"+sender;
        }

        // chatView.innerHTML+=`
        // <div class="chat_msg_bouble_other">
        // <div class="chat_msg_bouble_sender_name">${senderName}</div>
        // <div class="chat_msg_bouble_chat_message">${chatMessage}</div>
        // </div>
        // `;

        const divOuter = document.createElement("div");
        divOuter.className = "chat_msg_bouble_other";

        const divInnerSenderName = document.createElement("div");
        divInnerSenderName.className = "chat_msg_bouble_sender_name";
        divInnerSenderName.textContent = senderName;


        const divInnerChatMessage = document.createElement("div");
        divInnerChatMessage.className = "chat_msg_bouble_chat_message";
        divInnerChatMessage.textContent = chatMessage;

        divOuter.appendChild(divInnerSenderName);
        divOuter.appendChild(divInnerChatMessage);

        addMessageInView(divOuter);

    }
}


function viewChatMessageSelf(chatMessage){
    if(chatMessage){
        // chatView.innerHTML+=`
        // <div class="chat_msg_bouble_self">
        // <div class="chat_msg_bouble_chat_message">${chatMessage}</div>
        // </div>
        // `;

        const divOuter = document.createElement("div");
        divOuter.className = "chat_msg_bouble_self";

        const divInner = document.createElement("div");
        divInner.className = "chat_msg_bouble_chat_message";
        divInner.textContent = chatMessage;

        divOuter.appendChild(divInner);
        
        addMessageInView(divOuter);
        
        return divOuter;
    }
}

function addMessageInView(element){
    if(element){

        chatView.appendChild(element);
        chatView.scrollTop = chatView.scrollHeight;

        element.classList.add("view");
    }
}

function viewRoomCodeMessage(){

    const divOuter = document.createElement("div");
    divOuter.className = "chat_msg_info";

    //  &#x1f603; 😃
    divOuter.innerHTML = `Room Code of the game is [ <span class="chat_msg_info_name">${roomCode}</span> ] !`;

    addMessageInView(divOuter);
}

function viewJoinedMessage(player){

    if(player){
        
    let playerName = playerNames[player];
    if(playerName == undefined){
        playerName = "#"+player;
    }
    
        const divOuter = document.createElement("div");
        divOuter.className = "chat_msg_info";

        //  &#x1f603; 😃
        divOuter.innerHTML = `<span class="chat_msg_info_name">${playerName}</span> joined the game &#x1f603; !`;

        addMessageInView(divOuter);
    }
} 


function viewLeftMessage(player){

    if(player){
        
    let playerName = playerNames[player];
    if(playerName == undefined){
        playerName = "#"+player;
    }
    
        const divOuter = document.createElement("div");
        divOuter.className = "chat_msg_info";

        // &#x1f972; 🥲
        divOuter.innerHTML = `<span class="chat_msg_info_name">${playerName}</span> left the game &#x1f972; !`;

        addMessageInView(divOuter);
    }
} 


function viewWonMessage(player){

    if(player){
        
    let playerName = playerNames[player];
    if(playerName == undefined){
        playerName = "#"+player;
    }
    
        const divOuter = document.createElement("div");
        divOuter.className = "chat_msg_info";

        // &#x1f973; 🥳
        // &#x1f60e; 😎
        divOuter.innerHTML = `<span class="chat_msg_info_name">${playerName}</span> won the match &#x1f60e;&#x1f973; !`;

        addMessageInView(divOuter);
    }
} 

function toggleChatMsgSendBut(){
    if(chatMsgbox.value.trim() != "") {
        chatMsgSendBut.disabled = false;
    }else{
        chatMsgSendBut.disabled = true;
    }
}


chatBut.onclick = () => {
    if(chatButToggle){
        chatContainer.classList.add("invisible");
        chatContainer.classList.remove("view");
    }else{
        chatContainer.classList.add("view");
        chatContainer.classList.remove("invisible");
    }
    chatButToggle = !chatButToggle;
}


//////////////////////////////////////////////////////////////////////////////
///////////// CALLING FUNCTIONS //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

joinRoomAtStart();
// console.log(getPosToken(53))

function viewSwitchGameBoard() {
    if(gameBoardContainer.clientHeight > gameBoardContainer.clientWidth){
        gameBoardOuter.style.setProperty("--board-width", "100%");
        gameBoardOuter.style.setProperty("--board-height", "");
    }else{
        gameBoardOuter.style.setProperty("--board-width", "");
        gameBoardOuter.style.setProperty("--board-height", "100%");
    }
}

window.onresize = () => {
    viewSwitchGameBoard();
}

chatMsgbox.onkeyup = (event) => {

    toggleChatMsgSendBut();

    if (event.code === 'Enter') {
        chatMsgSendBut.click();
    }
}

