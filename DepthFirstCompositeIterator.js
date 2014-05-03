//**
//An iterator for composite object graphs. Performs an incremental
//depth-first search on the tree.
//**

var DepthFirstCompositeIterator = function(component) {
    this.order = new Array();
    this._process(component);
};

DepthFirstCompositeIterator.prototype = {
    
    next: function() {
        if (this.hasNext()) {
            return this.order.shift();
        } else {
            return null;
        }
    },
    
    hasNext: function() {
        if (this.order.length == 0) {
            return false;
        } else {
            return true;
        }
    },
    
    //Utility method for specifying the iterator's ordering
    _process: function(component) {
        if (component.children) {
            for (var i = 0; i < component.children.length; i++) {
                this._process(component.children[i]);
            }
        }
        this.order.push(component);
    }
    
};