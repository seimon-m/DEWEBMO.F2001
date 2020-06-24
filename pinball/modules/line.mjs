import { CollisionLine } from "../collisionDetection.mjs";

export class Line {
    constructor(className, bounce) {
        this.bounce = bounce;
        this.wall = document.querySelector(className);
        this.style = getComputedStyle(this.wall);
        this.width = parseInt(this.style.width, 10);
        this.height = parseInt(this.style.height, 10);
        this.left = parseInt(this.style.left, 10);
        this.top = parseInt(this.style.top, 10);
        this.transform = this.style.transform;
        this.rotateRad = this.transform.split("(")[1];
        this.rotateRad = this.rotateRad.split(")")[0];
        this.rotateRad = this.rotateRad.split(",");
        this.rotateZ = Math.round(
            Math.atan2(this.rotateRad[1], this.rotateRad[0]) * (180 / Math.PI)
        );

        this.p1 = new Victor(this.left, this.top);
        this.p2 = new Victor(this.left + this.width, this.top);
        this.p1p2 = this.p2.clone().subtract(this.p1);
        this.p1p2 = this.p1p2.clone().rotateByDeg(this.rotateZ);
        this.p2 = this.p1.clone().add(this.p1p2);

        this.collisionShape = new CollisionLine(this, this.p1, this.p2);
        this.setCoordinates(this.p1, this.p2);
    }


    setCoordinates(a, b) {

        console.log(a)
        console.log(b)
        this.a = a;
        this.b = b;

        // Transformation
        const vec = b.clone().subtract(a);
        const angle = vec.horizontalAngleDeg();

        // Collision Shape Line um 3 rechts/links verkürzen -> weniger Ecken Probleme
        const offsetVec = vec.normalize().multiplyScalar(5);
        const newA = this.a.clone().add(offsetVec);
        const newB = this.b.clone().subtract(offsetVec);

        this.collisionShape.a = newA;
        this.collisionShape.b = newB;

        this.collisionShape.hasMoved();
    }

    getCollisionShape() {
        return this.collisionShape;
    }

    setBackground(backgroundString) {
        this.line.background = backgroundString;
    }

    setName(name) {
        this.collisionShape.name = name;
    }

    handleBallCollision(ball, collisionPoint, normal) {
        ball.reflect(collisionPoint, normal, this.bounce);
    }

    getLineVector() {
        return this.b.clone().subtract(this.a);
    }
}

