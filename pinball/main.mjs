'use strict'
import Table from './modules/table.mjs';
import Bumper from './modules/bumper.mjs';
import Ball from './modules/ball.mjs';
import Wall from './modules/wall.mjs';

// Setup 
document.addEventListener("down", onkeydown, false);
document.addEventListener("up", onkeyup, false);
const flipperLeft = document.querySelector('.flipper-left');
const flipperRight = document.querySelector('.flipper-right');
const playfield = document.querySelector('.playfield');
const screen = document.querySelector('.screen');
let movePlayfield = 0;
const fps = 10; // Frames per Second
const tbf = 1000/fps; // Time Between 2 Frames
const GRAVITY = 0.8;

// Elementerzeugung
const table = new Table(1);
const ball = new Ball(50, 50, 20, 2, 0, table);
const bumper1 = new Bumper('.b1', 4);
const bumper2 = new Bumper('.b2', 2);
const bumper3 = new Bumper('.b3', 3);
const wall1 = new Wall('.w1', 2);
const wall2 = new Wall('.w2', 2);

const allCollisionObjects = [table, bumper1, bumper2, bumper3, wall1, wall2];

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

    console.log("b.x: " + ball.x)
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