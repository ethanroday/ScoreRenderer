var ScoreCursor = function(svg,scale,xPadding,yPadding) {
    this.navigator = new ScoreNavigator();
    this.xPadding = xPadding;
    this.yPadding = yPadding;
    this.scale = scale;
    this.endOfMeasure = false;
    
    this.svg = svg;
    
    //Have to do it in a very stupid way because there is a bug in WebKit when
    //dynamically adding animations to an SVG object. The preferred way, of course,
    //would be to create <line>, <animate>, and <rect> programmatically and add them.
    this.svg.innerHTML = "<rect id='selectionBox' x='-100' y='-100' width='0' height='0' style='fill:blue;fill-opacity:0.1'/><line id='cursorLine' visibility='hidden' style='stroke:rgb(0,0,0);stroke-width:2' x1='-100' x2='-100' y1='-100' y2='-100'><animate attributename='visibility' from='hidden' to='visible' dur='1.3' repeatcount='indefinite'></animate></line>";
    this.line = document.getElementById('cursorLine');
    this.box = document.getElementById('selectionBox');
    this.mode = 'insertion';
};

ScoreCursor.prototype = {
    
    first: function() {
        var cur = this.navigator.getObjectAtCurrentPosition();
        console.log("In first. Cur is "+cur);
        var bool; if (cur) {bool=true;} else {bool=false;}
        console.log("In first. "+bool);
        if (cur && !cur.duration) {
            this.next();
        } else if (!cur) {
            console.log("In previous");
            this.navigator.previous();
            this._handleEndOfMeasure();
            if (this.mode == 'selection') {
                this.switchModes();
            }
        }
        console.log("first takes us to ");
        console.log(this.navigator.getCurrentPosition());
        
    },
    
    next: function() {
        
        this._handleEndOfMeasure();
        if (this.endOfMeasure) {
            this._updateCursor();
            return;
        }
        
        console.log("Saving position.");
        this.navigator.save();
        console.log("hasNext is "+this.navigator.hasNext());
        while(this.navigator.hasNext()) {
            console.log("After hasnext. measure and contents are "+this.navigator._measuresIndex+","+this.navigator._measureContentsIndex);
            var cur = this.navigator.next();
            if (!cur || cur.duration) {
                this._updateCursor();
                return;
            }
        }
        this.navigator.restore();
        
    },
    
    previous: function() {
        
        if (this.endOfMeasure) {
            this._handleEndOfMeasure();
            this._updateCursor();
            return;
        }
        
        this.navigator.save();
        while(this.navigator.hasPrevious()) {
            var cur = this.navigator.previous();
            if (cur.duration) {
                this._handleEndOfMeasure();
                this._updateCursor();
                return;
            }
        }
        this.navigator.restore();
        
    },
    
    _handleEndOfMeasure: function() {
        console.log("In _handleEndOfMeasure");
        console.log("navigator's endofmeasure is "+this.navigator.isAtEndOfMeasure());
        if (this.navigator.isAtEndOfMeasure() && !this.endOfMeasure) {
            console.log("Setting endOfMeasure to true");
            this.endOfMeasure = true;
            return;
        }
        if (this.endOfMeasure) {
            console.log("Setting endOfMeasure to false");
            this.endOfMeasure = false;
        }
    },
    
    nextPart: function() {
        if (this.navigator.hasNextPart()) {
            this.navigator.nextPart();
            this._updateCurVoiceCoords();
            this._updateCursor();
        }
    },
    
    previousPart: function() {
        if (this.navigator.hasPreviousPart()) {
            this.navigator.previousPart();
            this._updateCurVoiceCoords();
            this._updateCursor();
        }
    },
    
    _updateCurVoiceCoords: function() {
        var start = {
            x: this.xPadding*this.scale*Renderer.HORIZ_MULTIPLIER,
            y: this.yPadding*this.scale*Renderer.VERT_MULTIPLIER
        };
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        var pos = this.navigator.getCurrentPosition();
        var part = this.score.getChild(pos.part);
        var voice = part.voiceGroup.getChild(pos.voice);
        this.curVoiceCoords = this._getRealCoords(voice,
            this._getRealCoords(part,
                this._getRealCoords(this.score,start)));
    },
    
    _getRealCoords: function(component,parentCoords) {
        var realRender = component.displayInfo.getRealRender();
        console.log(component);
        console.log(parentCoords);
        parentCoords.x += realRender.x*this.scale;
        parentCoords.y += realRender.y*this.scale;
        return parentCoords;
    },
    
    _updateDisplay: function() {
        if (this.mode == 'insertion') {
            this._updateCursor();
        } else {
            this._updateBox();
        }
    },
    
    _updateCursor: function() {
        console.log("In _updateCursor. Getting coords");
        var cursorPos = this._getCursorCoords();
        console.log("cursorPos is ");
        console.log(cursorPos);
        this.line.setAttribute('x1',cursorPos.x);
        this.line.setAttribute('x2',cursorPos.x);
        this.line.setAttribute('y1',cursorPos.y-2.5*this.scale);
        this.line.setAttribute('y2',cursorPos.y+2.5*this.scale);
    },
    
    _hideCursor: function() {
        this.line.setAttribute('x1',-100);
        this.line.setAttribute('x2',-100);
        this.line.setAttribute('y1',-100);
        this.line.setAttribute('y2',-100);
    },
    
    _updateBox: function() {
        console.log("In _updateBox.");
        var pos = this._getBoxCoords();
        console.log("Box coords are ");
        console.log(pos);
        this.box.setAttribute('x',pos.x-0.5*this.scale);
        this.box.setAttribute('y',pos.y-0.5*this.scale);
        this.box.setAttribute('width',pos.width+1*this.scale);
        this.box.setAttribute('height',pos.height+1*this.scale);
    },
    
    _hideBox: function() {
        this.box.setAttribute('width',0);
        this.box.setAttribute('height',0);
    },
    
    _getCursorCoords: function() {
        console.log("In _getCursorCoords. pos is ");
        var pos = this.navigator.getCurrentPosition();
        console.log(pos);
        var measure = this.score.getChild(pos.part).voiceGroup.getChild(pos.voice).getChild(pos.measure);
        console.log("Measure is");
        console.log(measure);
        this._updateCurVoiceCoords();
        console.log("Voice coords are");
        console.log(this.curVoiceCoords);
        var measureCoords = this._getRealCoords(measure,this.curVoiceCoords);
        console.log("Meausre coords are:");
        console.log(measureCoords);
        if (measure.children.length > 0) {
            var extrema = measure.getChild(pos.measureContents).displayInfo.getRenderExtrema();
            console.log("Extrema are:");
            console.log(extrema);
            var curChordX = measureCoords.x+extrema.minX*this.scale;
            console.log("curChordX is ");
            console.log(curChordX);
            var prevChordX;
            console.log("In _getCursorCoords. endOfMeasure is "+this.endOfMeasure);
            if (this.endOfMeasure) {
                curChordX = measureCoords.x+extrema.maxX*this.scale;
                return {
                    x:curChordX+0.5,
                    y:this.curVoiceCoords.y
                };
            }
            if (this.navigator.isAtStartOfMeasure()) {
                prevChordX = curChordX-1;
            } else {
                console.log("In _getCursorCoords. hasPrevious is true");
                prevChordX = measureCoords.x+measure.getChild(pos.measureContents-1).displayInfo.getRenderExtrema().maxX*this.scale;
            }
            console.log("nextChordX is ");
            console.log(prevChordX);
            return {
                x:(prevChordX+curChordX)/2,
                y:this.curVoiceCoords.y
            };
        } else {
            return {
                x:measureCoords.x+0.5,
                y:this.curVoiceCoords.y
            };
        }
        
    },
    
    _getBoxCoords: function() {
        var pos = this.navigator.getCurrentPosition();
        var measure = this.score.getChild(pos.part).voiceGroup.getChild(pos.voice).getChild(pos.measure);
        this._updateCurVoiceCoords();
        var measureCoords = this._getRealCoords(measure,this.curVoiceCoords);
        if (measure.children.length > 0) {
            var extrema = measure.getChild(pos.measureContents).displayInfo.getRenderExtrema();
            return {
                x: measureCoords.x+extrema.minX*this.scale,
                y: measureCoords.y+extrema.minY*this.scale,
                width: extrema.maxX*this.scale-extrema.minX*this.scale,
                height: extrema.maxY*this.scale-extrema.minY*this.scale
            };
        }
    },
    
    curMeasureSplice: function() {
        var pos = this.navigator.getCurrentPosition();
        var measure = this.score.getChild(pos.part).voiceGroup.getChild(pos.voice).getChild(pos.measure);
        var index;
        if (this.endOfMeasure) {
            index = measure.children.length;
        } else {
            index = pos.measureContents;
        }
        return {
            id: measure.id,
            index: index
        };
    },
    
    curVoiceSplice: function() {
        var pos = this.navigator.getCurrentPosition();
        var voice = this.score.getChild(pos.part).voiceGroup.getChild(pos.voice);
        return {
            id: voice.id,
            index: voice.children.length
        };
    },
    
    getCurrentPosition: function() {
        return this.navigator.getCurrentPosition();
    },
    
    getObjectAtCurrentPosition: function() {
        return this.navigator.getObjectAtCurrentPosition();
    },
    
    update: function() {
        console.log("In cursor's update. Score is ");
        console.log(this._score);
        this._updateCurVoiceCoords();
        this.first();
        
        
        this._updateDisplay();
    },
    
    switchModes: function() {
        if (this.mode == 'insertion') {
            this.mode = 'selection';
            this._hideCursor();
        } else {
            this.mode = 'insertion';
            this._hideBox();
        }
        this._updateDisplay();
    }
    
};

Object.defineProperty(ScoreCursor.prototype,"score", {
    get: function() {
        return this._score;
    },
    set: function(score) {
        console.log("Setting score in cursor:");
        console.log(score);
        this.navigator.score = score;
        this._score = score;
    }
});