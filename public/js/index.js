
const socket = io("http://localhost:3000/");


const bodyContainer = document.querySelector("#body_container");
const startCover = document.querySelector("#start_cover");
const startCoverText = document.querySelector("#start_cover_text");
const startCoverButton = document.querySelector("#start_cover_but");
const headerbar = document.querySelector("#headerbar");
const mainContainer = document.querySelector("#main_container");
const form1 = document.querySelector("#form_1");
const f1Text = document.querySelector("#f1_text");
const f1Box = document.querySelector("#f1_box");
const f1Button = document.querySelector("#f1_but");
const form2 = document.querySelector("#form_2");
const f2JoinButton = document.querySelector("#f2_join_but");
const f2Text = document.querySelector("#f2_text");
const f2CreateButton = document.querySelector("#f2_ceate_but");
const form3c = document.querySelector("#form_3c");
const f3cText = document.querySelector("#f3c_text");
const f3cCodeOuter = document.querySelector("#f3c_code_outer");
const f3cCode = document.querySelector("#f3c_code");
const f3cCopyButton = document.querySelector("#f3c_copy");
const f3cCopiedText = document.querySelector("#f3c_copied_text");
const form3j = document.querySelector("#form_3j");
const f3jText = document.querySelector("#f3j_text");
const f3jBox = document.querySelector("#f3j_box");
const f3jButton = document.querySelector("#f3j_but");

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

if(startCover){
    startCoverButton.addEventListener("click", () =>{
        startCover.classList.add("hide")
        setCookie("startCoverButtonClicked", true);
        deleteElmWait(startCover, 0.3)
    })
}

f1Button.addEventListener("click", () => {
    if(f1Box.value.trim() != ""){
        playerName = f1Box.value;
        enableF2();
        // showForm(form2)
    }
})

function enableF2() {
    f2CreateButton.addEventListener("click", () => {
        enableF3c();
        // showForm(form3c);
    })
    f2JoinButton.addEventListener("click", () => {
        enableF3j();
        // showForm(form3j);
    })
}

async function enableF3c() {
    // request to create room
    const { data } = await axios.post("/createroom", {playerName: playerName, playerAuthCode: playerAuthCode});
    console.log(data.data);
    roomCode = data.data.roomCode;
    if(roomCode){
        f3cCode.innerText = roomCode;
        socket.emit("join-room", {roomCode: roomCode, playerAuthCode: playerAuthCode, playerName: playerName}, (payload) => {
            const { status } = payload;
            if(status == "success") {
                console.log(status,"iooi");
                enableF3cButton();
            }
        });
    }
}

function enableF3cButton(){

}

function enableF3j() {
    f3jButton.addEventListener("click", () => {
        if(f3jBox.value.trim() != ""){
            roomCode = f3jBox.value;
            
            // request to join room
            // enter room
        }
    })
}

