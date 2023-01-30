const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let tileSize = 20;

canvas.width = document.body.clientWidth - document.body.clientWidth % tileSize;
canvas.height = document.body.clientHeight - document.body.clientHeight % tileSize;

class part {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Apple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let x = 5;
let y = 5;
let dx = 0;
let dy = 0;
let prevDirX = 0;
let prevDirY = 0;

const speed = 30;

let timeout;

let playing = true;

let inputs = [];
let snakeParts = [];
let apples = [];

let segments = 2;
let appleCount = 5;

document.addEventListener('keydown', function (event) {
    if (inputs.length < 3) {
        if (event.key == "w") {
            inputs.push("w");
        }
        else if (event.key == "s") {
            inputs.push("s");
        }
        if (event.key == "a") {
            inputs.push("a");
        }
        else if (event.key == "d") {
            inputs.push("d");
        }
    }
    if (event.key == "e") {
        segments += 100;
    }
    if (event.key == "r") {
        playing = true;
        x = 5;
        y = 5;
        dx = 0;
        dy = 0;
        prevDirX = 0;
        prevDirY = 0;
        segments = 2;
        inputs = [];
        snakeParts = [];
        apples = [];
        AddApple();
        ctx.filter = 'blur(0)';
        if (timeout != null) {
            clearTimeout(timeout);
        }
        loop();
    }
});

ctx.font = "24px monospace"

AddApple();
loop();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!playing) {
        ctx.fillStyle = "white"
        ctx.font = "48px monospace"
        ctx.fillText("Game Over!", canvas.width / 2 - 120, canvas.height / 2);
        ctx.font = "24px monospace"
        ctx.fillText("Press R to restart", canvas.width / 2 - 108, canvas.height / 2 + 48);
        ctx.fillText(segments - 2, canvas.width / 2, 50);
        DrawSnake();
        DrawApple();
        ctx.filter = 'blur(10px)';
    }
    else {
        DrawSnake();
        UpdatePos();
        prevDirX = dx;
        prevDirY = dy;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        CheckCollision();
        DrawApple();
        timeout = setTimeout(loop, 1000 / speed);
    }
    ctx.fillStyle = "white"
    ctx.fillText(segments - 2, canvas.width / 2, 50);
}

function UpdatePos() {
    if (inputs[0] == "w" && prevDirY != 1) { dx = 0; dy = -1; }
    else if (inputs[0] == "a" && prevDirX != 1) { dx = -1; dy = 0; }
    else if (inputs[0] == "s" && prevDirY != -1) { dx = 0; dy = 1; }
    else if (inputs[0] == "d" && prevDirX != -1) { dx = 1; dy = 0; }

    x += dx;
    if (x > canvas.width / tileSize - 1) { x = 0 }
    else if (x < 0) { x = canvas.width / tileSize - 1 }
    y += dy;
    if (y > canvas.height / tileSize - 1) { y = 0 }
    else if (y < 0) { y = canvas.height / tileSize - 1 }

    inputs.shift();
}

function CheckCollision() {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (x == apple.x && y == apple.y) {
            apples.splice(i, 1);
            AddApple();
            segments++;
        }
    }
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (x == part.x && y == part.y) {
            playing = false;
        }
    }
}

function DrawSnake() {
    if (snakeParts.length > segments) {
        snakeParts.shift();
    }
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillStyle = 'hsl(' + 44 + 50 / (snakeParts.length / i) + ',100%,50%)';
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    }
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    if (dx != 0 || dy != 0) {
        snakeParts.push(new part(x, y));
    }
}

function AddApple() {
    let canPlace = false;
    while (apples.length < appleCount) {
        if (snakeParts.length == 0) {
            apples.push(new Apple(Math.floor(Math.random() * canvas.width / tileSize), Math.floor(Math.random() * canvas.height / tileSize)))
        }

        let appleX = Math.floor(Math.random() * canvas.width / tileSize);
        let appleY = Math.floor(Math.random() * canvas.height / tileSize);

        for (let i = 0; i < snakeParts.length; i++) {
            let part = snakeParts[i];
            if (appleX == part.x && appleY == part.y) {
                canPlace = false;
                break;
            }
            else {
                canPlace = true;
            }
        }

        if (canPlace) {
            apples.push(new Apple(appleX, appleY));
        }
    }
}

function DrawApple() {
    ctx.fillStyle = "red";
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);
    }
}