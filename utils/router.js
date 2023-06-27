const express = require('express');
const router = express.Router()

const generatePlayerAuthCode = require("./generatePlayerAuthCode")
const generateRoomCode = require("./generateRoomCode")


router.route("/").get((req, res) => {
    console.log(req.cookies);

    let dataToSend = {};

    if(req.cookies.playerAuthCode){
        dataToSend.playerAuthCode = req.cookies.playerAuthCode;
    }else{
        dataToSend.playerAuthCode = generatePlayerAuthCode();
        res.cookie("playerAuthCode", dataToSend.playerAuthCode);
    }

    if(req.cookies.roomCode){
        dataToSend.roomCode = req.cookies.roomCode;
    }else{
        dataToSend.roomCode = undefined;
    }

    if(req.cookies.playerName){
        dataToSend.playerName = req.cookies.playerName;
    }else{
        dataToSend.playerName = undefined;
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
        const roomCode = generateRoomCode();
        res.cookie("playerAuthCode", playerAuthCode)
        res.cookie("roomCode", roomCode)
        res.cookie("playerName", playerName)
        res.status(201).json({status: "success" , data:{roomCode: roomCode}})
    }else{
        res.status(500).json({status: "error" , message: "Error Occured"})
    }
})

module.exports = router;