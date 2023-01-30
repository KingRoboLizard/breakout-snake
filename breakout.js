const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

let px = canvas.width / 2;

let dx = 0;
let dy = -10;
let x = px;
let y = canvas.height - 100;

let playing = true;
let score = 0;

document.onmousemove = mouseCoordinates;

function mouseCoordinates(event) {
    px = event.clientX;
}

class block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
let brickColumns = 15;
let brickRows = 10;
let brickWidth = canvas.width / brickColumns - 10;

let blocks = [];
for (let i = 0; i < brickColumns; i++) {
    for (let j = 0; j < brickRows; j++) {
        blocks.push(new block(canvas.width / brickColumns * i, j * 30 + 60));
    }
}

ctx.font = "24px monospace"
Loop();

function Loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (playing) {
        Draw();
        CheckCollision();
        ctx.fillText(score, canvas.width / 2, 50)
        setTimeout(Loop, 1000 / 60);
    }
    else {
        ctx.fillText("Game over", canvas.width / 2 - 24 * 2.25, canvas.height / 2)
        ctx.fillText(score, canvas.width / 2 - 6, 50)
    }
}

function Draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillRect(px - 75, canvas.height - 50, 150, 30)
    blocks.forEach(block => {
        ctx.fillStyle = 'hsl(' + (50 + 50 / (block.y / 100)) + ',100%,50%)'
        ctx.fillRect(block.x, block.y, brickWidth, 25)
    }
    );
}

function CheckCollision() {
    if (x > px - 100 && x < px + 100 && y == canvas.height - 70) {
        dy = Math.abs((px - x) / 10) - 10;
        dx = (x - px) / 5;
    }
    y += dy;
    blocks.forEach((block, i) => {
        if (x + 10 > block.x && x - 10 < block.x + brickWidth && y + 10 > block.y && y - 10 < block.y + 25) {
            blocks.splice(i, 1);
            dy = -dy;
            y += dy;
            score++;
        }
    }
    );
    x += dx;
    blocks.forEach((block, i) => {
        if (x + 10 > block.x && x - 10 < block.x + brickWidth && y + 10 > block.y && y - 10 < block.y + 25) {
            blocks.splice(i, 1);
            dx = -dx;
            x += dx;
            score++;
        }
    }
    );

    if (x < 0 || x > canvas.width) { dx = -dx }
    if (y < 0) { dy = -dy }
    else if (y > canvas.height) { playing = false; }
}
