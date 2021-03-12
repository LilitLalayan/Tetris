const items = document.querySelectorAll(".item");
let allItems = Array.from(items);
let squares = Array.from(document.querySelectorAll(".screen, div")).slice(1);
const container = document.getElementById("container");
const button = document.getElementById("startGame");
const item = items[0];
const rowCount = 20;
const columnCount = 10;
const over = document.querySelector("#over");
const count = document.getElementById("count");
let score = 0;

let currentCoord = Math.floor(columnCount / 2 - 1);
container.style.width = columnCount * 30 + "px";
const GAME_STATES = {
  initial: "initial",
  playing: "playing",
  paused: "paused",
};
let state = GAME_STATES.initial;

//My Figures
const figureL = [
  [1, columnCount + 1, columnCount * 2 + 1, 2],
  [columnCount, columnCount + 1, columnCount + 2, columnCount * 2 + 2],
  [1, columnCount + 1, columnCount * 2, columnCount * 2 + 1],
  [columnCount, columnCount * 2, columnCount * 2 + 1, columnCount * 2 + 2],
];

const figureLFlip = [
  [0, 1, columnCount + 1, columnCount * 2 + 1],
  [2, columnCount, columnCount + 1, columnCount + 2],
  [1, columnCount + 1, columnCount * 2 + 1, columnCount * 2 + 2],
  [columnCount, columnCount + 1, columnCount + 2, columnCount * 2],
];

const figureZ = [
  [columnCount + 1, columnCount + 2, columnCount * 2, columnCount * 2 + 1],
  [0, columnCount, columnCount + 1, columnCount * 2 + 1],
  [columnCount + 1, columnCount + 2, columnCount * 2, columnCount * 2 + 1],
  [0, columnCount, columnCount + 1, columnCount * 2 + 1],
];
const figureZFlip = [
  [columnCount, columnCount + 1, columnCount * 2 + 1, columnCount * 2 + 2],
  [2, columnCount + 1, columnCount + 2, columnCount * 2 + 1],
  [columnCount, columnCount + 1, columnCount * 2 + 1, columnCount * 2 + 2],
  [2, columnCount + 1, columnCount + 2, columnCount * 2 + 1],
];

const figureT = [
  [1, columnCount, columnCount + 1, columnCount + 2],
  [1, columnCount + 1, columnCount + 2, columnCount * 2 + 1],
  [columnCount, columnCount + 1, columnCount + 2, columnCount * 2 + 1],
  [1, columnCount, columnCount + 1, columnCount * 2 + 1],
];

const figureSq = [
  [0, 1, columnCount, columnCount + 1],
  [0, 1, columnCount, columnCount + 1],
  [0, 1, columnCount, columnCount + 1],
  [0, 1, columnCount, columnCount + 1],
];

const figureI = [
  [1, columnCount + 1, columnCount * 2 + 1, columnCount * 3 + 1],
  [columnCount, columnCount + 1, columnCount + 2, columnCount + 3],
  [1, columnCount + 1, columnCount * 2 + 1, columnCount * 3 + 1],
  [columnCount, columnCount + 1, columnCount + 2, columnCount + 3],
];
const figures = [
  figureSq,
  figureI,
  figureT,
  figureZFlip,
  figureZ,
  figureL,
  figureLFlip,
];

// Randomly draw a figure
let currRotation = 0;
let randomFigure = Math.floor(Math.random() * figures.length);
let currentFigure = figures[randomFigure][currRotation];

function draw() {
  currentFigure.forEach((index) => {
    squares[currentCoord + index].classList.add("figureStyle");
  });
}

function erase() {
  currentFigure.forEach((index) => {
    squares[currentCoord + index].classList.remove("figureStyle");
  });
}

//add functionality to buttons
button.addEventListener("click", onControlButtonClick);
function onControlButtonClick() {
  if (state === GAME_STATES.initial) {
    startGame();
  } else if (state === GAME_STATES.playing) {
    pauseGame();
  } else if (state === GAME_STATES.paused) {
    resumeGame();
  }
}
function startGame() {
  over.style.visibility = "hidden";
  allItems.forEach((item) => item.classList.remove("occupied"));
  allItems.forEach((item) => item.classList.remove("figureStyle"));
  startInterval();
  state = GAME_STATES.playing;
  button.innerText = "Pause";
}
function pauseGame() {
  clearInterval(timer);
  state = GAME_STATES.paused;
  button.innerText = "Play";
}
function resumeGame() {
  startInterval();
  state = GAME_STATES.playing;
  button.innerText = "Pause";
}

//add functionality to keyboard keys
document.body.addEventListener("keydown", onKeyDown);
function onKeyDown(e) {
  if (state !== GAME_STATES.playing) {
    return;
  }
  if (e.key === "ArrowDown") {
    moveDown();
  }
  if (e.key === "ArrowRight") {
    moveRight();
  }

  if (e.key === "ArrowLeft") {
    moveLeft();
  }
  if (e.key === "ArrowUp") {
    rotate();
  }
}

function moveDown() {
  erase();
  currentCoord += columnCount;
  draw();
  freeze();
}

function freeze() {
  if (
    currentFigure.some((index) =>
      squares[currentCoord + index + columnCount].classList.contains("occupied")
    )
  ) {
    currentFigure.forEach((index) => {
      squares[currentCoord + index].classList.add("occupied");
    });

    randomFigure = Math.floor(Math.random() * figures.length);
    currentFigure = figures[randomFigure][currRotation];
    currentCoord = Math.floor(columnCount / 2 - 1);
    draw();
    isFull();
    gameOver();
  }
}

function moveRight() {
  const rightEdge = currentFigure.some(
    (index) => (currentCoord + index) % columnCount === columnCount - 1
  );
  if (!rightEdge) {
    erase();
    currentCoord += 1;

    if (
      currentFigure.some((index) =>
        squares[currentCoord + index].classList.contains("occupied")
      )
    ) {
      currentCoord -= 1;
    }

    draw();
  }
}

function moveLeft() {
  const leftEdge = currentFigure.some(
    (index) => (currentCoord + index) % columnCount === 0
  );
  if (!leftEdge) {
    erase();
    currentCoord -= 1;
    if (
      currentFigure.some((index) =>
        squares[currentCoord + index].classList.contains("occupied")
      )
    ) {
      currentCoord += 1;
    }

    draw();
  }
}

//
let timer;
function startInterval() {
  timer = setInterval(moveDown, 1000);
}

// for rotating the figures
function rotate() {
  erase();
  currRotation++;
  if (currRotation === currentFigure.length) {
    currRotation = 0;
  }
  currentFigure = figures[randomFigure][currRotation];
  draw();
}

//Full row

function isFull() {
  for (let i = 0; i < allItems.length - 1; i += columnCount) {
    let row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("occupied"))) {
      row.forEach((index) => {
        squares[index].classList.remove("occupied");
        squares[index].classList.remove("figureStyle");
      });
      const removedRow = squares.splice(i, columnCount);
      squares = removedRow.concat(squares);
      squares.forEach((el) => container.appendChild(el));
      score++;
      count.innerText = score;
    }
  }
}

//Game Over
function gameOver() {
  for (let i = columnCount; i < columnCount * 2; i++) {
    if (squares[i].classList.contains("occupied")) {
      clearInterval(timer);
      over.style.visibility = "visible";
      state = GAME_STATES.initial;
      button.innerText = "Start";
      score = 0;
      count.innerText = score;
    }
  }
}
