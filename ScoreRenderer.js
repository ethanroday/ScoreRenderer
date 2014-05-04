Renderer.ScoreRenderer = function(sd,scale,xPadding,yPadding) {
    this.scoreDisplay = sd;
    this.startX = xPadding;
    this.startY = yPadding;
    this.scale = scale;
    Renderer.LineContext.setVertScale(Renderer.VERT_MULTIPLIER);
    Renderer.LineContext.setHorizScale(Renderer.HORIZ_MULTIPLIER);
    
    this.scoreFormatter = new Renderer.ScoreFormatter();
    //PartFormatter needs a context so it can measure the width and height of text
    this.partFormatter = new Renderer.PartFormatter(this.scoreDisplay.ctx);
    this.voiceFormatter = new Renderer.VoiceFormatter();
    this.measureFormatter = new Renderer.MeasureFormatter();
    this.chordFormatter = new Renderer.ChordFormatter();
    this.simFormatter = new Renderer.SimFormatter();
};

Renderer.ScoreRenderer.prototype = {
    
    render: function() {
        var ctx = this.scoreDisplay.ctx;
        ctx.clearRect(0, 0, this.scoreDisplay.canvas.width, this.scoreDisplay.canvas.height);
        var score = this.scoreDisplay.scoreComponent;
        ctx.save();
        ctx.font = "1px Times";
        this._scaleContextSizeOnly(ctx,this.scale);
        //this._drawGrid(ctx,this.scoreDisplay.canvas.width,this.scoreDisplay.canvas.height);
        score.draw(ctx,this.startX*Renderer.HORIZ_MULTIPLIER,this.startY*Renderer.VERT_MULTIPLIER);
        ctx.restore();
    },
    
    _drawGrid: function(ctx,width,height) {
        var xLines = Math.floor(width/(Renderer.HORIZ_MULTIPLIER/this.scale));
        var yLines = Math.floor(height/(Renderer.VERT_MULTIPLIER/this.scale));
        ctx.save();
        ctx.strokeStyle = '#00A';
        ctx.lineWidth /= 2;
        ctx.beginPath();
        var i;
        for (i = 0; i < xLines; i+= Renderer.HORIZ_MULTIPLIER) {
            ctx.moveTo(i,0);
            ctx.lineTo(i,yLines);
        }
        for (i = 0; i < yLines; i+= Renderer.VERT_MULTIPLIER) {
            ctx.moveTo(0,i);
            ctx.lineTo(xLines,i);
        }
        ctx.stroke();
        ctx.restore();
    },
    
    _scaleContextSizeOnly: function(ctx,scale) {
        ctx.scale(scale,scale);
        ctx.lineWidth = 1/scale;
    },
    
    format: function() {
        var iterator = this.scoreDisplay.scoreComponent.createDFIterator();
        var next;
        while (iterator.hasNext()) {
            next = iterator.next();
            next.generateSims(this);
        }
        iterator = this.scoreDisplay.scoreComponent.createDFIterator();
        while (iterator.hasNext()) {
            next = iterator.next();
            next.accept(this);
        }
    },
    
    //Visitor methods
    
    formatScore: function(score) {
    	console.log("LEVEL: score");
        this.scoreFormatter.format(score);
    },
    
    formatPart: function(part) {
    	console.log("LEVEL: part");
        this.partFormatter.format(part);
    },
    
    formatVoice: function(voice) {
    	console.log("LEVEL: voice");
        this.voiceFormatter.format(voice);
    },
    
    formatMeasure: function(measure) {
    	console.log("LEVEL: measure");
    	
        this.measureFormatter.format(measure);
    },
    
    formatChord: function(chord) {
    	console.log("LEVEL: chord");
        this.chordFormatter.format(chord);
    },
    
    nextNeighborhood: function(measure) {
    	this.simFormatter.nextNeighborhood(measure);
    },
    
    addChordSim: function(chord) {
    	this.simFormatter.addChordSim(chord);
    },
    
    newVoice: function() {
    	this.simFormatter.newVoice();
    },
    
    formatSims: function() {
    	this.simFormatter.format();
    }
    
};


Renderer.ChordFormatter = function() {
    this.currentChord = null;
    this.firstAccidentalPadding = 0.1;
};

Renderer.ChordFormatter.prototype = {
    
    format: function(chord) {
        this.currentChord = chord;
        if (this.currentChord.noteGroup) {
            this.calculateStemDirection();
            this.calculateStemLength();
			this.positionBeam();
            this.positionNoteheads();
            this.positionDots();
            this.positionAccidentals();
            this.positionArticulation();
            this.calculateLedgerLines();
        } else {
            this.positionDots();
        }
        
        this.currentChord.calculateCurrentMetrics();
        console.log("Formatted chord: ");
        console.log(chord);
        this.currentChord = null;
    },
    
    //The stem direction depends on the center of gravity of the
    //noteheads, which is just the sum of the y coordinates of the pitches.
    //Essentially, more notes below the middle staff line means an upward
    //stem, and vice versa.
    //Recall that negative renderY is positive staff position
    calculateStemDirection: function() {
        var sum = 0;
        for (var i = 0; i < this.currentChord.noteGroup.children.length; i++) {
            sum += this.currentChord.noteGroup.children[i].displayInfo.renderY;
        }
        if (sum >= 0) {
            this.currentChord.stemDirection = 1;
        } else {
            this.currentChord.stemDirection = -1;
        }
    },
    
    //Calculate the y values for the start and end of the stem
    calculateStemLength: function() {
        if (this.currentChord.stems[this.currentChord.duration]) {
            var defaultStemLength = 3.5;
            this.currentChord.sortNotesByPitch(this.currentChord.stemDirection != 1);
            var firstY = this.currentChord.noteGroup.children[0].displayInfo.renderY;
            var lastY = this.currentChord.noteGroup.children[this.currentChord.noteGroup.children.length-1].displayInfo.renderY;
            var endY;
            if (lastY*this.currentChord.stemDirection > defaultStemLength) {
                endY = 0;
            } else if (this.currentChord.noteGroup.children.length == 1) {
                endY = lastY + (defaultStemLength*-this.currentChord.stemDirection);
            } else {
                endY = lastY + ((defaultStemLength-1)*-this.currentChord.stemDirection);
            }
            
            this.currentChord.stemStartY = firstY;
            this.currentChord.stemEndY = endY;
        }
    },
    
    //Set the direction and x,y value of the beam based on the stem direction and length
    positionBeam: function() {
    	this.currentChord.beam.setDirection(this.currentChord.stemDirection);
    	this.currentChord.beam.displayInfo.renderX = this.currentChord.stemDirection == 1 ? 1 : 0;
    	this.currentChord.beam.displayInfo.renderY = this.currentChord.stemEndY; 
    },
    
    //Following Gourlay, greedily identify seconds starting from the
    //closed end of the stem (i.e. the end with a note on it).
    //The top of each second goes to the right of the stem.
    //This could use some optimization. It is a naive implementation
    //straight out of "Computer Formatting of Musical Simultaneities" (p. 5).
    positionNoteheads: function() {
        
        var defaultX = 0;
        var otherX = this.currentChord.stemDirection == 1 ? 1 : -1;
        
        this.currentChord.displayInfo.topLeftX = defaultX;
        
        var i;
        for (i = 0; i < this.currentChord.noteGroup.children.length; i++) {
            this.currentChord.noteGroup.children[i].displayInfo.renderX = defaultX;
        }
        
        //Sort the noteheads by pitch.
        //If stem direction is up, start with the lowest pitch, and vice versa.
        this.currentChord.sortNotesByPitch(this.currentChord.stemDirection != 1);
        
        var hasSecond = false;
        
        //Begin by comparing the first two pitches
        var primaryNoteIndex = 0;
        var comparisonNoteIndex = 1;
        while (comparisonNoteIndex < this.currentChord.noteGroup.children.length) {
            
            //If primaryNote and comparisonNote form a second
            if (Math.abs(this.currentChord.noteGroup.children[primaryNoteIndex].displayInfo.renderY -
                         this.currentChord.noteGroup.children[comparisonNoteIndex].displayInfo.renderY) == 0.5) {
                
                hasSecond = true;             
                
                //Reverse the direction of comparisonNote
                this.currentChord.noteGroup.children[comparisonNoteIndex].displayInfo.renderX = otherX;             
                
                //Go to the next unconsidered note
                primaryNoteIndex += 2;
            } else {
                //Go to the next unconsidered note
                primaryNoteIndex += 1;
            }
            comparisonNoteIndex = primaryNoteIndex + 1;
        }
        if (this.currentChord.noteGroup) {
        	this.currentChord.noteGroup.calculateCurrentMetrics();
        }
    },
    
    //Again, this follows Gourlay's original algorithm for dot placement
    positionDots: function() {
        console.log("Positioning dots. numDots is "+this.currentChord.numDots);
        if (this.currentChord.numDots) {
            console.log("Note group is "+this.currentChord.noteGroup);
            if (this.currentChord.noteGroup) {
                this.currentChord.dotGroup.displayInfo.renderX =
                    this.currentChord.noteGroup.displayInfo.topLeftX + 
                        this.currentChord.noteGroup.displayInfo.width + 0.5;
            
                var curNote;
                var space;
                var dotYs = [];
                this.currentChord.sortNotesByPitch(this.currentChord.stemDirection == 1);
                for (var i = 0; i < this.currentChord.noteGroup.children.length; i++) {
                    
                    curNote = this.currentChord.noteGroup.children[i];
                    if (this._isOnSpace(curNote)) {
                        if (this._contains(dotYs,curNote.displayInfo.renderY)) {
                            space = curNote.displayInfo.renderY;
                            while(this._contains(dotYs,space)) {
                                space += 1*-this.currentChord.stemDirection;
                            }
                        } else {
                            space = curNote.displayInfo.renderY;
                        }
                    } else {
                        if (this._contains(dotYs,curNote.displayInfo.renderY)) {
                            space = curNote.displayInfo.renderY+0.5;
                        } else {
                            space = curNote.displayInfo.renderY-0.5;
                        }
                    }
                   dotYs.push(space);
                }
                for (i = 0; i < dotYs.length; i++) {
                    this.currentChord.dotGroup.add(
                        new Renderer.Dot(null,this.currentChord.numDots,-dotYs[i]));
                }
                this.currentChord.dotGroup.calculateCurrentMetrics();
            }
            //If there are no notes, it's a rest
            else {
                console.log("Positioning dots for rest");
                this.currentChord.dotGroup.displayInfo.renderX =
                    this.currentChord.restElement.displayInfo.topLeftX + 
                        this.currentChord.restElement.displayInfo.width + 0.5;
                this.currentChord.dotGroup.add(
                    new Renderer.Dot(null,this.currentChord.numDots,this.currentChord.restElement.displayInfo.renderY+0.5));
            }
            
        }
        
    },
    
    //A convenience function
    _contains: function(arr,item) {
        return arr.indexOf(item) != -1;
    },
    
    //A convenience function
    _isOnSpace: function(note) {
        return note.displayInfo.renderY % 1 !== 0;
    },
    
    //And again, this accidentals placement is straight out of Gourlay
    positionAccidentals: function() {
        this.currentChord.sortNotesByPitch(true);
        var startingX = 0;
        var directionOfPass = 1; //Start by going down (pitchwise)
        var considerationSet = []; //All notes that have accidentals
        for (var i = 0; i < this.currentChord.noteGroup.children.length; i++) {
            if (this.currentChord.noteGroup.children[i].accidental !== null) {
                considerationSet.push(this.currentChord.noteGroup.children[i]);
                this.currentChord.noteGroup.children[i].accidentalX = null;
            }
            if (this.currentChord.noteGroup.children[i].displayInfo.renderX < startingX) {
                startingX = this.currentChord.noteGroup.children[i].displayInfo.renderX;
            }
        }
        startingX -= this.firstAccidentalPadding;
        // console.log("startingX is "+startingX);
        // console.log("Logging consideration set.");
        // console.log(considerationSet);
        var lastY = -Infinity;
        var col = 1;
        i = 0;
        //var newWidth = 0;
        //var widest = 0;
        //var nextColWidth = 0;
        //Hardcode column width for simplicity's sake
        //See commented out code above and below for idea of true width algorithm.
        //That code needs to be debugged.
        var colWidth = 1;
        
        while (considerationSet.length > 0) {
            // console.log("Top while. Length of set is "+considerationSet.length);
            while (i >= 0 && i < considerationSet.length) {
                // console.log("    Second level. i is "+ i);
                if (Math.abs(considerationSet[i].displayInfo.renderY - lastY) >= 3 &&
                    !this._isBottomOfUnplacedSecond(considerationSet[i],considerationSet[i-1])) {
                    // console.log("        Condition matched. Placing accidental");
                    lastY = considerationSet[i].displayInfo.renderY;
                    //if (considerationSet[i].accidentalGlyph.width > widest) {
                    //    widest = considerationSet[i].accidentalGlyph.width;
                    //    nextColWidth = widest;
                    //}
                    // console.log("        Setting accidental X to: "+(-(colWidth * col)+startingX));
                    considerationSet[i].accidentalX = -(colWidth * col)-considerationSet[i].displayInfo.renderX+startingX;
                    considerationSet.splice(i, 1);
                }
                i += directionOfPass;
            }
            // console.log("Leaving second level. i is "+ i);
            // console.log("Setting i to lowest pitch.");
            if (considerationSet.length > 0) {
                i = considerationSet.length - 1;
                if (considerationSet[i].accidentalX === null) {
                    directionOfPass = -1;
                } else {
                    directionOfPass = 1;
                }
                // console.log("New directionOfPass is: "+directionOfPass);
                lastY = -Infinity;
                col += 1;
                //newWidth = nextColWidth;
                //widest = 0;
            }
        }
        
        this.currentChord.noteGroup.calculateCurrentMetrics();
    },
    
    //Convenience method for the main conditional in positionAccidentals
    _isBottomOfUnplacedSecond: function(bottom, top) {
        if (!top) { //If the upper note does not exist, then the bottom is not the bottom of a second
            return false;
        }
        if (this._isSecond(bottom,top) && top.accidentalX === null) {
            return true;
        }
        return false;
    },
    
    _isSecond: function(bottom,top) {
        return Math.abs(bottom.displayInfo.renderY - top.displayInfo.renderY) == 0.5;
    },
    
    //Position a chord's articulation
    positionArticulation: function() {
        if (this.currentChord.hasArticulation()) {
            this.currentChord.sortNotesByPitch(true);
            var closestNote = this.stemDirection == 1 ? this.currentChord.noteGroup.children[0] :
                              this.currentChord.noteGroup.children[this.currentChord.noteGroup.children.length-1];
            var multiplier = this.currentChord.stemDirection;
            this.currentChord.articulation.setDirection(this.currentChord.stemDirection);
            var dist;
            if (this.currentChord.articulation.isClose()) {
                if (Math.abs(closestNote.displayInfo.renderY) == 1 || closestNote.displayInfo.renderY == 0) {
                    dist = 1.5;
                } else {
                    dist = 1;
                }
            } else {
                if (Math.abs(closestNote.displayInfo.renderY) <= 1.5) {
                    console.log("In special case. RenderY is "+closestNote.displayInfo.renderY);
                    console.log("dist is "+(Math.abs(3*multiplier-closestNote.displayInfo.renderY)));
                    dist = Math.abs(3*multiplier-closestNote.displayInfo.renderY);
                } else {
                    dist = 1;
                }
            }
            console.log("Setting articulation's renderY to "+(closestNote.displayInfo.renderY));
            this.currentChord.articulation.displayInfo.renderY = closestNote.displayInfo.renderY + dist*multiplier;
            if (this.currentChord.stemDirection == 1) {
                this.currentChord.articulation.displayInfo.renderX = -0.5;
            } else {
                this.currentChord.articulation.displayInfo.renderX = 0.5;
            }
        }
    },
    
    //Calculate the ledger lines
    calculateLedgerLines: function() {
        this.currentChord.sortNotesByPitch(true);
        
        if (this.currentChord.noteGroup.children.length > 1) {
            var highestPicth = this.currentChord.noteGroup.children[0];
            var lowestPitch = this.currentChord.noteGroup.children[this.currentChord.noteGroup.children.length];
        } else {
            console.log("Handling ledger lines for single note");
            var note = this.currentChord.noteGroup.children[0];
            this.currentChord.insideLedgerLines = [];
            if (Math.abs(note.displayInfo.renderY) >= 3) {
                var i = 3*this.currentChord.stemDirection;
                var multiplier = this.currentChord.stemDirection;
                while (Math.abs(i) <= Math.abs(note.displayInfo.renderY)) {
                    this.currentChord.insideLedgerLines.push(i);
                    i += 1*multiplier;
                }
            }
        }

    }
    
    
};

Renderer.MeasureFormatter = function() {
    this.currentMeasure = null;
    this.initialPadding = 1;
    this.padding = 1;
};

Renderer.MeasureFormatter.prototype = {
    format: function(measure) {
        this.currentMeasure = measure;
        var width = this.currentMeasure.displayInfo.width;
        this.currentMeasure.calculateCurrentMetrics();
        this.currentMeasure.displayInfo.width = width;
        
    },
    
    positionChords: function() {
        
        this.calculateK();
        
        var chord;
        var curX = this.initialPadding;
        for (var i = 0; i < this.currentMeasure.children.length; i++) {
            chord = this.currentMeasure.children[i];
            chord.displayInfo.renderX = curX;
            if (chord.duration) {
                console.log("Chord with duration is:");
                console.log(chord);
                curX += this.spaceAfterDuration(chord.getDurationWithDots());
            } else {
                var startNext;
                if (this.currentMeasure.children[i+1]) {
                    var startNext = this.currentMeasure.children[i+1].displayInfo.topLeftX;
                } else {
                    startNext = 0;
                }
                
                curX += chord.displayInfo.width+this.padding+-startNext;
            }
            
        }
        return curX;
    },
    
    //Following Gourlay, implements the ideal width algorithm
    //as in "Spacing a Line of Music" (p. 96).
    spaceAfterDuration: function(duration) {
        return (Math.log(1/duration) / Math.log(2))+this.k;
    },
    
    //The neighborhood constant required by the algorithm above.
    calculateK: function() {
        var shortestNote = Math.max(this.minimumDuration(),8);
        this.k = 2-(Math.log(1/shortestNote) / Math.log(2));
    },
    
    //Return the duration of the shortest note in the measure
    //Note that durations are specified in denominators, so this is
    //actually a max function.
    minimumDuration: function() {
        var max = -Infinity;
        var child;
        for (var i = 0; i < this.currentMeasure.children.length; i++) {
            child = this.currentMeasure.children[i];
            //The first condition checks that the object actually has duration.
            //(E.g. key signatures don't but are still children of measures.)
            if (child.duration && child.duration > max) {
                max = child.duration;
            }
        }
        return max;
    }


};

Renderer.VoiceFormatter = function() {
    this.currentVoice = null;
    this.initialPadding = 1;
    this.padding = 0;
};

Renderer.VoiceFormatter.prototype = {
    format: function(voice) {
        this.currentVoice = voice;
        var finalWidth = this.positionMeasures();
        this.currentVoice.calculateCurrentMetrics();
        this.currentVoice.displayInfo.width = finalWidth;
    },
    
    positionMeasures: function() {
        var measure;
        var curX = this.initialPadding;
        for (var i = 0; i < this.currentVoice.children.length; i++) {
            measure = this.currentVoice.children[i];
            measure.displayInfo.renderX = curX;
            curX += measure.displayInfo.width+this.padding;
        }
        return curX;
    }
};

Renderer.PartFormatter = function(ctx) {
    console.log("Logging ctx");
    console.log(ctx);
    this.currentPart = null;
    this.ctx = ctx;
    this.namePadding = 0.2;
};

Renderer.PartFormatter.prototype = {
    format: function(part) {
        this.currentPart = part;
        //this.formatName();
        this.currentPart.calculateCurrentMetrics();
    },
    
    formatName: function() {
        var metrics = this.ctx.measureText(this.name);
        this.currentPart.name.displayInfo.width = metrics.width;
        this.currentPart.name.displayInfo.height = metrics.height;
        this.currentPart.name.displayInfo.renderX = -this.namePadding;
    }
};


Renderer.ScoreFormatter = function() {
    this.spaceBetweenStaves = 8;
};

Renderer.ScoreFormatter.prototype = {
    format: function(score) {
        this.currentScore = score;
        this.positionParts();
    },
    
    positionParts: function() {
        var part;
        var curY = 0;
        for (var i = 0; i < this.currentScore.children.length; i++) {
            part = this.currentScore.children[i];
            part.displayInfo.renderY = curY;
            curY += this.spaceBetweenStaves;
        }
    }
};

Renderer.SimFormatter = function() {
	this.curNeighborhood = -1;
	this.beatIndex = 0;
	this.sims = [];
	this.nextNeighborhood();
};

Renderer.SimFormatter.prototype = {
	nextNeighborhood: function(neighborhoodRef) {
		console.log("SIMS: Moving to the next neighborhood. Resetting beatIndex.");
		if (this.curNeighborhood >= 0) {
			this.sims[this.curNeighborhood].neighborhoodRefs.push(neighborhoodRef);
		}
		this.curNeighborhood += 1;
		this.beatIndex = 0;
		console.log("SIMS: curNeighborhood is now "+this.curNeighborhood);
		if (!this.sims[this.curNeighborhood]) {
			this.sims[this.curNeighborhood] = {
				neighborhoodRefs: [],
				shortestDuration: Infinity,
				sims: [],
				width: 0
			};
		}
	},
	
	addChordSim: function(chord) {
		console.log("SIMS: Adding chord sim to "+this.curNeighborhood+" at "+this.beatIndex);
		this.linearInsertSim({
			noteRef: chord,
			usedUp: 0
		});
		this.beatIndex += 1/chord.getDurationWithDots(); 
		console.log("SIMS: Augmenting beatIndex to "+this.beatIndex);
	},
	
	newVoice: function() {
		console.log("SIMS: Entering a new voice.");
		this.curNeighborhood = 0;
	},
	
	linearInsertSim: function(sim) {
		var i = 0;
		var neighborhood = this.sims[this.curNeighborhood];
		while (i < neighborhood.sims.length && neighborhood.sims[i].beatIndex < this.beatIndex) {
			i++;
		}
		if (i == neighborhood.sims.length || neighborhood.sims[i].beatIndex > this.beatIndex) {
			neighborhood.sims.splice(i,0,{
				beatIndex: this.beatIndex,
				listOfNotes: [],
				spaceAfterSim: 0
			});
		} 
		neighborhood.sims[i].listOfNotes.push(sim);
		if (1/sim.noteRef.duration < neighborhood.shortestDuration) {
			neighborhood.shortestDuration = 1/sim.noteRef.duration;
		}
	},
	
	format: function() {
		console.log("SIMS: formatting sims.");
		//First, remove the last neighborhood, which is empty and only
		//exists as a byproduct of the last nextNeighborhood() call.
		this.sims.pop();
		
		var i,j,h;
		var k;
		var neighborhood;
		for (i = 0; i < this.sims.length; i++) {
			var curX = 1;
			console.log("SIMS: formatting neighborhood "+i);
			neighborhood = this.sims[i];
			k = this.calculateK(neighborhood);
			console.log("SIMS: k is "+k);
			for (j = 0; j < neighborhood.sims.length; j++) {
				var nextSim = null;
				if (j < neighborhood.sims.length-1) {//i.e. if there is a next sim
					nextSim = neighborhood.sims[j+1];
				}
				var sim = neighborhood.sims[j];
				var notes = sim.listOfNotes;
				console.log("SIMS: formatting sim "+j);
				var shortest = 1/this.minimumDuration(notes);
				console.log("SIMS: shortest duration for this sim is "+shortest);
				var fraction;
				if (nextSim) {
					fraction = (nextSim.beatIndex - sim.beatIndex)/shortest;
				} else {
					fraction = 1;
				}
				console.log("SIMS: fraction is "+fraction);
				sim.spaceAfterSim = fraction*this.spaceAfterDuration(shortest,k);
				for (var h = 0; h < notes.length; h++) {
					var note = notes[h];
					
					if (note.usedUp == 0) {
						note.noteRef.displayInfo.renderX = curX;
					}
					
					var usedUp;
					if (nextSim) {
						usedUp = note.usedUp+(nextSim.beatIndex - sim.beatIndex);
						console.log("SIMS: Used up for "+note.noteRef.id+" is "+usedUp);
						if (usedUp != 1/note.noteRef.getDurationWithDots()) {
							console.log("SIMS: Pushing "+note.noteRef.id+" to next sim with usedUp of "+usedUp);
							nextSim.listOfNotes.push({
								noteRef: note.noteRef,
								usedUp: usedUp
							});
						}
					}
	
				}
				curX += sim.spaceAfterSim;
			}
			var neighborhoodRef;
			for (j = 0; j < neighborhood.neighborhoodRefs.length; j++) {
				neighborhoodRef = neighborhood.neighborhoodRefs[j];
				neighborhoodRef.calculateCurrentMetrics();
		        neighborhoodRef.displayInfo.width = curX+1 < 4 ? 4 : curX+1;
				neighborhood.width = curX+1;
			}
			
		}
	},
	
	//Following Gourlay, implements the ideal width algorithm
    //described in "Spacing a Line of Music" (p. 96).
    spaceAfterDuration: function(duration,k) {
        return (Math.log(duration) / Math.log(2))+k;
    },
    
    //The neighborhood constant required by the algorithm above.
    calculateK: function(neighborhood) {
        shortestNote = Math.min(neighborhood.shortestDuration,0.125);
        return 2-(Math.log(shortestNote) / Math.log(2));
    },
    
    //Return the duration of the shortest note in the sim
    //Note that durations are specified in denominators, so this is
    //actually a max function.
    minimumDuration: function(notes) {
        var max = -Infinity;
        var chord;
        for (var i = 0; i < notes.length; i++) {
            chord = notes[i].noteRef;
            if (chord.getDurationWithDots() > max) {
                max = chord.getDurationWithDots();
            }
        }
        return max;
    },
	
	reset: function() {
		this.curNeighborhood = 0;
		this.beatIndex = 0;
		this.sims = [];
	},
	
	logSims: function() {
		console.log("Logging sims.");
		console.log(this.sims);
	}
};
