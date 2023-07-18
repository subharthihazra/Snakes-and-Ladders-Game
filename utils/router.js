const express = require('express');
const router = express.Router()

const {createRoom, addPlayer, getPlayer, getRoom, addPlayerToRoom, removePlayerFromRoom} = require("./game")


router.route("/").get((req, res) => {
    res.status(200).json({cow:10})
})
//     console.log(req.cookies);

//     let dataToSend = {};


//     if(req.cookies.playerName){
//         dataToSend.playerName = req.cookies.playerName;

//         if(dataToSend.playerName.length > 20){
//             dataToSend.playerName = dataToSend.playerName.substring(0, 20);
//         }

//     }else{
//         dataToSend.playerName = undefined;
//     }

//     if(req.cookies.playerAuthCode){
//         dataToSend.playerAuthCode = req.cookies.playerAuthCode;
//     }else{
//         dataToSend.playerAuthCode = undefined;
//     }

//     if(req.cookies.roomCode){
//         dataToSend.roomCode = req.cookies.roomCode;
//     }else{
//         dataToSend.roomCode = undefined;
//     }

//     if(req.cookies.startCoverButtonClicked){
//         dataToSend.startCoverButtonClicked = (req.cookies.startCoverButtonClicked=="true")?true:false;
//     }else{
//         dataToSend.startCoverButtonClicked = false;
//     }

    
//     res.render("index", dataToSend);
// })

// router.route("/createroom").post((req, res) => {
//     const {playerName, playerAuthCode} = req.body;
//     console.log(req.cookies, "cowww")
//     if((playerAuthCode && playerAuthCode.trim().length == 4) && (playerName && playerName.trim() != "")){

//         const roomCode = createRoom();
//         addPlayerToRoom(roomCode, playerAuthCode)

//         res.cookie("playerAuthCode", playerAuthCode.trim())
//         res.cookie("roomCode", roomCode)
//         res.cookie("playerName", playerName.trim())
//         res.status(201).json({status: "success" , data:{roomCode: roomCode}})
    
//     }else{
//         res.status(500).json({status: "error" , message: "Error Occured"})
//     }
// })


// router.route("/addplayer").post((req, res) => {
//     let {playerName} = req.body;
//     if(playerName && playerName.trim() != ""){

//         if(playerName.length > 20){
//             playerName = playerName.substring(0, 20);
//         }
        
//         const playerAuthCode = addPlayer(playerName.trim());

//         res.cookie("playerAuthCode", playerAuthCode);
//         res.cookie("playerName", playerName.trim());

//         res.status(201).json({status: "success" , data:{playerAuthCode: playerAuthCode}})
//     }else{
//         res.status(500).json({status: "error" , message: "Error Occured"})
//     }
// })



// router.route("/joinroom").post((req, res) => {
//     let {roomCode, playerAuthCode, playerName} = req.body;
//     if(roomCode && roomCode.trim().length == 6 &&
//     playerAuthCode && playerAuthCode.trim().length == 4 && playerName && playerName.trim() != ""){
//         // check if roomCode and playerAuthCode exists else add

//         // console.log(getRoom(roomCode))
//         // console.log(getRoom(roomCode))
//         if(playerName.length > 20){
//             playerName = playerName.substring(0, 20);
//         }

//         res.cookie("playerAuthCode", playerAuthCode.trim())
//         res.cookie("playerName", playerName.trim())

//         const currentPlayers = getRoom(roomCode);
//         if(currentPlayers == undefined){
//             createRoom(roomCode);

//         }else if(currentPlayers.length >4){
//             return res.status(201).json({status: "fail", message: "Room is full!"});
//         }
//         if(getPlayer(playerAuthCode) == undefined){
//             addPlayer(playerName, playerAuthCode);
//         }

//         addPlayerToRoom(roomCode, playerAuthCode)
        
//         res.cookie("roomCode", roomCode)

//         res.status(201).json({status: "success"})
//     }else{
//         res.status(500).json({status: "error" , message: "Error Occured"})
//     }
// })


module.exports = router;