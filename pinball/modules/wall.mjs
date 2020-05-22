


class Wall {
    constructor(className, bounce) {
        this.bounce = bounce;
        this.wall = document.querySelector(className);
        this.style = getComputedStyle(this.wall)
        this.width = parseInt(this.style.width, 10);
        this.height = parseInt(this.style.height, 10);
        this.left = parseInt(this.style.left, 10);
        this.top = parseInt(this.style.top, 10);
        this.transform = this.style.transform;
        this.rotateRad = this.transform.split('(')[1];
        this.rotateRad = this.rotateRad.split(')')[0];
        this.rotateRad = this.rotateRad.split(',');
        this.rotateZ = Math.round(Math.atan2(this.rotateRad[1], this.rotateRad[0]) * (180 / Math.PI));
    

        // PreCalculations for Collision
        // this.p1 = [this.left, this.top];
        // this.p2 = [this.left+this.width,this.top];
        // this.p2 = vec.rotatePointAround(deg2rad(this.rotateZ),this.p1,this.p2); 
        // this.p1p2 = vec.sub(this.p2,this.p1);
        // console.log("P1: " + this.p1);
        // console.log("P2: " + this.p2);
        // console.log("P1P2: " + this.p1p2);
        // console.log("Width: " + this.width);

        this.p1 = new Victor(this.left, this.top);
        this.p2 = new Victor((this.left + this.width), this.top);
        this.p1p2 = this.p1.clone().subtract(this.p2);
        this.p1p2 = this.p1p2.clone().rotateByDeg(this.rotateZ);
        this.p2 = this.p1.clone().add(this.p1p2);
        console.log("P1a: " + this.p1.clone().toString());
        console.log("P2a: " + this.p2.clone().toString());
        console.log("P1P2a: " + this.p1p2.clone().toString());
        console.log("Width: " + this.width);
        
        
 }
 
 detectCollision(b){
    //  let ballCenter = [b.x,b.y];
     let ballcenter = new Victor(b.x, b.y);
    //  let p1_ballCenter = vec.sub(ballCenter,this.p1);
     let p1_ballCenter = ballcenter.subtract(this.p1);
     
     
     // length of projection of p1_ballCenter onto p1p2
    //  let a = vec.dot(this.p1p2, this.p1p2);
    let a = this.p1p2.clone().multiply(this.p1p2);
    //  let t = vec.dot(this.p1p2, p1_ballCenter)/a; 
    let t = this.p1p2.clone().multiply(p1_ballCenter) / a;
     
     if ((t >= 0) && (t <= 1)) {
        //  let c = vec.dot(p1_ballCenter, p1_ballCenter);
        let c = ballCenter.clone().multiply(ballcenter);
         let r2 = c - a * t * t;
         return (r2 <= b.r*b.r); // true if collides
     }
 }

 
 reflectCollision(b){
     let ballCenter = [b.x,b.y];
     let p1_ballCenter = vec.sub(ballCenter,this.p1);

     // length of projection of p1_ballCenter onto p1p2
     let a = vec.dot(this.p1p2, this.p1p2);
     let t = vec.dot(p1_ballCenter,this.p1p2)/a;        
     
     let closest = vec.add(this.p1, vec.scale(t,this.p1p2));
     let normal = vec.norm(vec.sub(ballCenter, closest));

     // recalculate ball position, passed line overlap.
     ballCenter = vec.add(closest, vec.scale(b.r,normal)); 
     b.x = ballCenter[0];
     b.y = ballCenter[1];

     // recalculate speed and direction
     let impactSpeed =  (-b.vx * normal[0] + (-b.vy * normal[1])) * 2* this.bounce;
     b.vx += normal[0] * impactSpeed;
     b.vy += normal[1] * impactSpeed;
 }
}

// Degrees 2 Rad conversion
const deg2rad = (degrees) => {return degrees * (Math.PI/180)};

// curry :: (a -> b -> ... -> n) -> (a -> b) -> (b -> ...) -> (... -> n)
const curry = fn => {
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
const vNorm = v => {
  const mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

// vMag :: Vector -> Number
const vMag = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);

// vRotatePointAround :: Number -> Vector -> Vector -> Vector
const vRotatePointAround = curry((a, p1, p2) => {
  const v2 = vSub(p2, p1);
  return vAdd(p1, [
    v2[0] * Math.cos(a) - v2[1] * Math.sin(a),
    v2[0] * Math.sin(a) + v2[1] * Math.cos(a)
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