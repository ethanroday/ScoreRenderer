/**
 * A singleton flyweight-implementing factory that loads glyphs from the
 * current font object.
 * The font data in Gonville.js is specified in units relative to
 * the font's resolution. Here, we call those units path units (pu).
 * We need to convert from pu's to notehead widths (nw), the
 * scale-independent unit that the scoreComponent uses.
 * We also need to convert x_min, x_max, and ha into more useful metrics
 * (i.e. width, height, renderX, and renderY)
 * Hence all of the private helper methods.
 **/

Renderer.GlyphFactory = (function() {
    var glyphs = {};
    
    //The multiplier for converting from pu to nw.
    //(i.e. the width of a notehead is 428.75pu)
    var PU_TO_NW = 1/428.75;
    
    //If input is a number, convert it to nw.
    //Otherwise, leave it alone
    function strPuToNw(input) {
        var res = parseInt(input,10);
        if (!isNaN(res)) {
            return puToNw(res);
        } else {
            return input;
        }
    }
    
    function puToNw(input) {
        return input*PU_TO_NW;
    }
    
    function computeBoundingBox(outline) {
        var x = 0;
        var y = 0;
        
        var xMin = Infinity;
        var xMax = -Infinity;
        var yMin = Infinity;
        var yMax = -Infinity;
        
        var curXMin = Infinity;
        var curYMin = Infinity;
        var curXMax = -Infinity;
        var curYMax = -Infinity;
        
        var outlineLength = outline.length;
        var x1,x2,x3,y1,y2,y3;
        
        for (var i = 0; i < outlineLength; ) {
            
            if (curXMin < xMin) {
                xMin = curXMin;
            }
            if (curXMax > xMax) {
                xMax = curXMax;
            }
            if (curYMin < yMin) {
                yMin = curYMin;
            }
            if (curYMax > yMax) {
                yMax = curYMax;
            }
            
            var action = outline[i++];
            switch(action) {
                case 'm':
                    x = outline[i++],
                    y = outline[i++];
                    break;
                    
                case 'l':
                    x1 = outline[i++];
                    y1 = outline[i++];
                    curXMin = curXMax = x1;
                    curYMin = curYMax = y1;
                    
                    x = x1;
                    y = y1;
                    break;
                    
                case 'q':
                    x1 = outline[i++];
                    y1 = outline[i++];
                    x2 = outline[i++];
                    y2 = outline[i++];
                    var box = Renderer.BezierTools.quadraticBoundingBox(
                        x,y,x1,y1,x2,y2);
                    curXMin = box.topLeft.x;
                    curXMax = box.topLeft.x+box.width;
                    curYMin = box.topLeft.y;
                    curYMax = box.topLeft.y+box.height;
                    
                    x = x2;
                    y = y2;
                    break;
                case 'b':
                    x1 = outline[i++];
                    y1 = outline[i++];
                    x2 = outline[i++];
                    y2 = outline[i++];
                    x3 = outline[i++];
                    y3 = outline[i++];
                    var box = Renderer.BezierTools.cubicBoundingBox(
                        x,y,x1,y1,x2,y2,x3,y3);
                    curXMin = box.topLeft.x;
                    curXMax = box.topLeft.x+box.width;
                    curYMin = box.topLeft.y;
                    curYMax = box.topLeft.y+box.height;
                    
                    x = x3;
                    y = y3;
                    break;
            }
        }
        
        return {
            topLeft: {x:xMin,y:yMin},
            width: xMax-xMin,
            height: yMax-yMin
        };
    }
    
    return {
        createGlyph: function(code) {
            if (glyphs[code]) {
                return glyphs[code];
            } else {
                
                //Load the glyph data
                var glyphData = Gonville.Glyphs.glyphs[code];
                
                var outline = glyphData.o.split(' ').map(strPuToNw);
                
                var box = computeBoundingBox(outline);
                
                //Instantiate a new glyph with the data
                var glyph = new Renderer.GlyphLeaf(outline,box);
                
                //Add it to the flyweight's repository
                glyphs[code] = glyph;
                
                return glyph;
            }
        }
    };
})();