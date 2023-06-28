const express = require('express');
const router = express.Router()

const {createRoom, addPlayer, getPlayer, getRoom} = require("./playersAndRooms")


router.route("/").get((req, res) => {
    console.log(req.cookies);

    let dataToSend = {};


    if(req.cookies.playerName){
        dataToSend.playerName = req.cookies.playerName;
    }else{
        dataToSend.playerName = undefined;
    }

    if(req.cookies.playerAuthCode){
        dataToSend.playerAuthCode = req.cookies.playerAuthCode;
    }else{
        dataToSend.playerAuthCode = undefined;
    }

    if(req.cookies.roomCode){
        dataToSend.roomCode = req.cookies.roomCode;
    }else{
        dataToSend.roomCode = undefined;
    }

    if(req.cookies.startCoverButtonClicked){
        dataToSend.startCoverButtonClicked = (req.cookies.startCoverButtonClicked=="true")?true:false;
    }else{
        dataToSend.startCoverButtonClicked = false;
    }

    
    res.render("index", dataToSend);
})

router.route("/createroom").post((req, res) => {
    const {playerName, playerAuthCode} = req.body;
    console.log(req.cookies, "cowww")
    if((playerAuthCode && playerAuthCode.trim().length == 4) && (playerName && playerName.trim() != "")){

        const roomCode = createRoom();
        res.cookie("playerAuthCode", playerAuthCode.trim())
        res.cookie("roomCode", roomCode)
        res.cookie("playerName", playerName.trim())
        res.status(201).json({status: "success" , data:{roomCode: roomCode}})
    
    }else{
        res.status(500).json({status: "error" , message: "Error Occured"})
    }
})


router.route("/addplayer").post((req, res) => {
    const {playerName} = req.body;
    if(playerName && playerName.trim() != ""){
        
        const playerAuthCode = addPlayer(playerName.trim());

        res.cookie("playerAuthCode", playerAuthCode);
        res.cookie("playerName", playerName.trim());

        res.status(201).json({status: "success" , data:{playerAuthCode: playerAuthCode}})
    }else{
        res.status(500).json({status: "error" , message: "Error Occured"})
    }
})



router.route("/joinroom").post((req, res) => {
    const {roomCode, playerAuthCode, playerName} = req.body;
    if(roomCode && roomCode.trim().length == 6 &&
    playerAuthCode && playerAuthCode.trim().length == 4){
        // check if roomCode and playerAuthCode exists else add

        // console.log(getRoom(roomCode))
        // console.log(getRoom(roomCode))
        if(getRoom(roomCode) == undefined){
            createRoom(roomCode);
        }
        if(getPlayer(playerAuthCode == undefined)){
            addPlayer(playerAuthCode);
        }

        res.cookie("playerAuthCode", playerAuthCode.trim())
        res.cookie("roomCode", roomCode)
        res.cookie("playerName", playerName.trim())

        res.status(201).json({status: "success"})
    }else{
        res.status(500).json({status: "error" , message: "Error Occured"})
    }
})


module.exports = router;