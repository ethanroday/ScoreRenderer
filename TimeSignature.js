Renderer.TimeSignature = function(id,top,bottom) {
    Renderer.ScoreLeaf.call(this,id);
    this.update(top,bottom);
    this.simple = false;
};

Renderer.TimeSignature.prototype = new Renderer.ScoreLeaf();
Renderer.TimeSignature.prototype.constructor = Renderer.TimeSignature;

Renderer.TimeSignature.prototype.update = function(top,bottom) {
    this.displayInfo.renderY = 0;
    
    this.top = top;
    this.bottom = bottom;
    
    var glyphs = [];
    
    //UPDATE TO ADD FUNCTIONALITY FOR COMPOSITE SIGS
    glyphs.push(Renderer.GlyphFactory.createGlyph(this.numbers[top[0]]));
    glyphs.push(Renderer.GlyphFactory.createGlyph(this.numbers[bottom[0]]));
    
    this.glyph = new Renderer.GlyphComposite(glyphs, [
        {x:0,y:0},
        {x:0,y:1.6}
    ]);
};

Renderer.TimeSignature.prototype.canBeComplex = function() {
	return this.top[0] % 3 == 0;
};

Renderer.TimeSignature.prototype.generateSims = function(simFormatter) {
	simFormatter.addNonDurationalSim(this);
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

Object.defineProperty(Renderer.TimeSignature.prototype,"simple", {
    get: function() {
        return this._simple;
    },
    set: function(simple) {
    	if (simple || this.canBeComplex()) {
    		this._simple = simple;
    	}
    }
});

Object.defineProperty(Renderer.TimeSignature.prototype,"complex", {
    get: function() {
        return !this._simple;
    },
    set: function(complex) {
    	if (!complex || this.canBeComplex()) {
    		this._simple = !simple;
    	}
    }
});