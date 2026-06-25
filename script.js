var board = null;
var game = new Chess();

let whiteCaptured = [];
let blackCaptured = [];

/* Questions */

const easyQuestions = [
{
q:"What is RAM?",
a:"memory"
},
{
q:"What is CPU?",
a:"processor"
}
];

const mediumQuestions = [
{
q:"What is OOP?",
a:"object"
},
{
q:"What is DBMS?",
a:"database"
}
];

const hardQuestions = [
{
q:"What is Deadlock?",
a:"deadlock"
},
{
q:"What is TCP?",
a:"protocol"
}
];

const expertQuestions = [
{
q:"Explain Virtual Memory",
a:"memory"
},
{
q:"Explain Machine Learning",
a:"learning"
}
];

function getQuestion(piece){

    let list;

    switch(piece.toLowerCase()){

        case 'p':
            list = easyQuestions;
            break;

        case 'n':
        case 'b':
            list = mediumQuestions;
            break;

        case 'r':
        case 'q':
            list = hardQuestions;
            break;

        case 'k':
            list = expertQuestions;
            break;

        default:
            list = easyQuestions;
    }

    return list[
        Math.floor(Math.random()*list.length)
    ];
}

/* Captured Pieces */

function trackCapture(move){

    if(!move.captured)
        return;

    const symbols = {
        p:"♟",
        r:"♜",
        n:"♞",
        b:"♝",
        q:"♛",
        k:"♚"
    };

    if(move.color === "w"){

        whiteCaptured.push(
            symbols[move.captured]
        );

        document.getElementById(
            "whiteCaptured"
        ).innerHTML =
        "White Captured: " +
        whiteCaptured.join(" ");

    }else{

        blackCaptured.push(
            symbols[move.captured]
        );

        document.getElementById(
            "blackCaptured"
        ).innerHTML =
        "Black Captured: " +
        blackCaptured.join(" ");
    }
}

/* AI Move */

function makeRandomMove(){

    var possibleMoves = game.moves();

    if(possibleMoves.length === 0)
        return;

    var randomMove =
        possibleMoves[
            Math.floor(
                Math.random() *
                possibleMoves.length
            )
        ];

    let move =
        game.move(randomMove);

    trackCapture(move);

    board.position(game.fen());

    if(game.in_checkmate()){
        alert("AI Wins!");
    }
}

/* Drag Start */

function onDragStart(source,piece){

    if(game.game_over())
        return false;

    if(piece.search(/^b/) !== -1)
        return false;
}

/* Drop Piece */

function onDrop(source,target){

    let pieceInfo =
        game.get(source);

    let question =
        getQuestion(
            pieceInfo.type
        );

    let answer =
        prompt(question.q);

    if(answer === null)
        return "snapback";

    if(
       !answer
       .toLowerCase()
       .includes(
           question.a
       )
    ){

        alert(
            "Wrong Answer! Move Cancelled"
        );

        return "snapback";
    }

    var move = game.move({
        from: source,
        to: target,
        promotion:'q'
    });

    if(move === null)
        return "snapback";

    trackCapture(move);

    window.setTimeout(
        makeRandomMove,
        500
    );
}

/* Update Board */

function onSnapEnd(){

    board.position(
        game.fen()
    );

    if(game.in_checkmate()){
        alert(
            "You Win!"
        );
    }
}

/* Board Config */

var config = {

    draggable:true,

    position:'start',

    pieceTheme:
    'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',

    onDragStart:onDragStart,

    onDrop:onDrop,

    onSnapEnd:onSnapEnd
};

board =
Chessboard(
    'board',
    config
);