/**
 * Define the package name.
 */
 
var Renderer = {};

/**
 * Define global constants.
 */
 
//The fundamental unit for the renderer is notehead width. These two constants
//convert the size of the horizontal and vertical units with respect to
//notehead width.

//Horizontal unit is 1 notehead width
Renderer.HORIZ_MULTIPLIER = 1;
//Vertical unit is 1 notehead height (approx 0.85 notehead widths)
Renderer.VERT_MULTIPLIER = 0.85;