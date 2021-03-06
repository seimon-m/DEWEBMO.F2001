import { Circle } from './collisionShapes/circle.mjs'

class Bumper {
    constructor(className, bounce) {
        this.bounce = bounce;
        this.bumper = document.querySelector(className);
        this.readStyle = getComputedStyle(this.bumper)
        this.width = parseInt(this.readStyle.width, 10);
        this.height = parseInt(this.readStyle.height, 10);
        this.r = this.width / 2;
        this.x = parseInt(this.readStyle.left, 10) + this.r;
        this.y = parseInt(this.readStyle.top, 10) + this.r;

        this.circle = new Circle(new Victor(this.x, this.y), this.r, bounce, this.bumper);
    }

    setCollisionShapeRadius(radius) {
        this.circle.getCollisionShape().radius = radius;
    }   

    setPos(pos) {
        this.pos = pos;
        this.collisionShape.pos = pos;
        this.bumper.style.transform = 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)';
    }

    getCollisionShape() {
        return this.circle.getCollisionShape();
    }
}
export default Bumper;