Renderer.Rest = function(id,duration,numDots) {
    Renderer.ScoreComposite.call(this,id);
    this.id = id;
    this.duration = duration;
    this.numDots = numDots;
    this.add(new Renderer.RestElement(null,duration));
    this._restElementIndex = 0;
    if (numDots) {
        this.add(new Renderer.DotGroup(numDots));
        this._dotGroupIndex = 1;
    }
};

Renderer.Rest.prototype = new Renderer.ScoreComposite();
Renderer.Rest.prototype.constructor = Renderer.Rest;

Renderer.Rest.prototype.getDurationWithDots = function() {
    var d = this.duration;
    for (var i = 0; i < this.numDots; i++) {
        d /= 1.5;
    }
    return d;
};

Renderer.Rest.prototype.accept = function(formatter) {
    formatter.formatChord(this);
};

Object.defineProperty(Renderer.Rest.prototype,"restElement", {
    get: function() {
        return this.children[this._restElementIndex];
    },
    set: function(restElement) {
        this.children[this._restElementIndex] = restElement;
    }
});

Object.defineProperty(Renderer.Rest.prototype,"dotGroup", {
    get: function() {
        return this.children[this._dotGroupIndex];
    },
    set: function(dotGroup) {
        this.children[this._dotGroupIndex] = dotGroup;
    }
});