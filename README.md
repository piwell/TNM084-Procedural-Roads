TNM084-Procedural-roads

What is this?
This is a procedural road network generation project, mostly inspired by Parish and Müller's paper: Procedural Modelling of Cities (2001) (https://graphics.ethz.ch/Downloads/Publications/Papers/2001/p_Par01.pdf)


What is happening?
First two maps are created with a simplex noise function. One water map (the blue areas, where roads can not be created) and the population density map (the green to brown areas. Greener means denser population).

Then highways and roads are created. They are created one segment at a time. A global goals function suggests new segments based on some rules. Based on the rules a value for that segment is created, if it is over a specified threshold, that segments is suggested. All the suggested segments then pass a local constraints function. This function checks if the segments is valid. If it is not valid the function can alter the segment to make it valid (prune and/or rotate it). Then it checks if the segment intersects another one (and then prune it) or if there is an other intersection nearby to connect to.

The highways are meant to connect the densest population areas to each other. They start in the densest point of the map and its only rule is based on population density.This will make it search for other dense areas. They can be created over water (to create "bridges").

From the highways the roads are created. Their rules are based on population density and angle from parent segment. This implementation only uses a "New York" based rule which means that it favors 0 and 90 degree angles.