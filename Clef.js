Renderer.Clef = function(id,letter,line) {
    Renderer.ScoreLeaf.call(this,id);
    this.displayInfo.renderY = -line;
    var code = this.codes[letter];
    this.glyph = Renderer.GlyphFactory.createGlyph(code);
}

Renderer.Clef.prototype = new Renderer.ScoreLeaf();
Renderer.Clef.prototype.constructor = Renderer.Clef;

Renderer.Clef.prototype.codes = {
    'gClef': 'v83',
    'fClef': 'v79',
    'cClef': 'vad',
    'natClef': 'v59'
};