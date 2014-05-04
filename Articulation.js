Renderer.Articulation = function(id,name) {
    Renderer.ScoreLeaf.call(this,id);
    this.update(name);
};

Renderer.Articulation.prototype = new Renderer.ScoreLeaf();
Renderer.Articulation.prototype.constructor = Renderer.Articulation;

Renderer.Articulation.prototype.update = function(name) {
    if (name === undefined || name === null) {
        this.name = null;
    } else {
        this.name = name;
    }
};

Renderer.Articulation.prototype.setDirection = function(direction) {
    if (this.name !== null) {
        if (direction == 1) {
        this.glyph = Renderer.GlyphFactory.createGlyph(this.upCodes[this.name]);
        } else {
            this.glyph = Renderer.GlyphFactory.createGlyph(this.downCodes[this.name]);
        }
    }
};

Renderer.Articulation.prototype.isClose = function() {
    return this.positions[this.name] == 'close';
};

Renderer.Articulation.prototype.upCodes = {
    'staccato':       'v6a',
    'tenuto':         'v77',
    'staccatissimo':  'v66'
};

Renderer.Articulation.prototype.downCodes = {
    'staccato':       'v6a',
    'tenuto':         'v77',
    'staccatissimo':  'v28'
};

Renderer.Articulation.prototype.positions = {
    'staccato': 'close',
    'tenuto':   'close',
    'accent':   'far'
};