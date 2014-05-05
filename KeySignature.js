Renderer.KeySignature = function(id,key) {
    Renderer.ScoreLeaf.call(this,id);
    this.update(key);
};

Renderer.KeySignature.prototype = new Renderer.ScoreLeaf();
Renderer.KeySignature.prototype.constructor = Renderer.KeySignature;

Renderer.KeySignature.prototype.update = function(key) {
    this.displayInfo.renderY = 0;
    
    var glyphs = [];
    
    var pos;
    var code;
    if (key > 1) {
        pos = this.sharpPositions.slice(0,Math.abs(key)+1);
        code = this.sharp;}
    else if (key < 1) {
        pos = this.flatPositions.slice(0,Math.abs(key)+1);
        code = this.flat;}
    
    for (var i = 0; i < Math.abs(key); i++) {
        glyphs.push(Renderer.GlyphFactory.createGlyph(code));
    }
    
    this.glyph = new Renderer.GlyphComposite(glyphs, pos);
};

Renderer.KeySignature.prototype.generateSims = function(simFormatter) {
	console.log("Adding nondurational for key with width "+this.displayInfo.width);
	simFormatter.addNonDurationalSim(this);
};

Renderer.KeySignature.prototype.sharp = 'v18';

Renderer.KeySignature.prototype.flat = 'v44';

Renderer.KeySignature.prototype.sharpPositions = [
    {x:0,y:-2},
    {x:0.75,y:-0.5},
    {x:1.5,y:-2.5},
    {x:2.25,y:-1},
    {x:3,y:0.5},
    {x:3.75,y:-1.5},
    {x:4.5,y:0}
];

Renderer.KeySignature.prototype.flatPositions = [
    {x:0,y:0},
    {x:0.75,y:-1.5},
    {x:1.5,y:0.5},
    {x:2.25,y:-1},
    {x:3,y:1},
    {x:3.75,y:-0.5},
    {x:4.5,y:1.5}
];