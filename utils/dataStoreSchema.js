const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    playerName: {
        type: String,
        required: [true, 'Player name must be provided']
    },
    playerAuthCode: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 4,
        required: [true, 'Player Auth Code must be provided']
    }
})

const roomSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        trim: true,
        minLength: 6,
        maxLength: 6,
        required: [true, 'Room Code must be provided']
    },
    players: [{
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 4,
        required: [true, 'Player Auth Code must be provided']
    }]
})

const gameSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        trim: true,
        minLength: 6,
        maxLength: 6,
        required: [true, 'Room Code must be provided']
    },
    players: [{
        playerAuthCode: {
            type: String,
            trim: true,
            minLength: 4,
            maxLength: 4,
            required: [true, 'Player Auth Code must be provided']
        },
        color: {
            type: String,
            enum : ['red', 'green', 'yellow', 'blue'],
            required: [true, 'Color must be provided']
        }
    }]
})

Player = mongoose.model('Player', playerSchema)
Room = mongoose.model('Room', playerSchema)
Game = mongoose.model('Game', gameSchema)

module.exports = {Player, Room, Game}
