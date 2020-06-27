import {CollisionCircle} from '../../collisionDetection.mjs'

export class Circle {
    constructor(pos, r, bounce, elem) {
        this.pos = pos;
        this.r = r;
        this.bounce = bounce;
        this.elem = elem;
        this.collisionShape = new CollisionCircle(this, this.r, this.pos);

        this.sound = new Howl({
            src: ['assets/bumper.wav'],
            volume: 0.5
        });
    }

    setPos(pos) {
        this.pos = pos;
        this.collisionShape.pos = pos;
        this.elem.style.transform = 'translate(' + this.pos.x + 'px,' + this.pos.y + 'px)';
    }

    getCollisionShape() {
        return this.collisionShape;
    }

    handleBallCollision(ball, collisionPoint, normal) {
        ball.reflect(collisionPoint, normal, this.bounce);
        this.sound.play();
    }
}