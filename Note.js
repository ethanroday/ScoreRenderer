/**
 * Note is a specialized subclass of ScoreComposite. It must contain a
 * notehead and may contain an accidental. Under the hood, the notehead
 * is at index 0 and the accidental is at index 1.
 */

Renderer.Note = function(id,line,accidental,chord) {
    Renderer.ScoreComposite.call(this,id);
    this.id = id;
    this.update(line,accidental,chord);
};

Renderer.Note.prototype = new Renderer.ScoreComposite();
Renderer.Note.prototype.constructor = Renderer.Note;

Renderer.Note.prototype.updateChord = function(chord) {
    console.log("Updating to chord with duration "+chord.duration);
    this.children[0] = new Renderer.Notehead(null,chord.duration);
};

Renderer.Note.prototype.update = function(line,accidental,chord) {
    var value = chord.duration;
    this.line = line;
    this.accidental = accidental;
    
    this.displayInfo.renderY = -line;
    //console.log("Setting renderY as "+(-line));
    
    this.add(new Renderer.Notehead(null,value));
    
    if (accidental) {
        this.add(new Renderer.Accidental(null,accidental));
    }
    
    this.calculateCurrentMetrics();
};

Renderer.Note.prototype.upFlags = {
    1:   null,
    2:   null,
    4:   null,
    8:   'v54',
    16:  'v3f',
    32:  'v47',
    64:  'va9',
    128: 'v9b'
};

Renderer.Note.prototype.downFlags = {
    1:   null,
    2:   null,
    4:   null,
    8:   'v9a',
    16:  'v8f',
    32:  'v2a',
    64:  'v58',
    128: 'v30'
};

Object.defineProperty(Renderer.Note.prototype,"accidentalX", {
    get: function() {
        return this.getChild(1).displayInfo.renderX;
    },
    set: function(accidentalX) {
        console.log("accidentalX coming in as "+accidentalX);
        console.log("accidentalX: Child is: ");
        console.log(this.getChild(1));
        this.getChild(1).displayInfo.renderX = accidentalX;
        this.calculateCurrentMetrics();
    }
});