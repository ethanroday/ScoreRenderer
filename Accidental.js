Renderer.Accidental = function(id,accidentalName) {
    Renderer.ScoreLeaf.call(this,id);
    this.id = id;
    this.glyph = Renderer.GlyphFactory.createGlyph(this.accidentals[accidentalName]);
};

Renderer.Accidental.prototype = new Renderer.ScoreLeaf();
Renderer.Accidental.prototype.constructor = Renderer.Accidental;

Renderer.Accidental.prototype.accidentals = {
    "sharp":        "v18",
    "flat":         "v44",
    "double sharp": "v7f",
    "double flat":  "v26",
    "natural":      "v4e"
};