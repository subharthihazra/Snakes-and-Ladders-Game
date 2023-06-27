const generateRandomString = require('./generateRandomString');

const generateRoomCode = () =>{
    return generateRandomString(6);
}

module.exports = generateRoomCode;