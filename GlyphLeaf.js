/**
 * Along with Renderer.GlyphComposite, implements the composite pattern for
 * glyphs.
 * 
 * Params:
 *  - params: a parameters object. Must contain the following parameters:
 *      - outline: the outline of the glyph as a list of path command components.
 *        For example,
 *        Move: ['m',0,0]
 *        Line: ['l',0,0]
 *        Quadratic Curve: ['q',0,0,0,0]
 *        Bezier Curve: ['b',0,0,0,0,0,0]
 *        The outline consists of several commands concatenated as a single list.
 *      - minXDiff: The distance from the glyph's origin to its minimum x value
 *      - minYDiff: The distance from the glyph's origin to its minimum y value
 *      - width: The glyph's width
 *      - height: The glyph's height
 *  Note: all units are notehead widths. The final four parameters in params
 *  are calculable from outline, but are included as parameters for convenience.
 */
 
 Renderer.GlyphLeaf = function(outline,box) {
    this.outline = outline;
    //Since we're drawing this upside down, let's reverse the bounding box
    this.box = box;
    this.box.topLeft.y = -(box.height-Math.abs(box.topLeft.y));
};

Renderer.GlyphLeaf.prototype = {
    
    draw: function(ctx,x,y) {
        
        //this.drawBoundingBox(ctx,x,y);
        
        var outline = this.outline;
        var x_pos = x;
        var y_pos = y;
        
        //THIS CODE IS MOSTLY FROM VEXFLOW
        var outlineLength = outline.length;
        ctx.beginPath();
        ctx.moveTo(x_pos, y_pos);
        
        for (var i = 0; i < outlineLength; ) {
            var action = outline[i++];
    
            switch(action) {
                case 'm':
                    ctx.moveTo(x_pos + outline[i++],
                               y_pos + outline[i++]*-1);
                    break;
                case 'l':
                    ctx.lineTo(x_pos + outline[i++],
                               y_pos + outline[i++]*-1);
                    break;
                case 'q':
                    var cpx = x_pos + outline[i++];
                    var cpy = y_pos + outline[i++]*-1;
                    ctx.quadraticCurveTo(x_pos + outline[i++],
                                         y_pos + outline[i++]*-1,
                                         cpx, cpy);
                    break;
                case 'b':
                    var bx = x_pos + outline[i++];
                    var by = y_pos + outline[i++]*-1;
                    ctx.bezierCurveTo(x_pos + outline[i++],
                                      y_pos + outline[i++]*-1,
                                      x_pos + outline[i++],
                                      y_pos + outline[i++]*-1,
                                      bx, by);
                    break;
            }
        }
        
        ctx.fillStyle = 'black';
        ctx.fill();
    },
    
    drawBoundingBox: function(ctx,x,y) {
        ctx.save();
        ctx.strokeStyle = "#0A0";
        ctx.strokeRect(x+this.box.topLeft.x,
                      y+this.box.topLeft.y,
                      this.box.width,
                      this.box.height);
        ctx.restore();
    },
    
    //Composite methods
    add: function() {},
    remove: function() {},
    getChild: function() {}
    
};