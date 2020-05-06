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
const GRAVITY = 0.8;


class Table {
    constructor(bounce) {
        this.bounce = bounce;
        this.table1 = document.querySelector('.table')
        this.readStyle = getComputedStyle(this.table1)
        this.widthString = this.readStyle.width;
        this.heightString = this.readStyle.height;
        this.width = parseInt(this.widthString, 10);
        this.height = parseInt(this.heightString, 10);
        this.left = parseInt(this.readStyle.left, 10);
        this.top = parseInt(this.readStyle.top, 10);
    }

    detectCollision(b){
        return ((b.x-b.r<this.left) || (b.x+b.r>this.width) || (b.y-b.r<this.top) || (b.y+b.r>this.height));
    }
    
    reflectCollision(b){
        let xMin = this.left;
        let xMax = this.width;
        let yMin = this.top;
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
        this.maxSpeed = 25;
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

class Bumper {
    constructor(className, bounce) {
        this.bounce = bounce;
        this.bumber = document.querySelector(className);
        this.readStyle = getComputedStyle(this.bumber)
        this.width = parseInt(this.readStyle.width, 10);
        this.height = parseInt(this.readStyle.height, 10);
        this.r = this.width / 2;
        this.x = parseInt(this.readStyle.left, 10) + this.r;
        this.y = parseInt(this.readStyle.top, 10) + this.r;
        this.collisionFlag = false;
    }
    
    detectCollision(b){
        let dx = b.x - this.x;
        let dy = b.y - this.y;
        // Get squared distance with Pythagoras
        let distSquared = (dx * dx) + (dy * dy);
        return distSquared <= (this.r + b.r) * (this.r + b.r);
    }
    
    reflectCollision(b){
        // Animation state
        if (!this.collisionFlag) {
            this.bumber.style.animationPlayState = 'running';
            this.collisionFlag = true;
        } else {
            this.bumber.style.animationPlayState = 'paused';
            this.collisionFlag = false;
        }
        
        // Collision reflection
        let d = {x:0,y:0};  // Closest Point
        let c = {x:0,y:0};  // Collision Point
        let n = {x:0,y:0};
        let vnew = {x:0,y:0}; // New Direction
        
        d = closestPointOnLine(b.x, b.y, b.x + b.vx, b.y + b.vy, this.x, this.y); 
        let closestdistsq = Math.pow(this.x - d.x, 2) + Math.pow(this.y - d.y, 2); 
        if (closestdistsq <= Math.pow(b.r + this.r, 2)){ 
            // a collision has occurred
            
            let backdist = Math.sqrt(Math.pow(b.r + this.r, 2) - closestdistsq); 
            let movementvectorlength = Math.sqrt(Math.pow(b.vx, 2) + Math.pow(b.vy, 2)); 

            c.x = d.x - backdist * (b.vx / movementvectorlength); 
            c.y = d.y - backdist * (b.vy / movementvectorlength);
            let collisiondist = Math.sqrt(Math.pow(this.x - c.x, 2) + Math.pow(this.y - c.y, 2)); 
            
            n.x = (this.x - c.x) / collisiondist; 
            n.y = (this.y - c.y) / collisiondist; 
            let p =  (b.vx * n.x + b.vy * n.y) * this.bounce; 
            vnew.x = b.vx - 2 * p * n.x; 
            vnew.y = b.vy - 2 * p * n.y;
            
            b.x = c.x;
            b.y = c.y;
            b.vx = vnew.x;
            b.vy = vnew.y;
        }
    }
}

const table = new Table(1);
const ball = new Ball(50, 50, 20, 2, 0);
const bumper1 = new Bumper('.b1', 4);
const bumper2 = new Bumper('.b2', 2);
const bumper3 = new Bumper('.b3', 3);

const allCollisionObjects = [table, bumper1, bumper2, bumper3];

// Initialize Animation
ball.anim = ball.elem.animate({},{duration: tbf});

// Animation Loop
ball.anim.onfinish = () => {
    let oldx = ball.x; 
    let oldy = ball.y;

    ball.x+=ball.vx; 
    ball.y+=ball.vy;
    
    for (let i = 0, len = allCollisionObjects.length; i < len; i++) {
        let obj = allCollisionObjects[i];
        if (obj.detectCollision(ball)) {
            obj.reflectCollision(ball);
        }
    }

    ball.vx = Math.min( ball.maxSpeed, ball.vx);
    ball.vy = Math.min( ball.maxSpeed, ball.vy + GRAVITY);
    ball.vx = Math.max(-ball.maxSpeed, ball.vx);
    ball.vy = Math.max(-ball.maxSpeed, ball.vy);

	ball.keyframes = [
        {transform: `translate(${oldx}px, ${oldy}px)`},
        {transform: `translate(${ball.x}px, ${ball.y}px)`}
    ];
	ball.anim.effect.setKeyframes(ball.keyframes);
	ball.anim.play();
};

/* Hilfsfunktionen */

function GetLength(x,y) {return Math.sqrt(x*x+y*y);}

const closestPointOnLine = (lx1, ly1, lx2, ly2, x0, y0) => { 
    let A1 = ly2 - ly1; 
    let B1 = lx1 - lx2; 
    let C1 = (ly2 - ly1)*lx1 + (lx1 - lx2)*ly1; 
    let C2 = -B1*x0 + A1*y0; 
    let det = A1*A1 - (-B1)*B1; 
    let cx = 0; 
    let cy = 0; 
    if(det !== 0){ 
       cx = ((A1*C1 - B1*C2)/det); 
       cy = ((A1*C2 - (-B1)*C1)/det); 
    }else{ 
       cx = x0; 
       cy = y0; 
    } 
    return {x:cx, y:cy}; 
};


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
        movePlayfield -= 100;
        playfield.style.transform = "translateY(" + movePlayfield + "px)";
    } else
    // s
	if ((e.keyCode=="83")&&(e.type=='keydown'))  {
        console.log ("s down");
        movePlayfield += 100;
        playfield.style.transform = "translateY(" + movePlayfield + "px)";
    }   
}