# line-graphs
An SVG and JavaScript line graph for displaying one or more sets of data.

Takes one or more json data files to display or compare on the same graph.
The data structure should be the same for each file: <br />
 either an array of objects with x and y values <br />
 or an array of arrays of length 2 ( x and y coords ).<br />
 (see the example data files in the data directory). <br />
 
 Labels, x and y markers / steps, colors, graph size, grid lines, graph type (curved  / straight line) are all configurable so the graph can be adapted to many forms of data sets. <br />

6 colors are pre-set. More can easily be added if needed. They don't need to be removed if they're not needed. <br />
The min and max values are taken as the min and max values of all included datasets together.<br />
If the x values are not convertible to numbers, they will be taken literally as strings and the markers set using the indexes. <br />
ie. for x values of : jan, feb, mar, apr, may ...<br />
these values will appear literally - xSteps should be set to 1 (all values), 2, or 3 (for quarters) - whatever is preferred. <br />
y values are always numbers. <br />
If it is the case that the x values are literal strings - the last set of data's x values will over-ride all previous sets if there is a variation. <br />

Steps need to be manually adjusted to suit: <br />
If no markers or values appear - then the steps are probably way too large and should be reduced to match what is expected. <br />
ie. If your max y value expected is 50 - set the ySteps to 5 or 10. If 5000, try 500 etc. <br />
If the values are so close together they are unreadable - they need to be thinned out - ie. if you have steps of 10 - try 100...
