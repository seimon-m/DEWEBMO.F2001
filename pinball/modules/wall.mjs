class Wall {
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
        console.log("P1a: " + this.p1.clone().toString());
        console.log("P2a: " + this.p2.clone().toString());
        console.log("P1P2a: " + this.p1p2.clone().toString());
        console.log("Width: " + this.width);
    }

    detectCollision(b) {
        const p = new Victor(b.x, b.y); // Middle Point of Circle
        const g = this.p1p2.clone(); // Geradenvektor
        const r = this.p1.clone(); // Geradenpunkt

        // Minimalstelle berechnen
        const t = (g.x * (p.x - r.x) + g.y * (p.y - r.y)) / (g.x * g.x + g.y * g.y);
        // Punkt auf Linie ausrechnen
        const nearestPoint = new Victor(r.x + t * g.x, r.y + t * g.y);
        const connectionVector = p.clone().subtract(nearestPoint);
        const distSquared = Math.pow(connectionVector.length(), 2);
        const maxRadiusSquared = Math.pow(b.r, 2);
        // Handelt es sich effektiv um Kollision?
        if (distSquared < maxRadiusSquared) {
            console.log(
                "CollisionDetection -> collideCircleLine -> connectionVector",
                connectionVector
            );
            return true;

            // Normalenvektor (für Reflektion) berechnen
            const normal = connectionVector.normalize();
            console.log('CollisionDetection -> collideCircleLine -> normal', normal)

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticShape = nearestPoint;
            const vec = normal.clone().multiplyScalar(circle.radius);
            const collisionPointDynamicShape = nearestPoint.clone().add(vec);
            // Notify Listeners
            dynamicShape.hasCollided(staticShape, collisionPointDynamicShape, normal);
            staticShape.hasCollided(dynamicShape, collisionPointStaticShape, normal);
        }
    }

    reflectCollision(b) {
        console.log("detect wall 2");

        let ballCenter = new Victor(b.x, b.y);
        //console.log(ballCenter);
        let p1_ballCenter = ballCenter.clone().subtract(this.p1);
        //console.log(p1_ballCenter);
        
        // length of projection of p1_ballCenter onto p1p2
        let a = this.p1p2.clone().dot(this.p1p2);
        //let a = vec.dot(this.p1p2, this.p1p2);
        let t = p1_ballCenter.clone().dot(this.p1p2) / a;
        //let t = vec.dot(p1_ballCenter, this.p1p2) / a;

        let multiplicator1 = new Victor(t, t);
        let scale = this.p1p2.clone().multiply(multiplicator1);
        let closest = this.p1.clone().add(scale);
        //let closest = vec.add(this.p1, vec.scale(t, this.p1p2));
        let b_closest = ballCenter.clone().subtract(closest);
        let normal = b_closest.normalize();
        //let normal = vec.norm(vec.sub(ballCenter, closest));

        // recalculate ball position, passed line overlap.
        let multiplicator2 = new Victor(b.r, b.r);
        ballCenter = closest.clone().add(normal.clone().multiply(multiplicator2));
        //ballCenter = vec.add(closest, vec.scale(b.r, normal));
        console.log(normal);
        b.x = ballCenter.x;
        b.y = ballCenter.y;

        // recalculate speed and direction
        let impactSpeed = (-b.vx * normal.x + -b.vy * normal.y) * 2 * this.bounce;
        b.vx += normal.x * impactSpeed;
        b.vy += normal.y * impactSpeed;
        console.log("vx: " + b.vx);
        console.log("vy: " + b.vy);
    }
}

// Degrees 2 Rad conversion
const deg2rad = (degrees) => {
    return degrees * (Math.PI / 180);
};

// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
const curry = (fn) => {
    const curried = (...args) => {
        if (args.length >= fn.length) {
            return fn(...args);
        }
        return (...argsNext) => curried(...args, ...argsNext);
    };
    return curried;
};

//===========================================================
// Some Vector Functions (from vec-la vector library)
//===========================================================

// vAdd :: Vector -> Vector -> Vector
const vAdd = curry((v, v2) => [v[0] + v2[0], v[1] + v2[1]]);

// vSub :: Vector -> Vector -> Vector
const vSub = curry((v, v2) => [v[0] - v2[0], v[1] - v2[1]]);

// vScale :: Number -> Vector
const vScale = curry((sc, v) => [v[0] * sc, v[1] * sc]);

// vDot :: Vector -> Vector -> Number
const vDot = curry((v, v2) => v[0] * v2[0] + v[1] * v2[1]);

// vNorm :: Vector -> Vector
const vNorm = (v) => {
    const mag = vMag(v);
    return [v[0] / mag, v[1] / mag];
};

// vMag :: Vector -> Number
const vMag = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
const vRotatePointAround = curry((a, p1, p2) => {
    const v2 = vSub(p2, p1);
    return vAdd(p1, [
        v2[0] * Math.cos(a) - v2[1] * Math.sin(a),
        v2[0] * Math.sin(a) + v2[1] * Math.cos(a),
    ]);
});

let vec = {
    add: vAdd,
    sub: vSub,
    scale: vScale,
    dot: vDot,
    mag: vMag,
    norm: vNorm,
    rotatePointAround: vRotatePointAround,
};

export default Wall;
