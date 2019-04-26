// helper functions	
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}			

// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};