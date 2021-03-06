var sys = require('util');
var exec = require('child_process').exec;
var AWS = require('aws-sdk');
var fileHelper = require('./fileHelper.js');
var fs = require('fs-extra');
var async = require('async');

var path = process.argv[2];

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
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'cn'),
			async.apply(getDatafromFile, 'cn'),
			async.apply(uploadNewIndex, 'cn'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'de'),
			async.apply(getDatafromFile, 'de'),
			async.apply(uploadNewIndex, 'de'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'es'),
			async.apply(getDatafromFile, 'es'),
			async.apply(uploadNewIndex, 'es'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'in'),
			async.apply(getDatafromFile, 'in'),
			async.apply(uploadNewIndex, 'in'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'int'),
			async.apply(getDatafromFile, 'int'),
			async.apply(uploadNewIndex, 'int'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'jp'),
			async.apply(getDatafromFile, 'jp'),
			async.apply(uploadNewIndex, 'jp'),
		], function(err, result) {
			console.log(result);
		});
	},
	function(callback) {
		async.waterfall([
			async.apply(createJson, 'us'),
			async.apply(getDatafromFile, 'us'),
			async.apply(uploadNewIndex, 'us'),
		], function(err, result) {
			console.log(result);
		});
	}
], function(err, results) {
	if (err) {
		console.log(err);
	} else {
		console.log("search successfully populated");
	}
	// removeTempFiles();
});


function createJson(market, callback) {
	//create temp directory
	fileHelper.createDirectories(market);


	var child = exec("cs-import-documents --access-key " + aws_access_key + "  --secret-key " + aws_secret_key + " --source " + path + market + "/*/*/*/*/*.html " +
		path + market + "/*/*/*/*.html " + path + market + "/*/*/*.html " + path + market + "/*/*.html  --output /tmp/" + market + " --verbose");

	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.stderr.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.on('close', function(code) {
		console.log('closing code: ' + code);
		callback(null);
	});
}

function getDatafromFile(mar, callback) {
	fs.readFile('/tmp/' + mar + '/1.json', 'utf8', function(err, data) {
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

	if (market == 'br') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for br");
			callback(null, data);
		});
	} else if (market == 'cn') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for cn");
			callback(null, data);
		});
	} else if (market == 'de') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for de");
			callback(null, data);
		});
	} else if (market == 'es') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for es");
			callback(null, data);
		});
	} else if (market == 'in') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for in");
			callback(null, data);
		});
	} else if (market == 'int') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for int");
			callback(null, data);
		});
	} else if (market == 'jp') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for jp");
			callback(null, data);
		});
	} else if (market == 'us') {
		csdUpload.uploadDocuments(indexedData, function(err, data) {
			if (err) console.log(err, err.stack); // an error occurred
			else console.log("done adding new index for us");
			callback(null, data);
		});
	}

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

function addTimestamp(params, callback) {

	var newDocs = JSON.parse(params.documents);
	var newParams = params;
	var array = [];

	for (var i = 0; i < newDocs.length; i++) {
		var url = newDocs[i].fields.url;
		console.log(newDocs[i]);
		newDocs[i].id = url + newDocs[i].fields.timestamp;
		array.push(newDocs[i]);
	}
	var prunedArray = pruneContent(array);
	newParams.documents = JSON.stringify(prunedArray);
	return newParams;
}

function pruneContent(results) {
	var prunedArray = [];

	results.forEach(function(result) {
		if ((result.fields.url).includes(enquiriesFolder) || (result.fields.url).includes(termsFolder) || (result.fields.url).includes(privacyFolder)) {
			console.log('pruning unwanted data');
		} else {
			prunedArray.push(result);
		}
	});
	return prunedArray;
}

function isIncluded(language) {

	if (languages.indexOf(language) !== -1) {
		return true;
	} else {
		return false;
	}
}
