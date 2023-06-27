// msgbox = document.querySelector("#msgbox")
// msgbut = document.querySelector("#msgbut")
// roombox = document.querySelector("#roombox")
// roombut = document.querySelector("#roombut")

const socket = io();

msgbut.addEventListener("click", () => {
    socket.emit("sendu",roombox.value, msgbox.value);
})

socket.on("recvu", (message) => {
    console.log(message);
})

roombut.addEventListener("click", () => {
    socket.emit("joro", roombox.value);
})