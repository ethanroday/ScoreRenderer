var ScoreDisplay = function(canvas,svg,scale,xPadding,yPadding) {
    this.touchManager = new TouchManager(canvas);
    this.ctx = canvas.getContext('2d');
    this.renderer = new Renderer.ScoreRenderer(this,scale,xPadding,yPadding);
    this.cursor = new ScoreCursor(svg,scale,xPadding,yPadding);
    
    this.scoreComponent = null;
    this.canvas = canvas;
};

ScoreDisplay.prototype = {
    
    updateScore: function(newScore) {
        console.log("In updateScore");
        this.scoreComponent = newScore;
        this.cursor.score = newScore;
    },
    
    format: function() {
        console.log("Formatting. Cursor's score is ");
        console.log(this.cursor.score);
        this.renderer.format();
        this.cursor.update();
    },
    
    render: function() {
        this.renderer.render();
    },
    
    formatAndRender: function() {
        this.format();
        this.renderer.render();
    },
    
    updateAndRender: function(newScore) {
        this.updateScore(newScore);
        this.formatAndRender();
    }
    
};