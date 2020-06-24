// Collision Detection by Jonas Wolter

export class CollisionDetection{

    constructor(){
        this._dynamicShapes = [];
        this._kinematicShapes = [];
        this._staticShapes = [];
    }

    addDynamicObject(collidableObj){
        this.addDynamicShape(collidableObj.getCollisionShape());
    }

    addDynamicShape(collisionShape){
        collisionShape.addMoveListener(this.updateDynamic.bind(this));
        this._dynamicShapes.push(collisionShape);
    }

    addStaticObject(collidableObj){ 
        this.addStaticShape(collidableObj.getCollisionShape());
    }

    addStaticShape(collisionShape){
        this._staticShapes.push(collisionShape);
    }

    // does Collision Detection Stuff
    updateDynamic(){
        this._dynamicShapes.forEach((dynamicShape) =>{
            this._staticShapes.forEach((staticShape) => {
                this.detect(dynamicShape, staticShape)
            })
            this._kinematicShapes.forEach((kinematicShape) => {
                this.detect(dynamicShape, kinematicShape)
            })
        })
    }

    // detects Collision between two objects
    detect(dynamicShape, staticShape){

        // check first for Bounding Box Collision
        // only do detail Collision if necessary
        if(this.boundingBoxesCollision(dynamicShape, staticShape)){

            if(dynamicShape instanceof CollisionCircle){
                
                // Circle-Circle Collision
                if(staticShape instanceof CollisionCircle){
                    this.detectCircleCircle(dynamicShape, staticShape);

                // Circle-Line Collision
                }else if(staticShape instanceof CollisionLine){
                    this.detectCircleLine(dynamicShape, staticShape);
                
                 // Circle-ComplexShape Collision
                }else if(staticShape instanceof ComplexCollisionShape){
                    this.detectCircleComplexShape(dynamicShape, staticShape);
                }
            }
        }
    }

    boundingBoxesCollision(dynamicShape, staticShape){
        const bb1 = dynamicShape.getBoundingBox();
        const bb2 = staticShape.getBoundingBox();

        return ( 
            bb1.minX < bb2.maxX && 
            bb1.maxX > bb2.minX && 
            bb1.minY < bb2.maxY && 
            bb1.maxY > bb2.minY );        
    }

    detectCircleComplexShape(dynamicShape, staticShape){

        // staticShape is complex, so iterate over every (simple) collision shape
        staticShape.collisionShapes.forEach((shape) => {
            this.detect(dynamicShape, shape)
        });
    }

    detectCircleCircle(dynamicShape, staticShape){
        const distX = dynamicShape.pos.x - staticShape.pos.x;
        const distY = dynamicShape.pos.y - staticShape.pos.y;
        const distSquared = Math.pow(distX,2) + Math.pow(distY,2);
        const maxRadiusSquared = Math.pow(dynamicShape.radius + staticShape.radius,2);

        if(distSquared < maxRadiusSquared){

            // Normalenvektor (für Reflektion) berechnen
            const normal = dynamicShape.pos.clone().subtract(staticShape.pos).normalize();

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticShape = staticShape.pos;
            const vec = normal.clone().multiplyScalar(staticShape.radius + dynamicShape.radius);
            const collisionPointDynamicShape = staticShape.pos.clone().add(vec);
            
            dynamicShape.hasCollided(staticShape.object, collisionPointDynamicShape, normal);
            staticShape.hasCollided(dynamicShape.object, collisionPointStaticShape, normal);
        }
    }

    detectCircleLine(dynamicShape, staticShape){
        const circle = dynamicShape; 
        const line = staticShape; 

        const p = circle.pos; // Middle Point of Circle
        const g = line.getLineVector(); // Geradenvektor
        const r = line.a; // Geradenpunkt
        
        // Minimalstelle berechnen
        const t = (g.x * (p.x - r.x) + g.y * (p.y - r.y)) / (g.x*g.x + g.y*g.y); 

        // Punkt auf Linie ausrechnen
        const nearestPoint = new Victor(r.x + t * g.x, r.y + t * g.y);

        const connectionVector = p.clone().subtract(nearestPoint);
        const distSquared = Math.pow(connectionVector.length(), 2)
        const maxRadiusSquared = Math.pow(circle.radius,2)

        // Handelt es sich effektiv um Kollision?
        if(distSquared < maxRadiusSquared){

            // Normalenvektor (für Reflektion) berechnen
            const normal = connectionVector.normalize();

            // Collisionspunkte für beide Objekte berechnen
            const collisionPointStaticShape = nearestPoint;
            const vec = normal.clone().multiplyScalar(circle.radius);
            const collisionPointDynamicShape = nearestPoint.clone().add(vec);

            // Notify Listeners
            dynamicShape.hasCollided(staticShape.object, collisionPointDynamicShape, normal);
            staticShape.hasCollided(dynamicShape.object, collisionPointStaticShape, normal);    
        }
    }
}

export class CollisionShape{

    constructor(object){
        this.object = object;
        this._collisionListeners = [];
        this._moveListeners = [];
    }

    addMoveListener(callback){
        this._moveListeners.push(callback);
    }

    notifyMoveListeners(){
        this._moveListeners.forEach(callback => callback());
    }

    hasMoved(){
        this.notifyMoveListeners();
    }
    
    addCollisionListener(callback){
        this._collisionListeners.push(callback);
    }

    notifyCollisionListeners(otherObject, collisionPoint, normal){
        this._collisionListeners.forEach(callback => callback(otherObject, collisionPoint, normal));
    }

    hasCollided(otherObject, collisionPoint, normal){
        this.notifyCollisionListeners(otherObject, collisionPoint, normal);
    }
}

export class CollisionCircle extends CollisionShape{
    
    constructor(object, radius, pos){
        super(object);
        this.radius = radius;
        this.pos = pos;
    }

    getBoundingBox() {
        const minX = this.pos.x - this.radius;
        const maxX = this.pos.x + this.radius;
        const minY = this.pos.y - this.radius;
        const maxY = this.pos.y + this.radius;
        return new BoundingBox(minX, maxX, minY, maxY);
    }
}

export class CollisionLine extends CollisionShape{
    
    constructor(object, a, b){
        super(object);
        this.a = a;
        this.b = b;
    }

    getBoundingBox() {
        const minX = Math.min(this.a.x, this.b.x);
        const maxX = Math.max(this.a.x, this.b.x);
        const minY = Math.min(this.a.y, this.b.y);
        const maxY = Math.max(this.a.y, this.b.y);
        return new BoundingBox(minX, maxX, minY, maxY);
    }

    getLineVector(){
        return this.b.clone().subtract(this.a);
    }
}

export class ComplexCollisionShape extends CollisionShape{
    
    constructor(object, collisionShapes){
        super(object);
        this.collisionShapes = collisionShapes;

        this.updateBoundingBox();
    }

    getBoundingBox(){
        return this._boundingBox;
    }

    hasMoved(){
        super.hasMoved();
        this.updateBoundingBox();
    }

    updateBoundingBox(){
        const boundingBoxes = this.collisionShapes.map(shape => shape.getBoundingBox());
        const minX = Math.min(...boundingBoxes.map(bb => bb.minX));
        const maxX = Math.max(...boundingBoxes.map(bb => bb.maxX));
        const minY = Math.min(...boundingBoxes.map(bb => bb.minY));
        const maxY = Math.max(...boundingBoxes.map(bb => bb.maxY));
        this._boundingBox = new BoundingBox(minX, maxX, minY, maxY);
    }
}

export class BoundingBox {
    constructor(minX, maxX, minY, maxY){
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }
}
