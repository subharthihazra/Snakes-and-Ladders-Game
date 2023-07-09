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
}

function showPlayBut(){
    const but_text = (playAgainButBool)? "Play Again" : "Play";

    showGameInfo(`<button id="play_but">${but_text}</button>`, () => {
        
        playBut = document.getElementById("play_but")
        playBut.onclick = () => {
            startActualGame()
        }
        // console.log(startGame)
    });
}

// function hideGameBut(){
//     hideGameInfo();
// }

function showGameInfo(content, callback = () => {}){
    gameInfo.innerHTML = content;
    gameInfo.classList.remove("invisible");
    callback();
}

function hideGameInfo(callback = () => {}){
    gameInfo.innerHTML = "";
    gameInfo.classList.add("invisible");
    callback();
}

function updateGameState(gameState){
    // console.log("congo")
    // console.log(playerTokens)
    
    updateTokens(gameState);

    curGameState = gameState;
    
    console.log(gameState);
}

function updateTokens(gameState){

    for(player of Object.keys(gameState.players)){
        console.log(player)
        
        updateToken(player, gameState.players[player].score)
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

function updateToken(player, curScore){
    let prevScore = undefined;
    if(curGameState != undefined && curGameState.players[player] != undefined){

        prevScore = curGameState.players[player].score;
    }
    // console.log("prevScore",prevScore);

    if(prevScore != curScore || prevScore == undefined){

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
}


function showDiceBut(){
    console.log("diceee");
    showGameInfo(`<button id="dice_but">Roll Dice</button>`, () => {
        
        diceBut = document.getElementById("dice_but")
        diceBut.onclick = () => {
            reqRollDice()
        }
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
    headerbar.innerHTML += `<button id="leave_but">Leave</button>`;

    leaveBut = document.getElementById("leave_but");
    leaveBut.onclick = () => {
        leaveRoom();
    }

}

function leaveRoom(){
    setCookie("roomCode", "");
    location.reload();
}

//////////////////////////////////////////////////////////////////////////////
///////////// CALLING FUNCTIONS //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

joinRoomAtStart();
// console.log(getPosToken(53))
