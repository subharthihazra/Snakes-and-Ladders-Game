const generateRandomString = require('./generateRandomString');

const generatePlayerAuthCode = () =>{
    return generateRandomString(4);
}

module.exports = generatePlayerAuthCode;