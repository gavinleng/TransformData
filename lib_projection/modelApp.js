/*
 * Created by G on 26/04/2016.
 */


"use strict";

var fs = require('fs');

module.exports = exports =  function(config, d, flag) {
	var i, j, _xProjection, _data, _ijson;
	var data = [];
	var jj = 0;
	
	//get config
	var xProjection = config.xLable;
	var outPath = config.outPath;

	var lenXProjection = xProjection.length;
	
	var lenData = d.length;

	for (i = 0; i < lenData; i++) {
		for (j = 0; j < lenXProjection; j++) {
			_ijson = {};
			_xProjection = +xProjection[j];

			_data = +d[i].modelParameter[0] + _xProjection * (+d[i].modelParameter[1]);

			if (_data <= 0) _data = 0;

			_ijson.popId_description = '';
			_ijson.age_band = d[i].age_band;
			_ijson.popId = 'NQM-LSOA-Pop-Projection-2015TO2026';
			_ijson.gender = d[i].gender;
			_ijson.area_id = d[i].area_id;
			_ijson.area_name = d[i].area_name;
			_ijson.year = "" + _xProjection;
			_ijson.persons = +_data.toFixed(2);

			data.push(_ijson);
			jj++;
			
			if (flag == 1) {
				if ((i >= lenData - 1) && (j >= lenXProjection - 1)) {
					data = JSON.stringify(data).slice(1, -1);
					data = data + '\n]}\n';

					fs.appendFileSync(outPath, data);
				} else {
					if (jj % 1000 == 0) {
						data = JSON.stringify(data).slice(1, -1);
						data = data + ',\n';

						fs.appendFileSync(outPath, data);
						
						data = [];
					}
				}
			} else {
				if ((i >= lenData - 1) && (j >= lenXProjection - 1)) {
					data = JSON.stringify(data).slice(1, -1);
					data = data + ',\n';

					fs.appendFileSync(outPath, data);
				} else {
					if (jj % 1000 == 0) {
						data = JSON.stringify(data).slice(1, -1);
						data = data + ',\n';

						fs.appendFileSync(outPath, data);
						
						data = [];
					}
				}
			}
		}
	}
};
