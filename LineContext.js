Renderer.LineContext = (function() {

    var vertScale = 1;
    var horizScale = 1;

    return {
        
        setVertScale: function(scale) {
            vertScale = scale;
        },
        
        setHorizScale: function(scale) {
            horizScale = scale;
        },
        
        lineTo: function(ctx,x,y) {
            ctx.lineTo(x*horizScale,y*vertScale);
        },
        moveTo: function(ctx,x,y) {
            ctx.moveTo(x*horizScale,y*vertScale);
        },
        drawBlackLine: function(ctx,fromX,fromY,toX,toY) {
            ctx.save();
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            this.moveTo(ctx,fromX,fromY);
            this.lineTo(ctx,toX,toY);
            ctx.stroke();
            ctx.restore();
        }
    };
})();

