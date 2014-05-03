//**
//An iterator for composite object graphs. Performs an incremental
//breadth-first search on the tree.
//**

var BreadthFirstCompositeIterator = function(component) {
    this.queue = new Array();
    this.queue.push(component);
};

BreadthFirstCompositeIterator.prototype = {
    
    next: function() {
        if (this.hasNext()) {
            var curComponent = this.queue.shift();
            if (curComponent.children) {
                for (var i = 0; i < curComponent.children.length; i++) {
                    this.queue.push(curComponent.children[i]);
                }
            }
            return curComponent;
        } else {
            return null;
        }
    },
    
    hasNext: function() {
        if (this.queue.length == 0) {
            return false;
        } else {
            return true;
        }
    }
    
};