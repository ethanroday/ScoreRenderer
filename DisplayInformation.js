/**
 * Contains information about the metrics of the object to which it belongs.
 * Properties:
 *  - topLeft: A point containing the coordinates of the top left corner of the
 *    object relative to its own origin.
 *  - width: The width of the object
 *  - height: The height of the object
 *  - controlPoint: The point from which to position this object. May be one of:
 *     - origin
 *     - topLeft
 *     - leftEdge
 *     - bottomLeft
 *     - bottomEdge
 *     - bottomRight
 *     - rightEdge
 *     - topRight
 *     - topEdge
 *  - render: The position of the control point relative to the object's parent
 * Control point and render are slightly confusing, so here they are in a
 * sentence: "I want the parent to place the bottom left corner (control point) 
 * of this object at {1,5} (render) relative to the parent."
 **/

Renderer.DisplayInformation = function() {
    this._topLeft = {x:0,y:0};
    this._width = 0;
    this._height = 0;
    this._controlPoint = 'origin';
    this._render = {x:0,y:0};
};

Renderer.DisplayInformation.prototype = {
    
    //Return the relative render coordinates of the object's origin
    //in real units (i.e. adjusted for horizontal and vertical scale).
    //Includes the necessary transformation from the object's control point.
    getRealRender: function() {
        return this._getRealRenderForControlPoint(this.controlPoint);
    },
    
    //Return the relative render coordinates of the object's origin
    //in 1-to-1 units (i.e. not adjusted for horizontal and vertical scale).
    //Includes the necessary transformation from the object's control point.
    getRender: function() {
        return this._getRenderForControlPoint(this.controlPoint);
    },
    
    //Return the minX, maxX, minY, maxY of the object in 1-to-1 units (i.e.
    //not adjusted for horizontal and vertical scale).
    //Includes the necessary transformation from the object's control point.
    getRenderExtrema: function() {
        var render = this._getRenderForControlPoint(this.controlPoint);
        return {
            minX:render.x+this._topLeft.x,
            minY:render.y+this._topLeft.y,
            maxX:render.x+this._topLeft.x+this._width,
            maxY:render.y+this._topLeft.y+this._height
        };
    },
    
    //Return the minX, maxX, minY, maxY of the object in real units (i.e.
    //adjusted for horizontal and vertical scale).
    //Includes the necessary transformation from the object's control point.
    getRealRenderExtrema: function() {
        var render = this._getRealRenderForControlPoint(this.controlPoint);
        return {
            minX:render.x+this._topLeft.x,
            minY:render.y+this._topLeft.y,
            maxX:render.x+this._topLeft.x+this._width,
            maxY:render.y+this._topLeft.y+this._height
        };
    },
    
    //Return the relative render coordinates of the object's origin
    //in real units (i.e. adjusted for horizontal and vertical scale).
    //Includes the necessary transformation from the given control point.
    //Params:
    // cp: the control point from which to transform
    _getRealRenderForControlPoint: function(cp) {
        return this._getRealRenderForCoords(this._getRenderForControlPoint(cp));
    },
    
    //Tranform the given 1-to-1 coordinates to scale-adjusted coordinates
    //Params:
    // coords:
    //  x: the x coordinate in 1-to-1 units
    //  y: the y coordinate in 1-to-1 units
    _getRealRenderForCoords: function(coords) {
        var horiz = Renderer.HORIZ_MULTIPLIER;
        var vert = Renderer.VERT_MULTIPLIER;
        coords.x *= horiz;
        coords.y *= vert;
        return coords;
    },
    
    //Return the relative render coordinates of the object's origin
    //in 1-to-1 units (i.e. not adjusted for horizontal and vertical scale).
    //Params:
    // cp: the control point from which to transform
    _getRenderForControlPoint: function(controlPoint) {
        var t = this._getTransformation(controlPoint).call(this);
        return {
            x:this._render.x+t.x,
            y:this._render.y+t.y
        };
    },
    
    //Return the transformation from the given control point.
    _getTransformation: function(controlPoint) {
        return this.transformations[controlPoint];
    },
    
    transformations: {
        'origin': function() {
            return {x:0,y:0};
        },
        'topLeft': function() {
            return {x:-this._topLeft.x,y:-this._topLeft.y};
        },
        'leftEdge': function() {
            return {x:-this._topLeft.x,y:0};
        },
        'bottomLeft': function() {
            return {x:-this._topLeft.x,y:this._height+this._topLeft.y};
        },
        'bottomEdge': function() {
            return {x:0,y:this._height+this._topLeft.y};
        },
        'bottomRight': function() {
            return {x:this._width+this._topLeft.x,y:this._height+this._topLeft.y};
        },
        'rightEdge': function() {
            return {x:this._width+this._topLeft.x,y:0};
        },
        'topRight': function() {
            return {x:this._width+this._topLeft.x,y:-this._topLeft.y};
        },
        'topEdge': function() {
            return {x:0,y:-this._topLeft.y};
        }
    }

};

Object.defineProperty(Renderer.DisplayInformation.prototype,"topLeftX", {
    get: function() {
        return this._topLeft.x;
    },
    set: function(x) {
        this._topLeft.x = x;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"topLeftY", {
    get: function() {
        return this._topLeft.y;
    },
    set: function(y) {
        this._topLeft.y = y;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"width", {
    get: function() {
        return this._width;
    },
    set: function(newWidth) {
        this._width = newWidth;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"height", {
    get: function() {
        return this._height;
    },
    set: function(newHeight) {
        this._height = newHeight;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"controlPoint", {
    get: function() {
        return this._controlPoint;
    },
    set: function(cp) {
        this._controlPoint = cp;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"renderX", {
    get: function() {
        return this._render.x;
    },
    set: function(x) {
        this._render.x = x;
    }
});

Object.defineProperty(Renderer.DisplayInformation.prototype,"renderY", {
    get: function() {
        return this._render.y;
    },
    set: function(y) {
        this._render.y = y;
    }
});