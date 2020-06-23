'use strict'
import Table from './modules/table.mjs';
import Bumper from './modules/bumper.mjs';
import { Ball } from './modules/ball.mjs';
//import Wall from './modules/wall.mjs';
import { CollisionDetection } from './collisionDetection.mjs';
import { Circle } from './modules/collisionShapes/circle.mjs';
import { LeftFlipper } from './modules/flipper.mjs';
import { RightFlipper } from './modules/flipper.mjs';
import { Line } from './modules/line.mjs';

// Setup attributes
let lives = 4;
const table = new Table(1);


setup();

function startGame(ball) {
    ball.velocity = new Victor(0.5, -0.1);
}

function setup() {
    document.addEventListener("down", onkeydown, false);
    document.addEventListener("up", onkeyup, false);
    const playfield = document.querySelector('.playfield');
    const screen = document.querySelector('.screen');
    let movePlayfield = 0;
    const collisonDetection = new CollisionDetection();

    


    // Setup Ball and Collision Detection and Reflection
    let ball = new Ball(new Victor(50, 50), 20, table);
    ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        object.handleBallCollision(ball, collisionPoint, normal);
        if (object instanceof Circle) {
            const points = Math.min(Math.ceil(ball.velocity.length() * 0.2), 5);
            // Score
        }
    });
    collisonDetection.addDynamicObject(ball);

    //Autoscroll

    // Setup Flippers
    const leftFlipper = new LeftFlipper(table, new Victor(120, 500));
    leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        if(leftFlipper.isKicking) {
            ball.applyForce(normal.multiplyScalar(25))
        }
    });
    collisonDetection.addStaticObject(leftFlipper);

    const rightFlipper = new RightFlipper(table, new Victor(240, 500));
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
    // const wall1 = new Wall('.w1', 2);
    // const wall2 = new Wall('.w2', 2);
    const line1 = new Line(table, new Victor(150, 230), new Victor(250, 200), 'l1');

    const allCollisionObjects = [bumper1, bumper2, bumper3, line1];

    allCollisionObjects.forEach(obj => collisonDetection.addStaticObject(obj));

    

    // Blink
    startGame(ball);
}


function openDoor(){
    const b = door.a.clone().add(door.getLineVector().multiplyScalar(0.63))
    door.setCoordinates(door.a, b)
}

function closeDoor(){
    door.setCoordinates(door.a, new Victor(1200, 1200))
}



/* Tastaturabfrage */
// onkeydown = onkeyup = function(e){
//     // space
// 	if ((e.keyCode=="32")&&(e.type=='keydown'))  {
// 		console.log ("Tilt (Space)");
//     } else
//     // w
// 	if ((e.keyCode=="87")&&(e.type=='keydown'))  {
//         console.log ("w down");
//         movePlayfield -= 100;
//         playfield.style.transform = "translateY(" + movePlayfield + "px)";
//     } else
//     // s
// 	if ((e.keyCode=="83")&&(e.type=='keydown'))  {
//         console.log ("s down");
//         movePlayfield += 100;
//         playfield.style.transform = "translateY(" + movePlayfield + "px)";
//     }   
// }