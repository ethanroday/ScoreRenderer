/**
 * A class that abstracts away from a score's implementation to essentially
 * provide a 4-way directional movement system.
 */

var ScoreNavigator = function() {
    this._partsIndex = 0;
    this._voicesIndex = 0;
    this._measuresIndex = 0;
    this._measureContentsIndex = 0;
};

ScoreNavigator.prototype = {
    next: function() {
        console.log("In next.");
        if (this.isAtEndOfMeasure()) {
            console.log("GOING TO NEXT MEASURE");
            this._measuresIndex += 1;
            this._measureContentsIndex = 0;
        } else {
            this._measureContentsIndex += 1;
        }
        console.log("Object at current position:");
        console.log(this.getObjectAtCurrentPosition());
        return this.getObjectAtCurrentPosition();
    },
    
    previous: function() {
        var voice = this.score.getChild(this._partsIndex).voiceGroup.getChild(this._voicesIndex);
        if (this.isAtStartOfMeasure()) {
            this._measuresIndex -= 1;
            this._measureContentsIndex = voice.getChild(this._measuresIndex).children.length-1;
        } else {
            this._measureContentsIndex -= 1;
        }
        return this.getObjectAtCurrentPosition();
    },
    
    nextPart: function() {
        this._partsIndex += 1;
    },
    
    previousPart: function() {
        this._partsIndex -= 1;
    },
    
    hasNext: function() {
        var voice = this.score.getChild(this._partsIndex).voiceGroup.getChild(this._voicesIndex);
        return this._measureContentsIndex < voice.getChild(this._measuresIndex).children.length-1 ||
                this._measuresIndex < voice.children.length-1;
    },
    
    hasPrevious: function() {
        return this._measureContentsIndex > 0 || this._measuresIndex > 0;
    },
    
    hasNextPart: function() {
        return this._partsIndex < this.score.children.length-1;
    },
    
    hasPreviousPart: function() {
        return this._partsIndex > 0;
    },
    
    getCurrentPosition: function() {
        return {
            part: this._partsIndex,
            voice: this._voicesIndex,
            measure: this._measuresIndex,
            measureContents: this._measureContentsIndex
        };
    },
    
    isAtEndOfMeasure: function() {
        var voice = this.score.getChild(this._partsIndex).voiceGroup.getChild(this._voicesIndex);
        var measure = voice.getChild(this._measuresIndex);
        return measure.children.length == 0 || this._measureContentsIndex == measure.children.length-1;
    },
    
    isAtStartOfMeasure: function() {
        return this._measureContentsIndex === 0;
    },
    
    setCurrentPosition: function(curPos) {
        if (!isNaN(curPos.part) && !isNaN(curPos.voice) && !isNaN(curPos.measure) && !isNaN(curPos.measureContents)) {
            this._partsIndex = curPos.part;
            this._voicesIndex = curPos.voice;
            this._measuresIndex = curPos.measure;
            this._measureContentsIndex = curPos.measureContents;
        }
    },
    
    getObjectAtCurrentPosition: function() {
        var voice = this.score.getChild(this._partsIndex).voiceGroup.getChild(this._voicesIndex);
        return voice.getChild(this._measuresIndex).getChild(this._measureContentsIndex);
    },
    
    //Save only has one level. Calling save twice will override the first position
    //with the second.
    save: function() {
        this.savedPos = this.getCurrentPosition();
    },
    
    restore: function() {
        this.setCurrentPosition(this.savedPos);
    }
};

Object.defineProperty(ScoreNavigator.prototype,"score", {
    get: function() {
        return this._score;
    },
    set: function(score) {
        console.log("Setting score in navigator");
        this._score = score;
        this._partsIndex = 0;
        this._voicesIndex = 0;
        this._measuresIndex = 0;
        this._measureContentsIndex = 0;
    }
});