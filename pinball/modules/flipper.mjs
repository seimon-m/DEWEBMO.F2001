import { FlipperLine } from './flipperLine.mjs';

export class Flipper{

    constructor(tableObj, assetSrc, cssClass, pos, startAngle, key){


        this._pos = pos;
        this.angle = startAngle;
        this._key = key;
        this._width = 100;

        this._ms = 6;
        this._duration = 60;
        
        this.isKicking = false;
        this._currentTime = 0;

        this._line = new FlipperLine(tableObj, pos, pos, 'invisible');
        this.updateLine();

        this._collisionShape = this._line.getCollisionShape();
        this._collisionShape.bounciness = 0.7;


        // Create DOM-Element
        this.img = document.createElement('IMG');
        this.img.src = assetSrc;
        this.img.alt = 'Flipper';
        this.img.style.width = this._width + 'px';
        this.img.style.height = 'auto';
        this.img.style.position = 'absolute';
        this.img.classList.add(cssClass);
        this.img.style.transform = 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ('+this.angle+'deg)';

        // Append DOM-Element
        tableObj.table1.appendChild(this.img);

        this.initAnimation();


        let isPressed = false;
        document.addEventListener('keydown', event => {
            if(event.keyCode == this._key & !isPressed){ 
                isPressed = true;
                this.up();
            }})
        
        document.addEventListener('keyup', event => {
            if(event.keyCode == this._key & isPressed){ 
                isPressed = false;
                this.down();
            }})
            

    }

    up(){
        this._animation.pause();
        this._animation.reverse();

        this.isKicking = true;
        const updateFunc = setInterval(this.updateAngle.bind(this), this._ms);

        var onAnimFinishFunc = function(){
            this.isKicking = false;
            clearInterval(updateFunc)
            this._currentTime = 0;
            this.updateAngle();
        };
        this._animation.onfinish = onAnimFinishFunc.bind(this);
    }

    down(){

        this._animation.pause();
        this._animation.reverse();

        const updateFunc = setInterval(this.updateAngle.bind(this), this._ms);

        var onAnimFinishFunc = function(){
            clearInterval(updateFunc)
            this._currentTime = 0;
            this.updateAngle();
        };
        this._animation.onfinish = onAnimFinishFunc.bind(this);
    }

    logAnimationState(){
        console.log('Animation State: ' + this._animation.currentTime );
        
    }

    updateAngleUp(){
        //this.angle = (this._currentTime / this._duration) * 42 -32;
        this.angle = (this._animation.currentTime / this._duration) * 42 -32;
        this._currentTime += this._ms;

        this.updateLine();
        
    }

    updateAngleDown(){
        //this.angle = (this._currentTime / this._duration) * -42 + 10;
        this.angle = (this._animation.currentTime / this._duration) * -42 + 10;
        //console.log('Flipper -> updateAngleDown -> this.angle', this.angle)
        this._currentTime += this._ms;

        this.updateLine();
    }

    getCollisionShape(){
        return this._collisionShape;
    }
}

export class RightFlipper extends Flipper{
    constructor(parent, pos){
        super(parent, 'Assets/flipper-right.png', 'flipper-right', pos, -32, 68)
    }

    initAnimation(){
        // Initialize Animation
        this._animation = this.img.animate([   
           {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ(10deg)'},
           {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ(-32deg)'},
       ], 
       {duration: this._duration,  fill: 'both'}); 
   }

   updateAngle(){
        this.angle = (this._animation.currentTime / this._duration) * -42 + 10;
        this.updateLine();
    }


   updateLine(){

        const a =  this._pos.clone().add(new Victor(0, 18));
        const b =  a.clone().add(new Victor(this._width-18, 0));

        const aOffset = new Victor(0, -7).rotateDeg(this.angle);
        const bOffset = new Victor(4, -18).rotateDeg(this.angle);

        const vec = b.clone().subtract(a);
        vec.rotateDeg(this.angle)

        const a2 = b.clone().subtract(vec);

        this._line.setCoordinates(a2.add(aOffset), b.add(bOffset))
    }

}

export class LeftFlipper extends Flipper{
    constructor(parent, pos){
        super(parent, 'Assets/flipper-left.png', 'flipper-left', pos, 32, 65)
    }

    initAnimation(){
        // Initialize Animation
        this._animation = this.img.animate([   
           {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ(-10deg)'},
           {transform: 'translate('+this._pos.x + 'px,'+this._pos.y +'px)' + 'rotateZ(32deg)'},
       ], 
       {duration: this._duration,  fill: 'both'}); 
   }

   updateAngle(){
        this.angle = (this._animation.currentTime / this._duration) * 42 + -10;
        this.updateLine();
    }

   updateLine(){

        const a =  this._pos.clone().add(new Victor(18, 18));
        const b =  a.clone().add(new Victor(this._width-18, 0));

        const aOffset = new Victor(-4, -18).rotateDeg(this.angle);
        const bOffset = new Victor(0, -7).rotateDeg(this.angle);

        const vec = a.clone().subtract(b);
        vec.rotateDeg(this.angle)

        const b2 = a.clone().subtract(vec);

        this._line.setCoordinates(a.add(aOffset), b2.add(bOffset));
}

}
