Renderer.RestElement = function(id,duration) {
    Renderer.ScoreLeaf.call(this,id);
    this.id = id;
    this.duration = duration;
    this.glyph = Renderer.GlyphFactory.createGlyph(this.rests[duration]);
};

Renderer.RestElement.prototype = new Renderer.ScoreLeaf();
Renderer.RestElement.prototype.constructor = Renderer.RestElement;

Renderer.RestElement.prototype.rests = {
    1:   'v5c',
    2:   'vc',
    4:   'v7c',
    8:   'va5',
    16:  'v3c',
    32:  'v55',
    64:  'v38',
    128: 'vaa'
};