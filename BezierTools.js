Renderer.BezierTools = (function() {
    
    //Find the max and min in one dimension of a parametric quadratic
    //Bezier curve. Takes all x coords or all y coords
    //u: x/y coord of the start point
    //v: x/y coord of the control point
    //w: x/y coord of the end point
    function quadraticBounds(u,v,w) {
        console.log("In here with "+u+","+v+","+w);
        var max = Math.max(u,w);
        var min = Math.min(u,w);
        if (v > min && v < max) {
            return {min:u,max:w};
        } else {
            var bound = quadraticBound(u,v,w);
            if (v < u) {
                return {min:bound,max:w};
            } else {
                return {min:u,max:bound};
            }
        }
    }
    
    //Find the bound in one dimension of a parametric quadradic
    //Bezier curve. Takes all x coords or all y coords
    //Params:
    //u: x/y coord of the start point
    //v: x/y coord of the control point
    //w: x/y coord of the end point
    function quadraticBound(u,v,w) {
        var t = ((u-v) / (u-2*v+w));
        return u*Math.pow((1-t),2) + 2*v*(1-t)*t + w*Math.pow(t,2);
    }
    
    //Find the max and min in one dimension of a parametric cubic
    //Bezier curve. Takes all x coords or all y coords
    //p: x/y coord of the start point
    //q: x/y coord of the first control point
    //r: x/y coord of the second control point
    //s: x/y coord of the end point
    function cubicBounds(p,q,r,s) {
        var min = Math.min(p,s);
        var max = Math.max(p,s);
    
        if (q > min && q < max && r > min && r < max) {
            return {min: p, max: s};
        } else {
            var a = q - p;
            var b = r - q;
            var c = s - r;
            
            // Do we have a problematic discriminator if we use these values?
            // If we do, because we're computing at sub-pixel level anyway, simply salt 'b' a tiny bit.
            if (a + c != 2*b) { b+=0.01; }
      
            var numerator = 2*(a - b);
            var denominator = 2*(a - 2*b + c);
            var quadroot = (2*b-2*a)*(2*b-2*a) - 2*a*denominator;
            var root = Math.sqrt(quadroot);
      
            // there are two possible values for 't' that yield inflection points,
            // and each of these inflection points might be outside the linear bounds
            var t1 =  (numerator + root) / denominator;
            var t2 =  (numerator - root) / denominator;
            
            if (0 < t1 && t1 < 1) {
                var bezierVal = calculateCubicBezierValue(t1,p,q,r,s);
                if (bezierVal > max) {
                    max = bezierVal;
                } else if (bezierVal < min) {
                    min = bezierVal;
                }
            }
            if (0 < t2 && t2 < 1) {
                var bezierVal = calculateCubicBezierValue(t2,p,q,r,s);
                if (bezierVal > max) {
                    max = bezierVal;
                } else if (bezierVal < min) {
                    min = bezierVal;
                }
            }
            
            return {min:min,max:max};
        }
    }
    
    //Calculate the value of one dimension of a bezier curve given 'distance' t
    //and x/y coords a,b,c,d
    function calculateCubicBezierValue(t,a,b,c,d) {
        var mt = 1-t;
        return Math.pow(mt,3)*a + Math.pow(mt,2)*3*t*b + Math.pow(t,2)*3*mt*c + Math.pow(t,3)*d;
    }
    
    return {
        quadraticBoundingBox: function(a,b,c,d,e,f) {
            var xBounds = quadraticBounds(a,c,e);
            var yBounds = quadraticBounds(b,d,f);
            return {
                topLeft: {x:xBounds.min,y:yBounds.min},
                width: xBounds.max-xBounds.min,
                height: yBounds.max-yBounds.min
            };
        },
        cubicBoundingBox: function(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
            var xBounds = cubicBounds(x1,cx1,cx2,x2);
            var yBounds = cubicBounds(y1,cy1,cy2,y2);
            
            return {
                topLeft: {x:xBounds.min,y:yBounds.min},
                width: xBounds.max-xBounds.min,
                height: yBounds.max-yBounds.min
            };
        }
    };
})();