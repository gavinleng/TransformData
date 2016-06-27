/*
 * Created by G on 25/04/2016.
 */


"use strict";

module.exports = exports =  function(d) {
	var i, _x, _y;

	var num = d.length;
	
	if (num === 0) {
		throw new Error('It is an empty data set!');
	}

	var x_sum = 0;
	var y_sum = 0;
	var xx_sum = 0;
	var xy_sum = 0;

	for (i = 0; i < num; i++) {
		x_sum += d[i].x;
		y_sum += d[i].y;
		xx_sum += d[i].x * d[i].x;
		xy_sum += d[i].x * d[i].y;
	}
	
	/*get  y = a + b * x  */
	var b = (num * xy_sum - x_sum * y_sum) / (num * xx_sum - x_sum * x_sum);
	var a = (y_sum / num) - (b * x_sum) / num;
	
	var data = [];
	
	for (i = 0; i < num; i++) {
		_x = d[i].x;
		_y = _x * b + a;
		
		data.push({"x": _x, "y": _y});
	}
	
	data = [data, a, b];
	
	return data;
};
