/**
 * Along with Renderer.GlyphLeaf, implements the composite pattern for
 * glyphs.
 * 
 * Params:
 *  - glyphs: a list of GlyphLeaf objects
 *  - positions: a list of (x,y) points (i.e. objects parameterized with x and y)
 *    representing each glyph's position relative to the draw coordinates at
 *    runtime. Unit is notehead widths
 */

Renderer.GlyphComposite = function(glyphs,positions) {
    this.glyphs = glyphs;
    this.positions = positions;
    this.calculateCurrentMetrics();
};

Renderer.GlyphComposite.prototype = {
    draw: function(ctx,x,y) {
        //this.drawBoundingBox(ctx,x,y);
        var pos;
        for (var i = 0; i < this.glyphs.length; i++) {
            pos = this.positions[i];
            this.glyphs[i].draw(ctx, x+pos.x*Renderer.HORIZ_MULTIPLIER, y+pos.y*Renderer.VERT_MULTIPLIER);
        }
    },
    
    drawBoundingBox: function(ctx,x,y) {
        ctx.save();
        ctx.strokeStyle = "#0AA";
        ctx.strokeRect(x+this.box.topLeft.x,
                      y+this.box.topLeft.y,
                      this.box.width,
                      this.box.height);
        ctx.restore();
    },
    
    //Composite methods
    add: function(glyph,position) {
        this.glyphs.push(glyph);
        this.positions.push(position);
        this.calculateCurrentMetrics();
    },
    remove: function(glyph) {
        for (var node, i = 0; node = this.getChild(i); i++) {
            if (node == glyph) {
                this.children.splice(i, 1);
                break;
            }
        }
    },
    getChild: function(i) {
        return this.glyphs[i];
    },
    
    
    //Calculate width and height of the glyph
    //based on its current glyph and position lists
    calculateCurrentMetrics: function() {
        var pos;
        var glyph;
        var curMinX;
        var curMinY;
        var curMaxX;
        var curMaxY;
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        
        for (var i = 0; i < this.glyphs.length; i++) {
            pos = this.positions[i];
            glyph = this.glyphs[i];
            curMinX = pos.x + glyph.box.topLeft.x;
            curMinY = pos.y + glyph.box.topLeft.y;
            if (curMinX < minX) {
                minX = curMinX;
            }
            if (curMinY < minY) {
                minY = curMinY;
            }
            curMaxX = curMinX + glyph.box.width;
            curMaxY = curMinY + glyph.box.height;
            if (curMaxX > maxX) {
                maxX = curMaxX;
            }
            if (curMaxY > maxY) {
                maxY = curMaxY;
            }
        }
        
        this.box = {
            topLeft: {
                x: minX,
                y: minY
            },
            width: Math.abs(maxX)+Math.abs(minX),
            height: Math.abs(maxY)+Math.abs(minY)
        };
        
        console.log("Setting box as ");
        console.log(this.box);
    }
};