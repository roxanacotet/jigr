function moveToSelected(element) {

  if (element == "next") {
    var selected = $(".selected").next();
  } else if (element == "prev") {
    var selected = $(".selected").prev();
  } else {
    var selected = element;
  }

  var next = $(selected).next();
  var prev = $(selected).prev();
  var prevSecond = $(prev).prev();
  var nextSecond = $(next).next();

  $(selected).removeClass().addClass("selected");

  $(prev).removeClass().addClass("prev");
  $(next).removeClass().addClass("next");

  $(nextSecond).removeClass().addClass("nextRightSecond");
  $(prevSecond).removeClass().addClass("prevLeftSecond");

  $(nextSecond).nextAll().removeClass().addClass('hideRight');
  $(prevSecond).prevAll().removeClass().addClass('hideLeft');

}

// Eventos teclado
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        moveToSelected('prev');
        break;

        case 39: // right
        moveToSelected('next');
        break;

        default: return;
    }
    e.preventDefault();
});

$('#carousel div').click(function() {
  moveToSelected($(this));
});

$('#prev').click(function() {
  moveToSelected('prev');
});

$('#next').click(function() {
  moveToSelected('next');
});

//upload or add images via URL
const loadImage = document.getElementById('load__image');
loadImage.addEventListener('input', loadImageEventHandler);

const loadUrl = document.getElementById('load__url');
loadUrl.addEventListener('input', loadUrlEventHandler);

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
      // if (typeof game === 'undefined') {
      //     let difficulty = new Difficulty(pieceNumber.value, pieceShape.value);
      //     game = new Game(image, difficulty);
      // } else {
          game.image = image;
          game.src = image.src;
          game.pieces = [];
          game.solvedPieces = [];
          game.progress = 0;
          let difficulty = new Difficulty(pieceNumber.value, pieceShape.value);
          game.difficulty = difficulty.pieceNumber;
          game.canvas = new Canvas(image, difficulty.pieceShape);
      // }

      // setGameProgressBar(0);

      game.initializeGame();
  });
}


// //save
// function onSaveEventHandler() {
//   let gameData = JSON.stringify(game, null, 4);

//   let anchor = document.createElement('a');
//   anchor.href = 'data:application/json,' + gameData;
//   anchor.style.display = 'none';
//   anchor.download = "puzzle-saved-game.json";

//   document.body.appendChild(anchor);
//   anchor.click(); // Force the browser to show the save file menu without making the user click.
//   document.body.removeChild(anchor);
// }

// //load
// // https://stackoverflow.com/questions/750032/reading-file-contents-on-the-client-side-in-javascript-in-various-browsers
// function loadSavedGameHandler(event) {
//   if (!event.target.value) {
//       iqwerty.toast.Toast('Please select one!', options);
//   } else {
//       let reader = new FileReader();
//       let file = loadSavedGame.files[0];
//       reader.readAsText(file, "UTF-8");

//       reader.addEventListener("load", () => resumeFromSavedGame(reader.result));
//   }
}