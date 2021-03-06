'use strict'
import Bumper from './modules/bumper.mjs';
import { Ball } from './modules/ball.mjs';
import { CollisionDetection } from './collisionDetection.mjs';
import { Circle } from './modules/collisionShapes/circle.mjs';
import { LeftFlipper } from './modules/flipper.mjs';
import { RightFlipper } from './modules/flipper.mjs';
import { Line } from './modules/line.mjs';
import { StarterLine } from './modules/starterline.mjs';
import { StartStopGame } from './modules/startStopGame.mjs';
import { Score } from './modules/score.mjs';

// Setup attributes
let lives = 2;
const table = document.querySelector('.table');
const playfield = document.querySelector('.playfield');
let scrollDepth = 150; // Max Autoscrolling tiefe
let movePlayfield = 0;
document.addEventListener("down", onkeydown, false);
document.addEventListener("up", onkeyup, false);
let score = new Score(table);
Howler.volume(0.1);

window.addEventListener("load", setup);


function setup() {
    const collisonDetection = new CollisionDetection();
    const game = new StartStopGame(lives, score);

    // Setup Ball and Collision Detection and Reflection
    let ball = new Ball(new Victor(1030, 600), 20, table, game);
    ball.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        object.handleBallCollision(ball, collisionPoint, normal);
        // Update Score
        if (object instanceof Circle) {
            const points = ball.velocity.clone().length()
            score.updateScore(Math.round(points));
            console.log(score.getScore());
        }
    });
    collisonDetection.addDynamicObject(ball);

    // Setup Flippers
    const leftFlipper = new LeftFlipper(table, new Victor(372, 1565));
    leftFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        if(leftFlipper.isKicking) {
            ball.applyForce(normal.multiplyScalar(25))
        }
    });
    collisonDetection.addStaticObject(leftFlipper);

    const rightFlipper = new RightFlipper(table, new Victor(528, 1565));
    rightFlipper.getCollisionShape().addCollisionListener((object, collisionPoint, normal) => {
        if(rightFlipper.isKicking) {
            ball.applyForce(normal.multiplyScalar(25))
        }
    });
    collisonDetection.addStaticObject(rightFlipper);


    /* Elementerzeugung */

    // Bumper
    const bumper1 = new Bumper('.b1', 4);
    const bumper2 = new Bumper('.b2', 5);
    const bumper3 = new Bumper('.b3', 4);
    const bumper4 = new Bumper('.b4', 2);
    const bumper5 = new Bumper('.b5', 2);
    const bumper6 = new Bumper('.b6', 2);
    const bumper7 = new Bumper('.b7', 6);
    const bumper8 = new Bumper('.b8', 4);
    const bumper9 = new Bumper('.b9', 5);

    // Wände
    const wall1 = new Line('.w1', 2);
    const wall2 = new Line('.w2', 2);
    const wall3 = new Line('.w3', 2);
    const wall4 = new Line('.w4', 2);
    const wall5 = new Line('.w5', 2);
    const wall6 = new Line('.w6', 2);
    const wall7 = new Line('.w7', 3);
    const starter = new StarterLine('.start', 20);

    // Stern
    const s1 = new Line('.s1', 10);
    const s2 = new Line('.s1', 10);
    const s3 = new Line('.s1', 10);
    const s4 = new Line('.s1', 10);
    const s5 = new Line('.s1', 10);
    const s6 = new Line('.s1', 10);
    const s7 = new Line('.s1', 10);
    const s8 = new Line('.s1', 10);
    const s9 = new Line('.s1', 10);
    const s10 = new Line('.s1',10);

    // Linien
    const l1 = new Line('.l1', 3);
    const l2 = new Line('.l2', 3);

    const allCollisionObjects = [bumper1, bumper2, bumper3, bumper4, bumper5, bumper6, bumper7, bumper8, bumper9, wall1, wall2, wall3, wall4, wall5, wall6, wall7, starter, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, l1, l2];
    allCollisionObjects.forEach(obj => collisonDetection.addStaticObject(obj));

    // Scrolling
    function scroll() {
        window.scroll({
            top: Math.min(ball.getPos().y - 200, window.innerHeight - scrollDepth),
            // behavior: 'smooth'
        });
        window.requestAnimationFrame(scroll);
    }
    window.requestAnimationFrame(scroll);

    // Background sound
    let sound = new Howl({
        src: ['assets/background.wav'],
        volume: 5,
        loop: true
      });
    sound.play();

    // Start Game
    game.askName();
    game.startGame(ball);
}

// Parallax
let bg = document.getElementsByClassName('bg');
new simpleParallax(bg, {
    scale: 1.2
});

// Fullscreen
const screen = document.querySelector('.screen');
screen.addEventListener("click", function(e) {
    toggleFullScreen();
}, false);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        scrollDepth = 350;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
        scrollDepth = 150;
      }
    }
  }

// /* Tastaturabfrage */
// onkeydown = onkeyup = function(e){
//     // space
// 	if ((e.keyCode=="32")&&(e.type=='keydown'))  {
// 		console.log ("Tilt (Space)");
//     } else
//     // w
// 	if ((e.keyCode=="87")&&(e.type=='keydown'))  {
//         movePlayfield += 100;
//         playfield.style.transform = "translateY(" + movePlayfield + "px)";
//     } else
//     // s
// 	if ((e.keyCode=="83")&&(e.type=='keydown'))  {
//         movePlayfield -= 100;
//         playfield.style.transform = "translateY(" + movePlayfield + "px)";
//     }   
// }