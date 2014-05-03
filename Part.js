/**
 * Part is a specialized subclass of ScoreComposite. It must contain a
 * VoiceGroup and may contain a name.
 * Under the hood, the VoiceGroup is at index 0 and the name is at index 1.
 */

Renderer.Part = function(id,name) {
    Renderer.ScoreComposite.call(this,id);
    this.controlPoint = 'topLeft';
    
    this.add(new Renderer.VoiceGroup(null));
    if (name) {
        //this.add(new Renderer.Text(null,name));
    }
};

Renderer.Part.prototype = new Renderer.ScoreComposite();
Renderer.Part.prototype.constructor = Renderer.Part;

Renderer.Part.prototype.addVoice = function(voice) {
    this.voiceGroup.add(voice);
};

Renderer.Part.prototype.update = function(name) {
    this.name = name;
};

Renderer.Part.prototype.accept = function(formatter) {
    formatter.formatPart(this);
};

Object.defineProperty(Renderer.Part.prototype,"voiceGroup", {
    get: function() {
        return this.children[0];
    },
    set: function(voiceGroup) {
        this.children[0] = voiceGroup;
    }
});

Object.defineProperty(Renderer.Part.prototype,"name", {
    get: function() {
        //return this.children[1];
    },
    set: function(name) {
        //this.children[1] = new Renderer.Text(null,name);
    }
});