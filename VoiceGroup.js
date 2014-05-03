Renderer.VoiceGroup = function(id) {
    Renderer.ScoreComposite.call(this,id);
};

Renderer.VoiceGroup.prototype = new Renderer.ScoreComposite();
Renderer.VoiceGroup.prototype.constructor = Renderer.VoiceGroup;