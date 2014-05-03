//**
//A basic bounding box object.
//BOUNDING BOXES SHOULD NOT BE EDITED. DOING SO LEAVES THEM IN AN
//INCONSISTENT STATE.
//**

Renderer.BoundingBox = function(minX,minY,width,height) {
    this.minX = minX;
    this.minY = minY;
    this.width = width;
    this.height = height;
    this._maxX = minX+width;
    this._maxY = minY+height;
};

Renderer.BoundingBox.prototype = {
    
    containsPoint: function(x,y) {
        return x >= this.minX &&
               x <= this._maxX &&
               y >= this.minY &&
               y <= this._maxY;
    },
    
    //Debugging methods
    draw: function(ctx,x,y) {
        ctx.save();
        ctx.strokeStyle = "#F00";
        ctx.strokeRect(x+this.minX,y+this.minY,this.width,this.height);
        ctx.restore();
    }
};