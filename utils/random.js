const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateRandomString = (length) => {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


const rollADice = () => {
    // The Math. random() method returns a random number from 0 (inclusive) up to but not including 1 (exclusive).
    return (Math.floor(Math.random() * 6) + 1);
}


module.exports = {generateRandomString, rollADice};