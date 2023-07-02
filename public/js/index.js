// let playerName = undefined;
// let roomCode = undefined;

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
}

function showGameBut(){
    showGameInfo(`<button id="startGame">Start Game</button>`, () => {
        
        startGame = document.getElementById("startGame")
        startGame.onclick = () => {
            startActualGame()
        }
        // console.log(startGame)
    });
}

function showGameInfo(content, callback = () => {}){
    gameInfo.innerHTML = content;
    gameInfo.classList.remove("invisible");
    callback()
}

function updateGameState(gameState){
    curGameState = gameState;
    console.log(gameState);
}


// arr = [];
// function genturu(){
//     for(let i=1; i<=100;i++){
//         let ones = i%10;
//         let tens = (Math.floor(i/10))%10;
//         let huns = (Math.floor(i/100))%10;

//         if(arr[0] == undefined){
//             arr[0]=[]
//         }
//         if(huns == 1){
//             arr[0][0] = i;
//         }else{
//             if(arr[10-tens-1] == undefined){
//                 arr[10-tens-1] = []
//             }
//             if(tens !=0 && arr[10-tens] == undefined){
//                 arr[10-tens] = []
//             }

//             if(tens%2 == 0){ // even
//                 if(ones == 0){
//                     arr[10-tens][0] = i;
//                 }
//                 else{
//                     arr[10-tens-1][ones-1] = i;
//                 }
//             }else{ // odd
//                 if(ones == 0){
//                     arr[10-tens][9] = i;
//                 }
//                 else{
//                     arr[10-tens-1][10-ones] = i;
//                 }
//             }
            
//         }
//     }
//     console.log(arr);
// }
// genturu()



function getPosToken(score = 0){

    if(score <= 0 || score >100){
        return null;
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

//////////////////////////////////////////////////////////////////////////////
///////////// CALLING FUNCTIONS //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

joinRoomAtStart();
console.log(getPosToken(53))
