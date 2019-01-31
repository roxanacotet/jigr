let game;

window.addEventListener("beforeunload", function () {
    console.log("event");
    window.localStorage.setItem('game-state', JSON.stringify(game));
});


// TODO: move in navigation.js
const loadImage = document.getElementById('load__image');
loadImage.addEventListener('input', loadImageEventHandler);

const loadUrl = document.getElementById('load__url');
loadUrl.addEventListener('input', loadUrlEventHandler);


let loadSavedGame = document.getElementById('load__saved__game');
loadSavedGame.addEventListener('input', loadSavedGameHandler);

function loadImageEventHandler(event) {
    if (!event.target.value) {
        iqwerty.toast.Toast('Please select one!', options);
    } else {
        let reader = new FileReader();
        let imagePath = loadImage.files[0];

        reader.readAsDataURL(imagePath);
        reader.addEventListener("load", () => drawImageFromSrcOnCanvas(reader.result));
    }
}

function loadUrlEventHandler() {
    drawImageFromSrcOnCanvas(loadUrl.value);
}

function drawImageFromSrcOnCanvas(imageSrc) {
    let image = new Image();
    image.src = imageSrc;

    image.addEventListener("load", function () {
        if (typeof game === 'undefined') {
           
            game = new Game(image);
        } else {
            game.image = image;
            game.src = image.src;
            game.pieces = [];
            game.solvedPieces = [];
            game.canvas = new Canvas(image);
        }

        game.initializeGame();
    });
}

function onUpEventHandler() {
    game.releasePiece();
}

function onDownEventHandler(event) {
    let clickPosition = game.canvas.getClickCoordinatesOnCanvas(event);
    game.determineClickedPiece(clickPosition);
}

function onMoveEventHandler(event) {
    if (game.clickedPieceIndex !== -1) {
        game.movePiece(event);
    }
}

function onResetEventHandler() {
    if (game.isOver()) {
        return;
    }
    
    game.pieces = [];
    game.solvedPieces = [];
    game.initializePuzzle();
}

// https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
function onRandomSelectedEventHandler() {
    if (game.isOver()) {
        return;
    }

    let randomIndex = Math.floor(Math.random() * game.pieces.length);
    let piece = game.pieces[randomIndex];
    piece.moveToFinalLocation();
    piece.makeVisible();
    piece.markAsSolved();

    game.moveToSolvedPieces(randomIndex);

}

function onCurrentlySelectedEventHandler() {
    if (game.lastClickedPieceIndex !== -1) {
        let piece = game.pieces[game.lastClickedPieceIndex];

        piece.moveToFinalLocation();
        piece.makeVisible();
        piece.markAsSolved();

        game.moveToSolvedPieces(game.lastClickedPieceIndex);


        game.lastClickedPieceIndex = -1;
    }
}

function onSaveEventHandler() {
    let gameData = JSON.stringify(game, null, 4);

    let anchor = document.createElement('a');
    anchor.href = 'data:application/json,' + gameData;
    anchor.style.display = 'none';
    anchor.download = "puzzle-saved-game.json";

    document.body.appendChild(anchor);
    anchor.click(); // Force the browser to show the save file menu without making the user click.
    document.body.removeChild(anchor);
}

// https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
function loadSavedGameHandler(event) {
    if (!event.target.value) {
        iqwerty.toast.Toast('Please select one!', options);
    } else {
        let reader = new FileReader();
        let file = loadSavedGame.files[0];
        reader.readAsText(file, "UTF-8");

        reader.addEventListener("load", () => resumeFromSavedGame(reader.result));
    }
}

function resumeFromSavedGame(savedGame) {
    let gameData = JSON.parse(savedGame);

    let image = new Image();
    image.src = gameData.src;

    image.addEventListener("load", function () {
        if (typeof game === 'undefined') {
            game = new Game(image);
        } else {
            game.canvas = new Canvas(image);
        }

        game.image = image;
        game.src = gameData.src;
        game.pieces = createPieces(gameData.pieces);
        game.solvedPieces = createPieces(gameData.solvedPieces);
        game.rows = gameData.rows;
        game.columns = gameData.columns;
        game.clickedPieceIndex = gameData.clickedPieceIndex;
        game.lastClickedPieceIndex = gameData.lastClickedPieceIndex;
        game.displayHelperImage = gameData.displayHelperImage;
        game.resume();
    });
}

function createPieces(pieces) {
    let pieceObjects = [];
    for (let piece of pieces) {
        let p = new Piece(new Point(), new Point());
        p.currentLocation = piece.currentLocation;
        p.finalLocation = piece.finalLocation;
        p.offsetToClickLocation = piece.offsetToClickLocation;
        p.width = piece.width;
        p.height = piece.height;
        p.row = piece.row;
        p.column = piece.column;
        p.visible = piece.visible;
        p.solved = piece.solved;

        pieceObjects.push(p);
    }

    return pieceObjects;
}

let savedGame = window.localStorage.getItem("game-state");
if (savedGame !== null && savedGame !== 'undefined') {
    let locale = localStorage.getItem('locale') || 'en';
    let message = locales[locale].resumeGameMessage;
    iqwerty.toast.Toast(message, options);
    resumeFromSavedGame(savedGame);
}