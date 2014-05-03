Renderer.Notehead = function(id,value) {
    Renderer.ScoreLeaf.call(this,id);
    this.id = id;
    this.glyph = Renderer.GlyphFactory.createGlyph(this.noteheads[value]);
};

Renderer.Notehead.prototype = new Renderer.ScoreLeaf();
Renderer.Notehead.prototype.constructor = Renderer.Notehead;

Renderer.Notehead.prototype.noteheads = {
    1:   'v1d',
    2:   'v81',
    4:   'vb',
    8:   'vb',
    16:  'vb',
    32:  'vb',
    64:  'vb',
    128: 'vb'
};