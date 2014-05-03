/**
 * Chord is a specialized subclass of ScoreComposite. It must contain a
 * NoteGroup and may contain an Articulation and/or a DotGroup.
 * Under the hood, the NoteGroup is at index 0, and the indices of other
 * special children are maintained dynamically.
 */

Renderer.Chord = function(id,duration,numDots,articulation) {
    Renderer.ScoreComposite.call(this,id);
    this.displayInfo.controlPoint = 'origin';
    this.id = id;
    this.duration = duration;
    this.numDots = numDots;
    this.add(new Renderer.NoteGroup(null));
    var curIndex = 1;
    this.add(new Renderer.Articulation(null,articulation));
    this._articulationIndex = curIndex;
    curIndex ++;
    this.add(new Renderer.DotGroup(null));
    this._dotGroupIndex = curIndex;
};

Renderer.Chord.prototype = new Renderer.ScoreComposite();
Renderer.Chord.prototype.constructor = Renderer.Chord;

Renderer.Chord.prototype.addNote = function(note) {
    this.noteGroup.add(note);
};

Renderer.Chord.prototype.update = function(duration,numDots,articulation) {
    this.updateDuration(duration);
    this.updateNumDots(numDots);
    this.updateArticulation(articulation);
};

Renderer.Chord.prototype.updateDuration = function(duration) {
    if (duration != this.duration) {
        this.duration = duration;
        for (var i = 0; i < this.noteGroup.children.length; i++) {
            this.noteGroup.children[i].updateChord(this);
        }
    }
};

Renderer.Chord.prototype.updateNumDots = function(numDots) {
    this.numDots = numDots;
};

Renderer.Chord.prototype.updateArticulation = function(articulation) {
    this.articulation = new Renderer.Articulation(null,articulation);
};

//Utility function to sort the noteheads by pitch ascending or descending
Renderer.Chord.prototype.sortNotesByPitch = function(asc) {
    if (asc) {
        this.noteGroup.children.sort(this.ascendingNotePitchComparator);
    } else {
        this.noteGroup.children.sort(this.descendingNotePitchComparator);
    }
};

//A comparator for sorting nots by pitch ascending
Renderer.Chord.prototype.ascendingNotePitchComparator = function(noteA, noteB) {
    return noteA.displayInfo.renderY - noteB.displayInfo.renderY;
};

//A comparator for sorting notes by pitch descending
Renderer.Chord.prototype.descendingNotePitchComparator = function(noteA, noteB) {
    return noteB.displayInfo.renderY - noteA.displayInfo.renderY;
};

Renderer.Chord.prototype.myDraw = function(ctx,x,y) {
    Renderer.ScoreComposite.prototype.myDraw.call(this,ctx,x,y);
    this.drawStem(ctx,x,y);
    this.drawLedgerLines(ctx,x,y);
};

Renderer.Chord.prototype.drawStem = function(ctx,x,y) {
    if (this.stems[this.duration]) {
        ctx.save();
        ctx.translate(x,y);
        Renderer.LineContext.drawBlackLine(ctx,0,this.stemStartY,0,this.stemEndY);
        ctx.restore();
    }
};

Renderer.Chord.prototype.drawLedgerLines = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);
    
    var xOffset = this.stemDirection == 1 ? -1.2 : -0.2;
    if (this.insideLedgerLines) {
        for (var i = 0; i < this.insideLedgerLines.length; i++) {
            this.drawLedgerLine(ctx,xOffset,this.insideLedgerLines[i]);
        }
    }
    ctx.restore();
};

Renderer.Chord.prototype.drawLedgerLine = function(ctx,x,y) {
    Renderer.LineContext.drawBlackLine(ctx,x,y,x+1.4,y);
};

//Return the x-coordinate (relative to the chord's origin)
//of the left edge of the leftmost notehead
Renderer.Chord.prototype.getBeatline = function() {
    return this.noteGroup.displayInfo.topLeftX;
};

Renderer.Chord.prototype.getDurationWithDots = function() {
    var d = this.duration;
    for (var i = 0; i < this.numDots; i++) {
        d /= 1.5;
    }
    return d;
};

Renderer.Chord.prototype.hasArticulation = function() {
    return this.articulation.name !== null;
};

Renderer.Chord.prototype.calculateMyMetrics = function() {
    //Basically, return the metrics for the stem.
    var minY;
    var maxY;
    if (this.stemDirection == 1) {
        minY = this.stemEndY;
        maxY = this.stemStartY;
    } else {
        minY = this.stemStartY;
        maxY = this.stemEndY;
    }
    return {
        minX: 0,
        maxX: 0,
        minY: minY*Renderer.VERT_MULTIPLIER,
        maxY: maxY*Renderer.VERT_MULTIPLIER
    };
};

Renderer.Chord.prototype.accept = function(formatter) {
    formatter.formatChord(this);
};

Renderer.Chord.prototype.stems = {
    1:   false,
    2:   true,
    4:   true,
    8:   true,
    16:  true,
    32:  true,
    64:  true,
    128: true
};

Object.defineProperty(Renderer.Chord.prototype,"noteGroup", {
    get: function() {
        return this.children[0];
    },
    set: function(noteGroup) {
        this.children[0] = noteGroup;
    }
});

Object.defineProperty(Renderer.Chord.prototype,"articulation", {
    get: function() {
        return this.children[this._articulationIndex];
    },
    set: function(articulation) {
        this.children[this._articulationIndex] = articulation;
    }
});

Object.defineProperty(Renderer.Chord.prototype,"dotGroup", {
    get: function() {
        return this.children[this._dotGroupIndex];
    },
    set: function(dotGroup) {
        this.children[this._dotGroupIndex] = dotGroup;
    }
});