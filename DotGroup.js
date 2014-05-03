Renderer.DotGroup = function(id) {
    Renderer.ScoreComposite.call(this,id);
    this.displayInfo.controlPoint = 'leftEdge';
};

Renderer.DotGroup.prototype = new Renderer.ScoreComposite();
Renderer.DotGroup.prototype.constructor = Renderer.DotGroup;