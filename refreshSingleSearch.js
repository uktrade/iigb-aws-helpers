var sys = require('util');
var exec = require('child_process').exec;
var AWS = require('aws-sdk');
var fileHelper = require('./fileHelper.js');
var fs = require('fs-extra');
var async = require('async');

var path = process.argv[2];

var contentType = "text/html";
var enquiriesFolder = '/enquiries/';
var termsFolder = '/terms-and-conditions/';
var privacyFolder = '/privacy-policy/';

var searchDomain = process.env.AWS_CS_SEARCH;
var uploadDomain = process.env.AWS_CS_UPLOAD;
var aws_access_key = process.env.AWS_ACCESS_KEY_ID_IIGB_SEARCH_UPDATER;
var aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY_IIGB_SEARCH_UPDATER;


AWS.config.apiVersions = {
	cloudsearchdomain: '2013-01-01',
};

AWS.config.update({
	accessKeyId: aws_access_key,
	secretAccessKey: aws_secret_key,
	region: 'eu-west-1',
	correctClockSkew: true
});

var csdUpload = new AWS.CloudSearchDomain({
	endpoint: uploadDomain,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});

var csdSearch = new AWS.CloudSearchDomain({
	endpoint: searchDomain,
	headers: {
		"Accept": "*/*",
		"Content-Type": 'application/json'
	}
});


async.parallel([
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'br'),
				async.apply(getDatafromFile, 'br'),
				async.apply(uploadNewIndex, 'br'),
				getCurrentData,
				removeData
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'cn'),
				async.apply(getDatafromFile, 'cn'),
				async.apply(uploadNewIndex, 'cn'),
				getCurrentData,
				removeData
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'de'),
				async.apply(getDatafromFile, 'de'),
				async.apply(uploadNewIndex, 'de')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'es'),
				async.apply(getDatafromFile, 'es'),
				async.apply(uploadNewIndex, 'es')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'in'),
				async.apply(getDatafromFile, 'in'),
				async.apply(uploadNewIndex, 'in')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'int'),
				async.apply(getDatafromFile, 'int'),
				async.apply(uploadNewIndex, 'int'),
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'jp'),
				async.apply(getDatafromFile, 'jp'),
				async.apply(uploadNewIndex, 'jp')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});
		},
		function(callback) {
			async.waterfall([
				async.apply(createJson, 'us'),
				async.apply(getDatafromFile, 'us'),
				async.apply(uploadNewIndex, 'us')
			], function(err, result) {
				if (err) {
					console.log(err);
				} else {
					// console.log(result);
				}
			});

		}
	],
	function(err, results) {
		if (err) {
			console.log(err);
			process.exit(1);
		} else {
			console.log("search successfully refreshed");
		}
		// removeTempFiles();
	});


function createJson(markets, callback) {
	//create temp directory
	fileHelper.createDirectories(markets);

	var child = exec("cs-import-documents --access-key " + aws_access_key + "  --secret-key " + aws_secret_key + " --source " + path + "/" + markets + "/*/*/*/*/*.html " +
		path + "/" + markets + "/*/*/*/*.html " + path + "/" + markets + "/*/*/*.html " + path + "/" + markets + "/*/*.html  --output /tmp/" + markets + " --verbose");

	child.stdout.on('data', function(data) {
		// console.log('stdout: ' + data);
	});
	child.stderr.on('data', function(data) {
		// console.log('stdout: ' + data);
	});
	child.on('close', function(code) {
		// console.log('closing code: ' + code);
		callback(null);
	});
}

function getDatafromFile(market, callback) {
	fs.readFile('/tmp/' + market + '/1.json', 'utf8', function(err, data) {
		if (err) {
			callback(err);
		} else {
			var searchdata = data;
			callback(null, searchdata);
		}
	});
}

function uploadNewIndex(market, newdata, callback) {

	var formattedData = prepareBatch(newdata);

	var indexedData = addTimestamp(formattedData);

	var version = getDataVersion(indexedData);

	if (market == 'br') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new br data to index");
			callback(null, version);
		});
	} else if (market == 'cn') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new cn data to index");
			callback(null, version);
		});
	} else if (market == 'de') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new de data to index");
			callback(null, version);
		});
	} else if (market == 'es') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new es data to index");
			callback(null, version);
		});
	} else if (market == 'in') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new in data to index");
			callback(null, version);
		});
	} else if (market == 'int') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new int data to index");
			callback(null, version);
		});
	} else if (market == 'jp') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new jp data to index");
			callback(null, version);
		});
	} else if (market == 'us') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("added new us data to index");
			callback(null, version);
		});
	}
}

function getCurrentData(version, callback) {
	var searchParams = {
		query: "(and (term field=content_type '" + contentType + "'))",
		queryParser: 'structured',
		size: 10000,
	};
	csdSearch.search(searchParams, function(err, data) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, data, version);
		}
	});
}

function removeData(data, version, callback) {

	var redactedIndex = prepareDataforRemoval(data.hits.hit, version);

	var processedResults = addType(redactedIndex, "delete");

	var batch = prepareBatch(processedResults);

	csdUpload.uploadDocuments(batch, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else console.log("done removing previous versions");
		callback(null, data);
	});
}

function addType(results, action) {
	var processedResults = [];

	results.forEach(function(result) {
		delete result.fields;
		var jsonResult = {
			"id": result.id,
			"type": action
		};
		processedResults.push(jsonResult);
	});
	return JSON.stringify(processedResults);
}

function prepareBatch(results) {
	var params = {
		contentType: 'application/json',
		documents: results
	};
	return params;
}

function pruneContent(results) {
	var prunedArray = [];

	results.forEach(function(result) {
		if ((result.fields.url).includes(enquiriesFolder) || (result.fields.url).includes(termsFolder) || (result.fields.url).includes(privacyFolder)) {
			// console.log('pruning folders');
		} else {
			prunedArray.push(result);
		}
	});
	return prunedArray;
}

function addTimestamp(params, callback) {

	var newDocs = JSON.parse(params.documents);
	var newParams = params;
	var array = [];

	for (var i = 0; i < newDocs.length; i++) {
		var url = newDocs[i].fields.url;
		// console.log(newDocs[i]);
		newDocs[i].id = url + newDocs[i].fields.timestamp;
		array.push(newDocs[i]);
	}
	var prunedArray = pruneContent(array);
	newParams.documents = JSON.stringify(prunedArray);
	return newParams;
}

function getDataVersion(data) {
	var version;
	var newDocs = JSON.parse(data.documents);
	return newDocs[0].fields.timestamp;
}

function prepareDataforRemoval(results, version) {
	var forRemoval = [];
	results.forEach(function(result) {
		if (result.fields.timestamp !== version) {
			forRemoval.push(result);
		}
	});
	return forRemoval;
}

function isIncluded(language) {

	if (languages.indexOf(language) !== -1) {
		return true;
	} else {
		return false;
	}
}
