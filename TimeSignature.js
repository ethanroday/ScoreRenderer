Renderer.TimeSignature = function(id,top,bottom) {
    Renderer.ScoreLeaf.call(this,id);
    this.update(top,bottom);
};

Renderer.TimeSignature.prototype = new Renderer.ScoreLeaf();
Renderer.TimeSignature.prototype.constructor = Renderer.TimeSignature;

Renderer.TimeSignature.prototype.update = function(top,bottom) {
    this.displayInfo.renderY = 0;
    
    var glyphs = [];
    
    //UPDATE TO ADD FUNCTIONALITY FOR COMPOSITE SIGS
    glyphs.push(Renderer.GlyphFactory.createGlyph(this.numbers[top[0]]));
    glyphs.push(Renderer.GlyphFactory.createGlyph(this.numbers[bottom[0]]));
    
    this.glyph = new Renderer.GlyphComposite(glyphs, [
        {x:0,y:-0.3},
        {x:0,y:1.3}
    ]);
};

Renderer.TimeSignature.prototype.numbers = {
    0: 'v0',
    1: 'v1',
    2: 'v2',
    3: 'v3',
    4: 'v4',
    5: 'v5',
    6: 'v6',
    7: 'v7',
    8: 'v8',
    9: 'v9',
};

Renderer.TimeSignature.prototype.commonTime = 'v41';

Renderer.TimeSignature.prototype.cutTime = 'vb6';

Renderer.TimeSignature.prototype.plus = {
    outline:['m',0,0.2,'l',0,-0.2,'l',1,-0.2,'l',1,0.2,'l',0,0.2,
             'm',0.3,-0.5,'l',0.7,-0.5,'l',0.7,0.5,'l',0.3,0.5,'l',0.3,-0.5],
    minX: 0,
    minY: 0.5,
    width: 1,
    height: 1
};