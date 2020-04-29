'use strict'

document.addEventListener("down", onkeydown, false);
document.addEventListener("up", onkeyup, false);
const flipperLeft = document.querySelector('.flipper-left');
const flipperRight = document.querySelector('.flipper-right');
const playfield = document.querySelector('.playfield');
const screen = document.querySelector('.screen');
let movePlayfield = 0;
const fps = 100; // Frames per Second
const tbf = 1000/fps; // Time Between 2 Frames
const GRAVITY = 0.6;


class Table {
    constructor() {
        this.table1 = document.querySelector('.table')
        this.tableStyle = getComputedStyle(this.table1)
        this.widthString = this.tableStyle.width;
        this.heightString = this.tableStyle.height;
        this.width = this.widthString.replace("px", "");
        this.height = this.heightString.replace("px", "");
        console.log(this.table1.className)
        console.log(this.width + " / " + this.height)
        console.log(typeof this.width);
        
    }

    detectCollision(ball){
        return ((ball.x - ball.r<0) || (ball.x + ball.r > this.width) || (ball.y - ball.r < 0) || (ball.y + ball.r > this.height));
    }
    
    reflectCollision(b){
        let xMin = 0;
        let xMax = this.width;
        let yMin = 0;
        let yMax = this.height;
        if (b.x-b.r < xMin) {
            b.x = xMin+b.r;
            if (Math.abs(b.vx)>1){b.y = b.y + ((-b.x+xMin)+b.r)/b.vx*b.vy}
            b.vx = -b.vx*this.bounce;
            b.vy = b.vy*this.bounce;
        } else if (b.x+b.r > xMax) {
            b.x = xMax-b.r; 
            if (Math.abs(b.vx)>1){b.y = b.y - ((b.x-xMax)+b.r)/b.vx*b.vy}
            b.vx = -b.vx*this.bounce;
            b.vy = b.vy*this.bounce;
        } else if (b.y-b.r < yMin) {
            if (Math.abs(b.vy)>1){b.x = b.x + ((-b.y+yMin)+b.r)/b.vy*b.vx}
            b.y = yMin+b.r; 
            b.vx = b.vx*this.bounce;
            b.vy = -b.vy*this.bounce;
        } else if (b.y+b.r > yMax) {
            if (Math.abs(b.vy)>1){b.x = b.x - ((b.y-yMax)+b.r)/b.vy*b.vx}
            b.y = yMax-b.r; 
            b.vx = b.vx*this.bounce;
            b.vy = -b.vy*this.bounce;
        }
    }

}

// class Ball {
//     constructor(vx, vy) {
//         this.vx = vx;
//         this.vy = vy;
//         this.ball = document.querySelector('.ball')
//         this.ballStyle = getComputedStyle(this.ball)
//         this.width = this.ballStyle.width;
//         this.height = this.ballStyle.height;
//         this.x = this.ballStyle.left;
//         this.y = this.ballStyle.top;
//         this.maxSpeed = 40;
//         this.keyframes = [];

//     }
// }

class Ball {
    constructor(x,y,r,vx,vy){
        this.className = 'ball';
        this.x = x;
        this.y = y;
        this.oldx = x;
        this.oldy = y;
        this.r = r;
        this.vx = vx;
        this.vy = vy;
        this.maxSpeed = 40;
	    this.keyframes = [];
        
        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.className = this.className;
        this.elem.style.position = 'absolute';
        this.elem.style.left = -this.r+'px';
        this.elem.style.top = -this.r+'px';
        this.elem.style.width = (2*this.r)+'px';
        this.elem.style.height = (2*this.r)+'px';
        this.elem.style.backgroundColor = 'gray';
        this.elem.style.borderRadius = '50%';
        this.elem.style.transform = 'translate('+this.x+'px,'+this.y+'px)';
 
        //Append DOM-Element
        // table.elem.appendChild(this.elem);
        table.table1.appendChild(this.elem);
    }
}

class Bumper  {
    constructor (className, x, y, r, bounce) {
        this.className1 = className; 
        this.className2 = 'bumper'; 
        this.x = x;
        this.y = y;
        this.r = r;
        this.bounce = bounce;

        // Create DOM-Element
        this.elem = document.createElement('DIV');
        this.elem.className = this.className2 + " " + this.className1;
        this.elem.style.position = 'absolute';
        this.elem.style.left = -this.r+'px';
        this.elem.style.top = -this.r+'px';
        this.elem.style.width = 2*this.r+'px';
        this.elem.style.height = 2*this.r+'px';
        this.elem.style.backgroundColor = 'green';
        this.elem.style.borderRadius = '50%';
        this.elem.style.transform = 'translate('+this.x+'px,'+this.y+'px)';
        
        //Append DOM-Element
        //table.elem.appendChild(this.elem);
        table.table1.appendChild(this.elem);

        console.log(this.elem.className)
    }
    
    detectCollision(b){
        // Circle-Circle Collision
        // Calculate difference between centres
        let dx = b.x - this.x;
        let dy = b.y - this.y;
        // Get squared distance with Pythagoras
        let distSquared = (dx * dx) + (dy * dy);
        return distSquared <= (this.r + b.r) * (this.r + b.r);
    }
    
    reflectCollision(b){
        let dx = b.x - this.x;
        let dy = b.y - this.y;
        let closestx = b.x + (dx / GetLength(dx,dy) * this.r);
        let closesty = b.y + (dy / GetLength(dx,dy) * this.r);
        let normalx = (b.x - closestx) / GetLength(b.x - closestx, b.y - closesty);
        let normaly = (b.y - closesty) / GetLength(b.x - closestx, b.y - closesty);
        let impactSpeed = (-b.vx * normalx + (-b.vy * normaly)) * this.bounce;
        b.vx += normalx * impactSpeed;
        b.vy += normaly * impactSpeed;
    }
}

const table = new Table();
const ball = new Ball(20, 20, 20, 2, 0);
const bumper1 = new Bumper("b4", 100, 100, 45, 2);

const allCollisionObjects = [table];

// Initialize Animation
ball.anim = ball.elem.animate({},{duration: tbf});

// Animation Loop
ball.anim.onfinish = () => {
    let oldx = ball.x; 
    let oldy = ball.y;
    
    ball.vx = Math.min( ball.maxSpeed, ball.vx);
    ball.vy = Math.min( ball.maxSpeed, ball.vy + GRAVITY);
    ball.vx = Math.max(-ball.maxSpeed, ball.vx);
    ball.vy = Math.max(-ball.maxSpeed, ball.vy);

	ball.keyframes = [{transform: `translate(${oldx}px, ${oldy}px)`},{transform: `translate(${ball.x}px, ${ball.y}px)`}];
	ball.anim.effect.setKeyframes(ball.keyframes);
	ball.anim.play();
};

function GetLength(x,y) {return Math.sqrt(x*x+y*y);}


/* Tastaturabfrage */
onkeydown = onkeyup = function(e){
	// left key down => left flipper up
	if ((e.keyCode=="65")&&(e.type=='keydown'))  {
        console.log ("flipper left up");
        flipperLeft.classList.add("triggered");
    } else
	// left key up => left flipper down
	if ((e.keyCode=="65")&&(e.type=='keyup'))  {
        console.log ("flipper left down");
        flipperLeft.classList.remove("triggered");
    } else
    // right key down => right flipper up
    if ((e.keyCode=="68")&&(e.type=='keydown')) {
        console.log ("flipper right up");
        flipperRight.classList.add("triggered");
    } else
    // right key up => right flipper down 
    if ((e.keyCode=="68")&&(e.type=='keyup')) {
        console.log ("right flipper down");
        flipperRight.classList.remove("triggered");
    } else
    // space
	if ((e.keyCode=="32")&&(e.type=='keydown'))  {
		console.log ("Tilt (Space)");
    } else
    // w
	if ((e.keyCode=="87")&&(e.type=='keydown'))  {
        console.log ("w down");
        movePlayfield += 100;
        playfield.style.transform = "translate(50%, " + movePlayfield + "px)";
    } else
    // s
	if ((e.keyCode=="83")&&(e.type=='keydown'))  {
        console.log ("s down");
        movePlayfield -= 100;
        playfield.style.transform = "translate(50%, " + movePlayfield + "px)";
    }   
}