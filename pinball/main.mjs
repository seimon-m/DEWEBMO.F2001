'use strict'
import Table from './modules/table.mjs';
import Bumper from './modules/bumper.mjs';
import { Ball } from './modules/ball.mjs';
//import Wall from './modules/wall.mjs';
import { CollisionDetection } from './collisionDetection.mjs';
import { Circle } from './modules/collisionShapes/circle.mjs';
import { LeftFlipper } from './modules/flipper.mjs';
import { RightFlipper } from './modules/flipper.mjs';
import { FlipperLine } from './modules/flipperLine.mjs';
import { Line } from './modules/line.mjs';
import { StartStopGame } from './modules/startStopGame.mjs';

// Setup attributes
let lives = 2;
const table = new Table(1);
const playfield = document.querySelector('.playfield');
let movePlayfield = 0;
document.addEventListener("down", onkeydown, false);
document.addEventListener("up", onkeyup, false);


setup();


function setup() {
    const collisonDetection = new CollisionDetection();
    const game = new StartStopGame(lives);

    // Setup Ball and Collision Detection and Reflection
    let ball = new Ball(new Victor(1030, 600), 20, table, game);
    ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        object.handleBallCollision(ball, collisionPoint, normal);
        if (object instanceof Circle) {
            const points = Math.min(Math.ceil(ball.velocity.length() * 0.2), 5);
            // Score
        }
    });
    collisonDetection.addDynamicObject(ball);

    // Setup Flippers
    const leftFlipper = new LeftFlipper(table, new Victor(355, 1560));
    leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        if(leftFlipper.isKicking) {
            ball.applyForce(normal.multiplyScalar(25))
        }
    });
    collisonDetection.addStaticObject(leftFlipper);

    const rightFlipper = new RightFlipper(table, new Victor(525, 1560));
    rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        if(rightFlipper.isKicking) {
            ball.applyForce(normal.multiplyScalar(25))
        }
    });
    collisonDetection.addStaticObject(rightFlipper);


    // Elementerzeugung
    const bumper1 = new Bumper('.b1', 4);
    const bumper2 = new Bumper('.b2', 2);
    const bumper3 = new Bumper('.b3', 3);
    const wall1 = new Line('.w1', 2);
    const wall2 = new Line('.w2', 2);
    const wall3 = new Line('.w3', 2);
    const wall4 = new Line('.w4', 2);
    const wall5 = new Line('.w5', 2);
    const wall6 = new Line('.w6', 2);
    const wall7 = new Line('.w7', 3);
    const starter = new Line('.start', 20);

    const allCollisionObjects = [bumper1, bumper2, bumper3, wall1, wall2, wall3, wall4, wall5, wall6, wall7, starter];

    allCollisionObjects.forEach(obj => collisonDetection.addStaticObject(obj));

    // Scrolling
    function scroll() {
        window.scroll({
            top: Math.min(ball.getPos().y - 400, window.innerHeight - 150),
            // behavior: 'smooth'
        });
        window.requestAnimationFrame(scroll);
    }
    window.requestAnimationFrame(scroll);

    // Start Game
    game.startGame(ball);
}

/* Tastaturabfrage */
onkeydown = onkeyup = function(e){
    // space
	if ((e.keyCode=="32")&&(e.type=='keydown'))  {
		console.log ("Tilt (Space)");
    } else
    // w
	if ((e.keyCode=="87")&&(e.type=='keydown'))  {
        console.log ("w down");
        movePlayfield += 100;
        playfield.style.transform = "translateY(" + movePlayfield + "px)";
    } else
    // s
	if ((e.keyCode=="83")&&(e.type=='keydown'))  {
        console.log ("s down");
        movePlayfield -= 100;
        playfield.style.transform = "translateY(" + movePlayfield + "px)";
    }   
}