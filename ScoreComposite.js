//**
//Along with ScoreLeaf, implements the composite pattern for the visual
//representation of a score
//**

Renderer.ScoreComposite = function(id) {
    this.displayInfo = new Renderer.DisplayInformation();
    this.children = [];
    this.id = id;
    this.xStretchability = 0; //These are initially 0 but can be
    this.xShrinkability = 0;  //modified by the renderer
    
};

Renderer.ScoreComposite.prototype = {
    
    draw: function(ctx,x,y) {
        var realRender = this.displayInfo.getRealRender();
        x = x+realRender.x;
        y = y+realRender.y;
        //this.drawBoundingBox(ctx,x,y);
        //this.drawCrosshair(ctx,x,y);
        this.myDraw(ctx,x,y);
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.draw(ctx,x,y);
        }
    },
    
    //Should be overriden in subclasses if composites would like to do their
    //own drawing (e.g. Voice draws staff lines, then children)
    myDraw: function(ctx,x,y) {
    },
    
    isStretchableX: function() {
        return this.xStretchability > 0;
    },
    
    isShrinkableY: function() {
        return this.yShrinkability < 0;
    },
    
    //Composite pattern methods
    add: function(child) {
        this.children.push(child);
    },
    
    addAt: function(child,index) {
        this.children.splice(index,0,child);
    },
    
    remove: function(child) {
        for (var node, i = 0; node = this.getChild(i); i++) {
            if (node == child) {
                this.children.splice(i, 1);
                break;
            }
        }
    },
    
    removeAt: function(i) {
        this.children.splice(i,1);
    },
    
    getChild: function(i) {
        return this.children[i];
    },
    
    calculateCurrentMetrics: function() {
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        var extrema;
        if (this.children.length) {
            for (var i = 0; i < this.children.length; i++) {
                extrema = this.children[i].displayInfo.getRealRenderExtrema();
                
                if (extrema.minX < minX) {
                    minX = extrema.minX;
                }
                if (extrema.minY < minY) {
                    minY = extrema.minY;
                }
                if (extrema.maxX > maxX) {
                    maxX = extrema.maxX;
                }
                if (extrema.maxY > maxY) {
                    maxY = extrema.maxY;
                }
            }
        } else {
            minX = 0;
            minY = 0;
            maxX = 0;
            minX = 0;
        }
            
            var myMetrics = this.calculateMyMetrics();
            if (myMetrics) {
                extrema = myMetrics;
                
                if (extrema.minX < minX) {
                    minX = extrema.minX;
                }
                if (extrema.minY < minY) {
                    minY = extrema.minY;
                }
                if (extrema.maxX > maxX) {
                    maxX = extrema.maxX;
                }
                if (extrema.maxY > maxY) {
                    maxY = extrema.maxY;
                }
            }
        
        this.displayInfo.topLeftX = minX;
        this.displayInfo.topLeftY = minY;
        this.displayInfo.height = maxY-minY;
        this.displayInfo.width = maxX-minX;
    },
    
    //Should be overriden in subclasses if composites need to compute any
    //extra metrics (e.g. chords must factor in stem length)
    calculateMyMetrics: function() {
        return null;
    },
    
    //Iterator methods
    createBFIterator: function() {
        return new BreadthFirstCompositeIterator(this);
    },
    
    //Iterator methods
    createDFIterator: function() {
        return new DepthFirstCompositeIterator(this);
    },
    
    //Visitor methods
    //Should be overriden by subclass for custom formatting
    accept: function(formatter) {},
    
    //Debugging Methods
    logId: function() {
        console.log(this.id);
    },
    
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
        ctx.save();
        ctx.strokeStyle = "#F00";
        ctx.strokeRect(x+this.displayInfo.topLeftX,
                       y+this.displayInfo.topLeftY,
                       this.displayInfo.width,
                       this.displayInfo.height);
        ctx.restore();
    }
    
};