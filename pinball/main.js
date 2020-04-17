'use strict'

document.addEventListener("down", onkeydown, false);
document.addEventListener("up", onkeyup, false);
const flipperLeft = document.querySelector('.flipper-left');
const flipperRight = document.querySelector('.flipper-right');

onkeydown = onkeyup = function(e){
	// left key down => left flipper up
	if ((e.keyCode=="37")&&(e.type=='keydown'))  {
        console.log ("flipper left up");
        flipperLeft.classList.add("triggered");
    } else
	// left key up => left flipper down
	if ((e.keyCode=="37")&&(e.type=='keyup'))  {
        console.log ("flipper left down");
        flipperLeft.classList.remove("triggered");
    } else
    // right key down => right flipper up
    if ((e.keyCode=="39")&&(e.type=='keydown')) {
        console.log ("flipper right up");
        flipperRight.classList.add("triggered");
    } else
    // right key up => right flipper down 
    if ((e.keyCode=="39")&&(e.type=='keyup')) {
        console.log ("right flipper down");
        flipperRight.classList.remove("triggered");
    } else
    // space
	if ((e.keyCode=="32")&&(e.type=='keydown'))  {
		console.log ("Tilt (Space)");
    }   
}