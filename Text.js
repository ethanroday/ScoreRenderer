Renderer.Text = function(id,text) {
    Renderer.ScoreLeaf.call(this,id);
    this.id = id;
    this.text = text;
};

Renderer.Text.prototype = new Renderer.ScoreLeaf();
Renderer.Text.prototype.constructor = Renderer.Text;

//As a special subclass of ScoreLeaf, Text overrides
//its parent draw method.
Renderer.Text.prototype.draw = function(ctx,x,y) {
    var realRender = this.displayInfo.getRealRender();
    x = x+realRender.x;
    y = y+realRender.y;
    console.log("Filling text at "+x+","+y);
    //ctx.textAlign="end";
    ctx.textBaseline="middle"; 
    ctx.fillText(this.text,x,y);
};