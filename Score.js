Renderer.Score = function(id) {
    Renderer.ScoreComposite.call(this,id);
};

Renderer.Score.prototype = new Renderer.ScoreComposite();
Renderer.Score.prototype.constructor = Renderer.Score;

Renderer.Score.prototype.accept = function(formatter) {
    formatter.formatScore(this);
};