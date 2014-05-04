Renderer.Beam = function(id,value) {
    Renderer.ScoreLeaf.call(this,id);
    this.value = value;
};

Renderer.Beam.prototype = new Renderer.ScoreLeaf();
Renderer.Beam.prototype.constructor = Renderer.Beam;

Renderer.Beam.prototype.setDirection = function(direction) {
	console.log("Setting direction in beam. Value is "+this.value);
	var code;
	if (direction == 1) {
		code = this.upFlags[this.value];
		
	} else {
		code = this.downFlags[this.value];
	}
	if (code) {
		console.log("Setting glyph in beam.");
		this.glyph = Renderer.GlyphFactory.createGlyph(code);
	}
};

Renderer.Beam.prototype.upFlags = {
    1:   null,
    2:   null,
    4:   null,
    8:   'v54',
    16:  'v3f',
    32:  'v47',
    64:  'va9',
    128: 'v9b'
};

Renderer.Beam.prototype.downFlags = {
    1:   null,
    2:   null,
    4:   null,
    8:   'v9a',
    16:  'v8f',
    32:  'v2a',
    64:  'v58',
    128: 'v30'
};