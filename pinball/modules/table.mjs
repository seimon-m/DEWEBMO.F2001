class Table {
    constructor(bounce) {
        this.bounce = bounce;
        this.table1 = document.querySelector('.table')
        this.readStyle = getComputedStyle(this.table1)
        this.widthString = this.readStyle.width;
        this.heightString = this.readStyle.height;
        this.width = parseInt(this.widthString, 10);
        this.height = parseInt(this.heightString, 10);
        this.left = parseInt(this.readStyle.left, 10);
        this.top = parseInt(this.readStyle.top, 10);
    }

    detectCollision(b){
        return ((b.x-b.r<this.left) || (b.x+b.r>this.width) || (b.y-b.r<this.top) || (b.y+b.r>this.height));
    }
    
    reflectCollision(b){
        let xMin = this.left;
        let xMax = this.width;
        let yMin = this.top;
        let yMax = this.height;
        if (b.x-b.r < xMin) {
            b.x = xMin+b.r;
            if (Math.abs(b.vx)>1){b.y = b.y + ((-b.x+xMin)+b.r)/b.vx*b.vy}
            b.vx = -b.vx*this.bounce;
            b.vy = b.vy*this.bounce;
        } else if (b.x+b.r > xMax) {
            b.x = xMax-b.r; 
            if (Math.abs(b.vx)>1){b.y = b.y - ((b.x-xMax)+b.r)/b.vx*b.vy}
            b.vx = -b.vx*this.bounce;
            b.vy = b.vy*this.bounce;
        } else if (b.y-b.r < yMin) {
            if (Math.abs(b.vy)>1){b.x = b.x + ((-b.y+yMin)+b.r)/b.vy*b.vx}
            b.y = yMin+b.r; 
            b.vx = b.vx*this.bounce;
            b.vy = -b.vy*this.bounce;
        } else if (b.y+b.r > yMax) {
            if (Math.abs(b.vy)>1){b.x = b.x - ((b.y-yMax)+b.r)/b.vy*b.vx}
            b.y = yMax-b.r; 
            b.vx = b.vx*this.bounce;
            b.vy = -b.vy*this.bounce;
        }  
    }
}
export default Table;