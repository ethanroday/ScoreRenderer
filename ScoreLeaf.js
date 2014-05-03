//**
//Along with ScoreComposite, implements the composite pattern for the visual
//representation of a score
//**

Renderer.ScoreLeaf = function(id) {
    this.displayInfo = new Renderer.DisplayInformation();
    this.id = id;
    this._glyph = null;
    this.xStretchability = 0; //Leaves cannot be stretched
    this.xShrinkability = 0;  //or shrunk
};

Renderer.ScoreLeaf.prototype = {
    
    draw: function(ctx,x,y) {
        if (this.glyph) {
            var realRender = this.displayInfo.getRealRender();
            x = x+realRender.x;
            y = y+realRender.y;
            //this.drawCrosshair(ctx,x,y);
            //this.drawBoundingBox(ctx,x,y);
            this.glyph.draw(ctx,x,y);
        }
    },
    
    isStretchableX: function() {
        return this.xStretchability > 0;
    },
    
    isShrinkableX: function() {
        return this.xShrinkability < 0;
    },
    
    //Composite pattern methods
    add: function() {},
    remove: function() {},
    getChild: function() {},
    
    //Iterator methods
    createBFIterator: function() {
        return new SingleIterator(this);
    },
    
    createDFIterator: function() {
        return new SingleIterator(this);
    },
    
    //Visitor methods
    //Should be overriden by subclass for custom formatting
    accept: function(formatter) {},
    
    //Debugging methods
    drawCrosshair: function(ctx,x,y) {
        ctx.save();
        
        ctx.strokeStyle = "#888";
        
        ctx.beginPath();
        ctx.moveTo(x - 0.5, y);
        ctx.lineTo(x + 0.5, y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x, y - 0.5);
        ctx.lineTo(x, y + 0.5);
        ctx.stroke();
        
        ctx.restore();
    },
    
    drawBoundingBox: function(ctx,x,y) {
        console.log("Drawing leaf's bounding box.");
        console.log(this.displayInfo);
        ctx.save();
        ctx.strokeStyle = "#F00";
        ctx.strokeRect(x+this.displayInfo.topLeftX,
                      y+this.displayInfo.topLeftY,
                      this.displayInfo.width,
                      this.displayInfo.height);
        ctx.restore();
    }
    
};

Object.defineProperty(Renderer.ScoreLeaf.prototype,"glyph", {
    get: function() {
        return this._glyph;
    },
    set: function(newGlyph) {
        this._glyph = newGlyph;
        this.displayInfo.width = this._glyph.box.width;
        this.displayInfo.height = this._glyph.box.height;
        this.displayInfo.topLeftX = this._glyph.box.topLeft.x;
        this.displayInfo.topLeftY = this._glyph.box.topLeft.y;
    }
});