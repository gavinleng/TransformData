/*
 * Created by G on 25/04/2016.
 */


var popProjection = require('./popProjection.js');

//get population projection model data
var popProjectionData = popProjection();

if (popProjectionData){
	console.log('LSOA population projection data set is saved.');
}
