class Ball {
    constructor(x,y,r,vx,vy, tableObj){
        this.className = 'ball';
        this.x = x;
        this.y = y;
        this.oldx = x;
        this.oldy = y;
        this.r = r;
        this.vx = vx;
        this.vy = vy;
        this.table = tableObj;
        this.maxSpeed = 25;
	    this.keyframes = [];
        
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
        this.table.table1.appendChild(this.elem);
    }
}
export default Ball;