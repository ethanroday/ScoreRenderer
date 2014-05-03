Renderer.Dot = function(id,numDots,line) {
    Renderer.ScoreLeaf.call(this,id);
    this.id = id;
    var glyph = Renderer.GlyphFactory.createGlyph('v23');
    var glyphs = [];
    var positions = [];
    for (var i = 0; i < numDots; i++) {
        glyphs.push(glyph);
        positions.push({x:glyph.box.width*i*2,y:0});
    }
    this.glyph = new Renderer.GlyphComposite(glyphs,positions);
    this.displayInfo.renderY = -line;
};

Renderer.Dot.prototype = new Renderer.ScoreLeaf();
Renderer.Dot.prototype.constructor = Renderer.Dot;
