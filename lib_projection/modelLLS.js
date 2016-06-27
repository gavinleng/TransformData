/*
 * Created by G on 26/04/2016.
 */


"use strict";

var fs = require('fs');
var urlDataGet = require("../lib/urlDataGet.js");
var nqmLLS = require('../lib/nqmLLS.js');

module.exports = exports =  function(config) {
	var i, ii, j, k, kk, _lsoa, _agegroup, _xlable, _parameter, _data, _idata, _ijson, _filter, sampleData, lenSampleData, ssampleData, _lenLsoa, _lsoas, _lsoad;
	var data = [];
	var jj = 0;

	var lsoaS = 0;
	var lsoaStep = 1000;
	
	//get config
	var inPath = config.inPath;
	var xLable = config.xLable;
	var keyFields = config.keyFields;
	var gender = config.gender;
	var outPath = config.outPath;
	
	//get LSOA and age group array data
	var _url = inPath[0].split('?')[0].slice(0, -4) + 'distinct?key=' + keyFields[0];
	var lsoaArray = urlDataGet(_url).data;
	var lenLsoaArray = lsoaArray.length;
	//var lenLsoaArray = 200;

	_url = inPath[0].split('?')[0].slice(0, -4) + 'distinct?key=' + keyFields[1];
	var agArray = urlDataGet(_url).data;
	var lenAgArray = agArray.length;
	var lenGender = gender.length;

	var lenData = inPath.length;

	var dkey = ["year", "persons"];

	var jsonkeys = '{"data":[\n';
	fs.writeFile(outPath, jsonkeys, function (err) {
		if (err) throw err;
		console.log('JSONKeys have been saved!');
	});

	var modelData = [];
	while (1) {
		_lsoa = lsoaArray.slice(lsoaS, lsoaS + lsoaStep);
		lsoaS = lsoaS + lsoaStep;
		_lenLsoa = _lsoa.length;

		_lsoad = [];
		for (i = 0; i < _lenLsoa; i++) {
			_lsoad.push('"' + _lsoa[i] + '"');
		}

		sampleData = [];
		for (k = 0; k < lenData; k++) {
			_filter = '&filter={"area_id":{"$in":[' + _lsoad + ']}}';
			_url = inPath[k] + _filter;

			sampleData[k] = urlDataGet(_url).data;
		}

		for (i = 0; i < _lenLsoa; i++) {
			console.log(lsoaS, i);
			_lsoas = _lsoa[i];
			for (ii = 0; ii < lenGender; ii++) {
				for (j = 0; j < lenAgArray; j++) {
					_agegroup = agArray[j];

					_data = [];
					for (k = 0; k < lenData; k++) {
						_xlable = +xLable[k];
						lenSampleData = sampleData[k].length;

						for (kk = 0; kk < lenSampleData; kk++) {
							if ((sampleData[k][kk].age_band == _agegroup) && (sampleData[k][kk].gender == gender[ii])  && (sampleData[k][kk].area_id == _lsoas)) {
								ssampleData = sampleData[k][kk];
								_idata = ssampleData.persons;

								if (!isNaN(_idata)) {
									_data.push({"x": _xlable, "y": _idata});
								}

								sampleData[k].splice(kk, 1);

								break;
							}
						}
					}


					if (_data.length > 1) {
						_parameter = nqmLLS(_data);

						_ijson = ssampleData;
						delete _ijson[dkey[0]];
						delete _ijson[dkey[1]];
						_ijson.modelParameter = [_parameter[1], _parameter[2]];
						modelData.push(_ijson);

						data.push(_ijson);
						jj++;

						if ((lsoaS >= lenLsoaArray - 1) && (i >= _lenLsoa - 1) && (ii >= lenGender - 1) && (j >= lenAgArray - 1)) {
							data = JSON.stringify(data).slice(1, -1);
							data = data + '\n]}\n';
							fs.appendFile(outPath, data, function (err) {
								if (err) throw err;

								console.log('Json file is finished!');
							});
						} else {
							if ( jj % 1000 == 0) {
								data = JSON.stringify(data).slice(1, -1);
								data = data + ',\n';
								fs.appendFile(outPath, data, function (err) {
									if (err) throw err;
								});

								data = [];
							}
						}
					}
				}
			}
		}

		if (lsoaS >= lenLsoaArray - 1) break;
	}

	return modelData;
};
