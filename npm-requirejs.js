var npm = require("npm");
npm.load(npm.config, function (err) {
	if (err) throw(err);
	npm.commands.list([], true, function(err, pkgInfo) {
		runRequireJS(getRequireJSConfigFromPackageInfo(pkgInfo));
	});
});


function getRequireJSConfigFromPackageInfo(pkgInfo) {
	var rjsConfig = { 'name': pkgInfo.name
			, 'outDir': "src/main/webapp/res/" };
	//rjsConfig.configDir = "requirejs-config/";
	//rjsConfig.mainConfigFile = rjsConfig.configDir + pkgInfo.main;
	rjsConfig.srcDir = "src/main/js/";
	rjsConfig.out = rjsConfig.outDir + pkgInfo.main;
	rjsConfig.baseUrl = rjsConfig.srcDir;
	rjsConfig.modulesDir = "../../../node_modules/";
	
	rjsConfig.paths = {};
	rjsConfig.paths[rjsConfig.name] = normalizePath(pkgInfo.main);
	for (var d in pkgInfo.dependencies) {
		if (d && pkgInfo.dependencies[d].name && !pkgInfo.dependencies[d].extraneous) {
			rjsConfig.paths[pkgInfo.dependencies[d].name] = normalizePath(rjsConfig.modulesDir + pkgInfo.dependencies[d].name + "/" + pkgInfo.dependencies[d].main);
		}
	}

	if (pkgInfo.dependencies.almond) {
		if (!rjsConfig.include) {
			rjsConfig.include = [];
		}
		rjsConfig.include.push(rjsConfig.modulesDir + pkgInfo.dependencies["almond"].name + "/" + pkgInfo.dependencies["almond"].main);
	}
	
	if (pkgInfo.config.debug) {
		rjsConfig.optimize = "none";
		rjsConfig.preserveLicenseComments = false;
		rjsConfig.generateSourceMaps = true;
	} else {
		rjsConfig.optimize = "uglify2";
		rjsConfig.generateSourceMaps = false;
	}
		
	rjsConfig.skipModuleInsertion = true;
	
	return rjsConfig;
}

function writeRequireJSConfig(rjsConfig, callback) {
	var fs = require("fs");

	console.log("Mkdir " + rjsConfig.configDir);
	fs.mkdir(rjsConfig.configDir, function (err) {
		fs.writeFile(rjsConfig.mainConfigFile, JSON.stringify(rjsConfig, null, "\t"), function (err) {
			if (err) {
				if (callback) {
					callback(err);
					return;
				}
				throw err;
			}
			console.log("require.js configuration file written to " + rjsConfig.mainConfigFile);
			if (callback) {
				callback(null, rjsConfig);
				return;
			}
		});
	});
}

function normalizePath(path) {
	if (path.lastIndexOf(".js") == path.length - 3) {
		path = path.substring(0, path.length - 3);
	}
	return path;
}

function runRequireJS(rjsConfig) {
	var requirejs = require('requirejs');

	console.log("Using below require.js configuration for module " + process.env.npm_package_name);
	console.log(rjsConfig);

	requirejs.optimize(rjsConfig, function (buildResponse) {
		console.log(buildResponse);
	});
}


