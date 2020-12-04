/*
    unknown[] Array<>
    object {} Record<>
    boolean
    string
    number NaN
    unknown
    any
    void
    null
    undefined
    never

     *.d.ts

    | &
    утиная типизация

    type interface
    extends
    keyof
*/

class Point {

    public x: number;
    public y: number;
    public status: 1 | 0;

    public constructor(x: number, y: number, status: 1 | 0) {
        this.x = x;
        this.y = y;
        this.status = status;
    }
}

class Brick extends Point {



    constructor(x: number, y: number, status: 1 | 0) {
        super(x, y, status);

    }
}


// let canvas: HTMLElement | null = document.getElementById("myCanvas");
const canvas: HTMLCanvasElement | null = document.querySelector<HTMLCanvasElement>('canvas[id="myCanvas"]');

if (!canvas) {
    throw new Error("invalid canvas");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("invalid ctx");
}

let ballRadius: number = 10;
let x: number = canvas.width / 2;
let y: number = canvas.height - 30;
let dx: number = 2;
let dy: number = -2;
let paddleHeight: number = 10;
let paddleWidth: number = 75;
let paddleX: number = (canvas.width - paddleWidth) / 2;
let rightPressed: boolean = false;
let leftPressed: boolean = false;
let brickRowCount: number = 5;
let brickColumnCount: number = 3;
let brickWidth: number = 75;
let brickHeight: number = 20;
let brickPadding: number = 10;
let brickOffsetTop: number = 30;
let brickOffsetLeft: number = 30;
let score: number = 0;
let lives: number = 3;

let bricks: Point[][] = [];

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = new Point(0, 0, 1);
    }
}

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if(e.keyCode == 39) {
        rightPressed = true;
    } else if(e.keyCode == 37) {
        leftPressed = true;
    }
});
document.addEventListener("keyup", (e) => {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
});
document.addEventListener("mousemove", (e) => {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
});

const collisionDetection = (): void => {
    for (let c: number = 0; c < brickColumnCount; c++) {
        for(let r: number = 0; r < brickRowCount; r++) {
            let b: Point = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
};

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};
const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};
const drawBricks = () => {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
};
const drawScore = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
};
const drawLives = () => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
};

draw();
