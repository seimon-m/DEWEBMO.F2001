import { CollisionLine } from "../collisionDetection.mjs";

export class FlipperLine {
    constructor(tableObj, a, b, cssClass) {
        this.collisionShape = new CollisionLine(this, a, b);
        this.bounce = 1.5;

        // Create DOM-Element
        this.line = document.createElement('DIV');
        this.line.style.position = 'absolute';
        this.setCoordinates(a, b);
        this.line.classList.add('line');
        this.line.classList.add(cssClass);
        this.line.style.transformOrigin = '0% 50%';

        //Append DOM-Element
        tableObj.appendChild(this.line);
    }


    setCoordinates(a, b) {
        this.a = a;
        this.b = b;

        // Transformation
        const vec = b.clone().subtract(a);
        const angle = vec.horizontalAngleDeg();

        // Effektiv gezeichnete Linie um 1.5 rechts/links verkürzen -> führt zu schöneren Linienecken
        const offsetLineVec = vec.clone().normalize().multiplyScalar(1.5)
        const newLineA = this.a.clone().add(offsetLineVec);
        this.line.style.transform = 'translate('+newLineA.x + 'px,'+newLineA.y +'px)' + ' rotate('+angle+'deg)';
        this.line.style.width = vec.length()-3 + 'px';

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
        let sound = new Howl({
            src: ['assets/flipper.wav'],
            volume: 0.5
          });
        sound.play();
    }

    getLineVector() {
        return this.b.clone().subtract(this.a);
    }
}

