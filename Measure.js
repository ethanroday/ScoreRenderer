Renderer.Measure = function(id,measureNumber) {
    Renderer.ScoreComposite.call(this,id);
    this.measureNumber = measureNumber;
    this.displayInfo.controlPoint = 'origin';
    this.stretchability = 1;
    this.shrinkability = 0.5;
};

Renderer.Measure.prototype = new Renderer.ScoreComposite();
Renderer.Measure.prototype.constructor = Renderer.Measure;

Renderer.Measure.prototype.accept = function(formatter) {
    formatter.formatMeasure(this);
};

Renderer.Measure.prototype.generateSims = function(simFormatter) {
	simFormatter.nextNeighborhood(this);
},

Renderer.Measure.prototype.myDraw = function(ctx,x,y) {
	ctx.save();
    ctx.strokeStyle = "#F00";
    ctx.restore();
    this.drawBarLine(ctx,x+this.displayInfo.width,y);
};

Renderer.Measure.calculateMyMetrics = function() {
};

Renderer.Measure.prototype.drawBarLine = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);
    Renderer.LineContext.drawBlackLine(ctx,0,-2,0,2);
    ctx.restore();
};

Renderer.Measure.prototype.update = function(measureNumber) {
    this.measureNumber = measureNumber;
};