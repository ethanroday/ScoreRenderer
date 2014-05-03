Renderer.NoteGroup = function(id) {
    Renderer.ScoreComposite.call(this,id);
};

Renderer.NoteGroup.prototype = new Renderer.ScoreComposite();
Renderer.NoteGroup.prototype.constructor = Renderer.NoteGroup;