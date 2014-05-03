Renderer.Voice = function(id) {
    Renderer.ScoreComposite.call(this,id);
};

Renderer.Voice.prototype = new Renderer.ScoreComposite();
Renderer.Voice.prototype.constructor = Renderer.Voice;

Renderer.Voice.prototype.myDraw = function(ctx,x,y) {
    this.drawStaffLines(ctx,x,y);
};

Renderer.Voice.prototype.calculateMyMetrics = function() {
    return {
        minX: 0,
        maxX: 0,
        minY: -2,
        maxY: 2
    };
}
;
Renderer.Voice.prototype.accept = function(formatter) {
    formatter.formatVoice(this);
};

Renderer.Voice.prototype.drawStaffLines = function(ctx,x,y) {
    ctx.save();
    ctx.translate(x,y);
    ctx.strokeStyle = 'black';
    ctx.strokeWidth = 1;
    ctx.beginPath();
    for (var i = -2; i < 3; i++) {
        this._drawStaffLine(ctx,0,-i,this.displayInfo.width);
    }
    ctx.stroke();
    ctx.restore();
};
    
Renderer.Voice.prototype._drawStaffLine = function(ctx,x,y,width) {
    // console.log("line to "+(x+width)+" "+y);
    Renderer.LineContext.moveTo(ctx,x,y);
    Renderer.LineContext.lineTo(ctx,x+width,y);
};

Renderer.Voice.prototype.update = function() {
    
};