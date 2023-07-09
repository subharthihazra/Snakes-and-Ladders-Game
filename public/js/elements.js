const GAME_INFO_ANIM_DURATION = 0.3;

const bodyContainer = document.querySelector("#body_container");
const startCover = document.querySelector("#start_cover");
const startCoverText = document.querySelector("#start_cover_text");
const startCoverButton = document.querySelector("#start_cover_but");
const headerbar = document.querySelector("#headerbar");
const mainContainer = document.querySelector("#main_container");
const formContainer = document.querySelector("#form_container");
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
const f3cButton = document.querySelector("#f3c_but");
const form3j = document.querySelector("#form_3j");
const f3jText = document.querySelector("#f3j_text");
const f3jBox = document.querySelector("#f3j_box");
const f3jButton = document.querySelector("#f3j_but");
const gameContainer = document.querySelector("#game_container");
const gameBoardContainer = document.querySelector("#game_board_container");
const gameInfo = document.querySelector("#game_info");
const gameBoard = document.querySelector("#game_board");
const chatContainer = document.querySelector("#chat_container");
const chatView = document.querySelector("#chat_view");
const chatMsgbar = document.querySelector("#chat_msgbar");

let playerNames = {};
let startGame = undefined;
let curGameState = undefined;
let playerTokens = {};
let rollDice = undefined;
let playAgain = undefined;

let dice = undefined;
let turn = undefined;

let playAgainButBool = false;