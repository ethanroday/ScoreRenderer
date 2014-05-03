var TouchManager = function(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    //Add a touch event listener to the canvas
    var me = this;
    canvas.addEventListener('touchstart', function(e) {
        me.handleTouchstart(e);
    }, false);

};

TouchManager.prototype = {
    
    handleTouchstart: function(e) {
        var coords = this.getRelativeCoords(e);
        console.log("coords.x: "+coords.x);
        console.log("coords.y: "+coords.y);
    },
    
    //Return the coordinates of a touch event relative to this
    //manager's canvas object
    getRelativeCoords: function(e) {
        if (e.targetTouches.length == 1) { //Only handle one finger touch for now
            var touch = event.targetTouches[0];
            var totalOffsetX = 0;
            var totalOffsetY = 0;
            var relX = 0;
            var relY = 0;
            var currentElement = this.canvas;
        
            //Calculate the offset relative to parent elements
            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
            } while(currentElement = currentElement.offsetParent);
        
            relX = touch.pageX - totalOffsetX;
            relY = touch.pageY - totalOffsetY;
            
            return {x:relX, y:relY};
        } else {
            console.log("Not currently supporting multiple touches.");
        }
        
    },
    
    addHandler: function(eventType,handler) {
        this.canvas.addEventListener(eventType,handler,false);
    },
    
    removeHandler: function(eventType,handler) {
        this.canvas.removeEventListener(eventType,handler,false);
    }
    
};