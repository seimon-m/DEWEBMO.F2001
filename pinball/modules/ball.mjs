import { Circle } from './collisionShapes/circle.mjs';

export class Ball {
    constructor(pos, r, tableObj, game){
        this.className = 'ball';
        this.newpos = pos;
        this.bounce = 0.3;
        this.r = r;
        this.gravityOn = true;
        this.velocity = new Victor(0, 0);
        this.gravity = new Victor(0, 0.05);
        this.table = tableObj;
        this.game = game;
        
        
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
        this.table.appendChild(this.elem);

        this.circle = new Circle(pos, r, this.bounce, this.elem);

        // Initialize Animation
        this.ms = 8;
        this.animation = this.elem.animate({},{duration: this.ms});
        this.keyframes = [];

        // Animation Loop
        window.setInterval(this.updatePhysics.bind(this), this.ms)
    }

    reflect(collisionPoint, normal, bounce) {
        // Formel: r = d - 2 * (d * n) * n
        const dotP = this.velocity.clone().dot(normal);
        const rightSide = normal.clone().multiplyScalar(2 * dotP);
        let reflect = this.velocity.subtract(rightSide);

        const variance = Math.random() / 50 + 1; // 0 - 2% random Effekt
        this.velocity = reflect.multiplyScalar(this.bounce * bounce * variance);

        // Neue Position
        this.newpos = collisionPoint.add(this.velocity);
        this.circle.collisionShape.pos = this.newpos;
    }

    applyForce(forceVector) {
        this.velocity.add(forceVector);
    }

    updatePhysics() {

        // Abbruch prüfen
        if(this.newpos.y > 2000) {
            console.log("Started new Game");
            this.game.checkLives(this);
        }

        // Neue Position
        if(this.gravityOn) {
            this.velocity = this.velocity.add(this.gravity);
        }
        this.newpos = this.circle.pos.clone().add(this.velocity);
        this.circle.collisionShape.pos = this.newpos;

        // Notify Collision Detection
        this.circle.collisionShape.hasMoved();
        this.animate();

        // After animation, set pos to new
        this.circle.pos = this.newpos;
    }

    animate() {
        this.keyframes = [
            {transform: `translate3d(${this.circle.pos.x}px, ${this.circle.pos.y}px, 0)`},
            {transform: `translate3d(${this.newpos.x}px, ${this.newpos.y}px, 0)`}];
        this.animation.effect.setKeyframes(this.keyframes);
        this.animation.play();
    }

    setPos(pos) {
        this.newpos = pos;
        this.circle.pos = pos;
    }

    getPos() {
        return this.circle.pos;
    }

    getCollisionShape() {
        return this.circle.getCollisionShape();
    }
}