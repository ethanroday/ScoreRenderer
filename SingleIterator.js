//**
//An iterator that returns the passed object once and only once.
//Leaves in a composite pattern use this iterator.
//**

SingleIterator = function(obj) {
    this.object = obj;
    this.done = false;
};

SingleIterator.prototype = {
    
    next: function() {
        if (!this.done) {
            this.done = true;
            return this.object;
        } else {
            return null;
        }
    },
    
    hasNext: function() {
        return this.done;
    }
};