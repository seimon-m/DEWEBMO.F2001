import {closestPointOnLine} from './helperFunctions.mjs';

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
export default Bumper;