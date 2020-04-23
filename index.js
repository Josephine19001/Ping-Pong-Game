const canvas = document.getElementById('pong');
const cxt = canvas.getContext('2d');
//cxt.fillRect(0, 0, canvas.width, canvas.height, "#000")

//Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX:5,
    velocityY:5,
    speed:5,
    color:'WHITE'

}
// User paddle Object
const user = {
    x : 0,
    y : (canvas.height-100)/2,
    width : 10,
    height:100,
    score : 0,
    color :"WHITE"
}

//Computer Paddle Object
const computer = {
    x : canvas.width-10,
    y : (canvas.height-100)/2,
    width : 10,
    height : 100,
    score : 0,
    color :"WHITE"
}


// Net or Seperator Object
const net = {
    x : (canvas.width-2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}



// Draw paddle(Rect)
function drawRect(x,y,w,h,color) {
    cxt.fillStyle = color;
    cxt.fillRect(x,y,w,h)
}

// Draw ball
function drawBall(x,y,r,color) {
    cxt.fillStyle = color;
    cxt.beginPath();
    cxt.arc(x,y,r,0,Math.PI*2,true) //0 - 360deg (0, Math.Pi*2)
    cxt.closePath();
    cxt.fill();
}


// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}
//Reset scores if either user or computer scores
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}
//Draw Net
function drawNet() {
    for (let i = 0; i < canvas.height; i+=15) {
        drawRect(net.x,net.y + i,net.width,net.height,net.color)
    }
}


//Score Text
function drawText(text,x,y) {
    cxt.fillStyle = "#FFF";
    cxt.font = "72px Times";
    cxt.fillText(text,x,y);
}
// finding possibility of collision occurence,thus ball colliding with a paddle

function collision(ball,player) {
    //Player's position with reference to the y-axis
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x +player.width

    //Ball's position with reference to x-axis
    ball.top = ball.y-ball.radius;
    ball.bottom = ball.y+ball.radius;
    ball.right = ball.x + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.right >player.left && ball.top < player.bottom && ball.left < player.right && ball.bottom > player.top
    
}

// On update
function update() {
    // change score depending on direction. if left, computer scores and vice versa
    if((ball.x -ball.radius) < 0){
        computer.score++;
        resetBall();
    }else if((ball.x+ball.radius) >canvas.width){
        user.score++;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI for winning over computer paddle
    let computerLevel = 0.1;
    computer.y += (ball.y-(computer.y+(computer.height/2))) * computerLevel;

    //if velocityY point is negative, then reverse set velocityY to be negative
    let positiveBallHeight = ball.y+ball.radius;
    let negativeBallHeight = ball.y-ball.radius;
    if(positiveBallHeight > canvas.height || negativeBallHeight<0){
        ball.velocityY = -ball.velocityY;
    }

    //Checking where ball collided
    let player = ((ball.x+ball.radius) < (canvas.width/2)) ? user : computer

    if(collision(ball,player)){
        //check where the ball hit the paddle
        let collisionPoint = ball.y - (player.y + (player.height/2));
        collisionPoint = collisionPoint / player.height/2;
        let angleRad = collisionPoint * (Math.PI/4);

        //changing x and y velocity direction
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        //increase speed if collision occurs
        ball.speed += 0.1;
    }

}

// Render the display function
function render() {
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#511845");
    //User score
    drawText(user.score,canvas.width/4,canvas.height/5);
    //Computer Score
    drawText(computer.score,3*canvas.width/4,canvas.height/5);
    //Call DrawNet
    drawNet();
    // Call drawRect on both userPaddle and 
    drawRect(user.x,user.y,user.width,user.height,user.color);
    //Call drawRect on computerPaddle
    drawRect(computer.x,computer.y,computer.width,computer.height,computer.color);
     //Call drawBall on ball object
     drawBall(ball.x,ball.y,ball.radius,ball.color);
}

//Game function
function game() {
    update();
    render();
}

let framePerSecond = 50;
let loop = setInterval(game,1000/framePerSecond);