/* eslint-disable max-classes-per-file */
// **************************************************************
// DOM references
// **************************************************************

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// **************************************************************
// Variables
// **************************************************************

// --------------------------------------------------------------
// Constants
// --------------------------------------------------------------

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const paddleXStart = (canvas.width - paddleWidth) / 2;
const paddleYStart = canvas.height - paddleHeight;
const PI2 = Math.PI * 2;
const objectColor = '#0095DD';
const fontStyle = '16px Arial';
const alertSuccess = 'YOU WIN, CONGRATULATIONS!';
const alertGameOver = 'GAME OVER';


// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

// ** Initialize the position of the ball and paddle
// ** and set the ball speed and direction
// **** A Ball Object would be good.
// let x; // = canvas.width / 2;
// let y; // = canvas.height - 30;
// let dx; // = 2;
// let dy; // = -2;

class Ball {
  constructor(x = 0, y = 0, dx = 2, dy = -1, radius = 10, color = 'red') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.Color;
    ctx.fill();
    ctx.closePath();
  }
}

// Bricks
class Bricks {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        // **** This block should really be part of the brick initialization
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        this.bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, objectColor);
      }
    }
  }

  render() {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount)

// Paddle

class Paddle {
  constructor(x, y, width, height, color = 'red', stroke = 2) { //stroke
    this.x = x; // but the y  for paddle is canvas.height - paddleHeight
    this.y = y;
    this.width = width;
    this.height = height;
    this.stroke = stroke; // line width
    this.color = color;
    // ctx.fillStyle = objectColor;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    // ctx.strokeStyle = this.stroke;
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
  }
}

const paddle = new Paddle(paddleXStart, paddleYStart, paddleWidth, paddleHeight)

// Score

class Score {
  constructor(x, y, color = objectColor, score = 0, font = fontStyle) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.score = score;
    this.font = font;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(`Score: ${this.score}`, 8, 20);
  }
}

let score = new Score();

// Lives

// Game (draw, runs game loop, creates instances of all other classes)

let ball = new Ball(0, 0, 2, -2, ballRadius, objectColor);

// let paddleX; // = paddleXStart;

// let paddleX = new Paddle(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

resetBallAndPaddle();

// let score = 0;
let lives = 3;

let rightPressed = false;
let leftPressed = false;

// --------------------------------------------------------------
// Setup Bricks Array
// --------------------------------------------------------------


// *** This would be better in a function


// **************************************************************
// Functions
// **************************************************************


// function initializeBricks() {
//   for (let c = 0; c < brickColumnCount; c += 1) {
//     bricks[c] = [];
//     for (let r = 0; r < brickRowCount; r += 1) {
//       // **** This block should really be part of the brick initialization
//       const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
//       const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
//       bricks[c][r] = new Brick(brickX, brickY, brickWidth, brickHeight, objectColor);
//     }
//   }
// }

// function drawPaddle() {
//   paddle.render(ctx);
//   // ctx.beginPath();
//   // ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
//   // ctx.fillStyle = objectColor;
//   // ctx.fill();
//   // ctx.closePath();
// }

// function drawBricks() {
//   for (let c = 0; c < brickColumnCount; c += 1) {
//     for (let r = 0; r < brickRowCount; r += 1) {
//       const brick = bricks[c][r];
//       if (bricks[c][r].status === 1) {
//         brick.render(ctx);
//       }
//     }
//   }
// }

function collisionDetection() {
  for (let c = 0; c < bricks.cols; c += 1) {
    for (let r = 0; r < bricks.rows; r += 1) {
      const brick = bricks.bricks[c][r];
      if (brick.status === 1) {
        if (ball.x > brick.x
          && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy;
          brick.status = 0;
          score.score += 1;
          if (score === brickRowCount * brickColumnCount) {
            // eslint-disable-next-line no-alert
            alert(alertSuccess);
            document.location.reload();
          }
        }
      }
    }
  }
}

// function drawScore() {
//   ctx.font = fontStyle;
//   ctx.fillStyle = objectColor;
//   ctx.fillText(`Score: ${score}`, 8, 20);
// }

function drawLives() {
  ctx.font = fontStyle;
  ctx.fillStyle = objectColor;
  // * canvas.width might be better as a constants
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// set the ball in the middle of the canvas

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 2;
  ball.dy = -2;
  paddle.x = paddleXStart;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddle() {
  // Check for arrow keys
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }
}

// --------------------------------------------------------------
// Game Loop
// --------------------------------------------------------------

function draw() {
  // Clear the canvas
  // * canvas.width, and canvas.height might be better as constants
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // console.log(canvas.height, canvas.width);
  // Call helper functions
  bricks.render(ctx);
  ball.render(ctx);
  paddle.render(ctx);
  // drawPaddle();
  score.render(ctx);
  drawLives();
  collisionDetection();
  moveBall();
  movePaddle();

  // Bounce the ball off the left and right of the canvas
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ball.radius) {
    // hit the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    // hit the bottom
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      // Hit the paddle
      ball.dy = -ball.dy;
    } else {
      // Lose a life
      lives -= 1;
      if (!lives) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert(alertGameOver);
        ball.x = 200;
        ball.y = 200;
        document.location.reload();
      } else {
        resetBallAndPaddle();
      }
    }
  }


  // // Check for arrow keys
  // // *** Better as a function
  // if (rightPressed && paddleX < canvas.width - paddleWidth) {
  //   paddleX += 7;
  // } else if (leftPressed && paddleX > 0) {
  //   paddleX -= 7;
  // }

  // Draw the screen again
  requestAnimationFrame(draw);
}

// --------------------------------------------------------------
// Event Listeners
// --------------------------------------------------------------

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddleWidth / 2;
  }
}

// **************************************************************
// Register Events
// **************************************************************

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);


// **************************************************************
// Starts program entry point
// **************************************************************

draw();
