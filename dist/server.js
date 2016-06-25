/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return callback();
/******/ 		}
/******/ 		callback(null, update);
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ec5dd2c81dacdbe5d6df"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/dist";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals __resourceQuery */
	if(true) {
		var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);
	
		function checkForUpdate(fromUpdate) {
			if(module.hot.status() === "idle") {
				module.hot.check(true, function(err, updatedModules) {
					if(err) {
						if(module.hot.status() in {
								abort: 1,
								fail: 1
							}) {
							console.warn("[HMR] Cannot apply update.");
							console.warn("[HMR] " + err.stack || err.message);
							console.warn("[HMR] You need to restart the application!");
						} else {
							console.warn("[HMR] Update failed: " + err.stack || err.message);
						}
						return;
					}
					if(!updatedModules) {
						if(fromUpdate) console.log("[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				});
			}
		}
		setInterval(checkForUpdate, hotPollInterval);
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, "?1000"))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});
	
		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}
	
		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _babelPolyfill = __webpack_require__(4);
	
	var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);
	
	var _koa = __webpack_require__(5);
	
	var _koa2 = _interopRequireDefault(_koa);
	
	var _koaProxy = __webpack_require__(6);
	
	var _koaProxy2 = _interopRequireDefault(_koaProxy);
	
	var _koaStatic = __webpack_require__(7);
	
	var _koaStatic2 = _interopRequireDefault(_koaStatic);
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _server = __webpack_require__(9);
	
	var _server2 = _interopRequireDefault(_server);
	
	var _reactRouter = __webpack_require__(10);
	
	var ReactRouter = _interopRequireWildcard(_reactRouter);
	
	var _reactTransmit = __webpack_require__(11);
	
	var _reactTransmit2 = _interopRequireDefault(_reactTransmit);
	
	var _routes = __webpack_require__(12);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _favicon = __webpack_require__(23);
	
	var _favicon2 = _interopRequireDefault(_favicon);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	try {
		(function () {
			var app = (0, _koa2.default)();
			var hostname = process.env.HOSTNAME || "localhost";
			var port = process.env.PORT || 8000;
			var routes = _routes2.default;
	
			app.use((0, _koaStatic2.default)("static"));
	
			app.use(regeneratorRuntime.mark(function _callee(next) {
				var _this = this;
	
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return function (callback) {
									var webserver =  false ? "" : "//" + _this.hostname + ":8080";
									var location = _this.path;
	
									ReactRouter.match({ routes: routes, location: location }, function (error, redirectLocation, renderProps) {
										if (redirectLocation) {
											_this.redirect(redirectLocation.pathname + redirectLocation.search, "/");
											return;
										}
	
										if (error || !renderProps) {
											callback(error);
											return;
										}
	
										var Root = _react2.default.createClass({
											displayName: "Root",
											render: function render() {
												return _react2.default.createElement(ReactRouter.RouterContext, this.props);
											}
										});
	
										// TODO Fix CSS IMPORT
										_reactTransmit2.default.renderToString(Root, renderProps).then(function (_ref) {
											var reactString = _ref.reactString;
											var reactData = _ref.reactData;
	
											var template = "<!doctype html>\n\t\t\t\t\t\t<html lang=\"en-us\">\n\t\t\t\t\t\t\t<head>\n\t\t\t\t\t\t\t\t<meta charset=\"utf-8\" />\n\t\t\t\t\t\t\t\t<title>stride</title>\n\t\t\t\t\t\t\t\t<style>\n\t\t\t\t\t\t\t\t\tbody { margin: 0; padding: 0 } \n\t\t\t\t\t\t\t\t  .fade-appear { opacity: 0.01 }\n\t\t\t\t\t\t\t\t  .fade-appear.fade-appear-active { opacity: 1; transition: opacity .25s ease-in }\n\t\t\t\t\t\t\t    .fade-enter { opacity: 0.01 }\n\t\t\t\t\t\t\t\t  .fade-enter.fade-enter-active { opacity: 1; transition: opacity 250ms ease-in }\n\t\t\t\t\t\t\t    .fade-leave { opacity: 1 }\n\t\t\t\t\t\t\t\t\t.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity 150ms ease-in }\n\t\t\t\t\t\t\t\t\t/*\n\n\t\t\t\t\t\t\t\t\tColorbrewer theme\n\t\t\t\t\t\t\t\t\tOriginal: https://github.com/mbostock/colorbrewer-theme (c) Mike Bostock <mike@ocks.org>\n\t\t\t\t\t\t\t\t\tPorted by Fabrício Tavares de Oliveira\n\n\t\t\t\t\t\t\t\t\t*/\n\n\t\t\t\t\t\t\t\t\t.hljs {\n\t\t\t\t\t\t\t\t\t\tdisplay: block;\n\t\t\t\t\t\t\t\t\t\toverflow-x: auto;\n\t\t\t\t\t\t\t\t\t\tpadding: 0.5em;\n\t\t\t\t\t\t\t\t\t\t-webkit-text-size-adjust: none;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.hljs,\n\t\t\t\t\t\t\t\t\t.hljs-subst,\n\t\t\t\t\t\t\t\t\t.hljs-tag .hljs-title,\n\t\t\t\t\t\t\t\t\t.nginx .hljs-title {\n\t\t\t\t\t\t\t\t\t\tcolor: #000;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.hljs-string,\n\t\t\t\t\t\t\t\t\t.hljs-title,\n\t\t\t\t\t\t\t\t\t.hljs-constant,\n\t\t\t\t\t\t\t\t\t.hljs-parent,\n\t\t\t\t\t\t\t\t\t.hljs-tag .hljs-value,\n\t\t\t\t\t\t\t\t\t.hljs-rule .hljs-value,\n\t\t\t\t\t\t\t\t\t.hljs-preprocessor,\n\t\t\t\t\t\t\t\t\t.hljs-pragma,\n\t\t\t\t\t\t\t\t\t.haml .hljs-symbol,\n\t\t\t\t\t\t\t\t\t.ruby .hljs-symbol,\n\t\t\t\t\t\t\t\t\t.ruby .hljs-symbol .hljs-string,\n\t\t\t\t\t\t\t\t\t.hljs-template_tag,\n\t\t\t\t\t\t\t\t\t.django .hljs-variable,\n\t\t\t\t\t\t\t\t\t.smalltalk .hljs-class,\n\t\t\t\t\t\t\t\t\t.hljs-addition,\n\t\t\t\t\t\t\t\t\t.hljs-flow,\n\t\t\t\t\t\t\t\t\t.hljs-stream,\n\t\t\t\t\t\t\t\t\t.bash .hljs-variable,\n\t\t\t\t\t\t\t\t\t.apache .hljs-tag,\n\t\t\t\t\t\t\t\t\t.apache .hljs-cbracket,\n\t\t\t\t\t\t\t\t\t.tex .hljs-command,\n\t\t\t\t\t\t\t\t\t.tex .hljs-special,\n\t\t\t\t\t\t\t\t\t.erlang_repl .hljs-function_or_atom,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-header,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-header,\n\t\t\t\t\t\t\t\t\t.coffeescript .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.hljs-name {\n\t\t\t\t\t\t\t\t\t\tcolor: #756bb1;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.smartquote,\n\t\t\t\t\t\t\t\t\t.hljs-comment,\n\t\t\t\t\t\t\t\t\t.hljs-annotation,\n\t\t\t\t\t\t\t\t\t.diff .hljs-header,\n\t\t\t\t\t\t\t\t\t.hljs-chunk,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-blockquote,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-blockquote {\n\t\t\t\t\t\t\t\t\t\tcolor: #636363;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.hljs-number,\n\t\t\t\t\t\t\t\t\t.hljs-date,\n\t\t\t\t\t\t\t\t\t.hljs-regexp,\n\t\t\t\t\t\t\t\t\t.hljs-literal,\n\t\t\t\t\t\t\t\t\t.hljs-hexcolor,\n\t\t\t\t\t\t\t\t\t.smalltalk .hljs-symbol,\n\t\t\t\t\t\t\t\t\t.smalltalk .hljs-char,\n\t\t\t\t\t\t\t\t\t.go .hljs-constant,\n\t\t\t\t\t\t\t\t\t.hljs-change,\n\t\t\t\t\t\t\t\t\t.lasso .hljs-variable,\n\t\t\t\t\t\t\t\t\t.makefile .hljs-variable,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-bullet,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-bullet,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-link_url,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-link_url {\n\t\t\t\t\t\t\t\t\t\tcolor: #31a354;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.hljs-label,\n\t\t\t\t\t\t\t\t\t.ruby .hljs-string,\n\t\t\t\t\t\t\t\t\t.hljs-decorator,\n\t\t\t\t\t\t\t\t\t.hljs-filter .hljs-argument,\n\t\t\t\t\t\t\t\t\t.hljs-localvars,\n\t\t\t\t\t\t\t\t\t.hljs-array,\n\t\t\t\t\t\t\t\t\t.hljs-attr_selector,\n\t\t\t\t\t\t\t\t\t.hljs-important,\n\t\t\t\t\t\t\t\t\t.hljs-pseudo,\n\t\t\t\t\t\t\t\t\t.hljs-pi,\n\t\t\t\t\t\t\t\t\t.haml .hljs-bullet,\n\t\t\t\t\t\t\t\t\t.hljs-doctype,\n\t\t\t\t\t\t\t\t\t.hljs-deletion,\n\t\t\t\t\t\t\t\t\t.hljs-envvar,\n\t\t\t\t\t\t\t\t\t.hljs-shebang,\n\t\t\t\t\t\t\t\t\t.apache .hljs-sqbracket,\n\t\t\t\t\t\t\t\t\t.nginx .hljs-built_in,\n\t\t\t\t\t\t\t\t\t.hljs-list .hljs-built_in,\n\t\t\t\t\t\t\t\t\t.tex .hljs-formula,\n\t\t\t\t\t\t\t\t\t.erlang_repl .hljs-reserved,\n\t\t\t\t\t\t\t\t\t.hljs-prompt,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-link_label,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-link_label,\n\t\t\t\t\t\t\t\t\t.vhdl .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.clojure .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.lasso .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.coffeescript .hljs-property,\n\t\t\t\t\t\t\t\t\t.hljs-phony {\n\t\t\t\t\t\t\t\t\t\tcolor: #88f;\n\t\t\t\t\t\t\t\t\t}\n\n\n\n\t\t\t\t\t\t\t\t\t.hljs-keyword,\n\t\t\t\t\t\t\t\t\t.hljs-id,\n\t\t\t\t\t\t\t\t\t.hljs-title,\n\t\t\t\t\t\t\t\t\t.hljs-built_in,\n\t\t\t\t\t\t\t\t\t.css .hljs-tag,\n\t\t\t\t\t\t\t\t\t.hljs-doctag,\n\t\t\t\t\t\t\t\t\t.smalltalk .hljs-class,\n\t\t\t\t\t\t\t\t\t.hljs-winutils,\n\t\t\t\t\t\t\t\t\t.bash .hljs-variable,\n\t\t\t\t\t\t\t\t\t.apache .hljs-tag,\n\t\t\t\t\t\t\t\t\t.hljs-type,\n\t\t\t\t\t\t\t\t\t.hljs-typename,\n\t\t\t\t\t\t\t\t\t.tex .hljs-command,\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-strong,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-strong,\n\t\t\t\t\t\t\t\t\t.hljs-request,\n\t\t\t\t\t\t\t\t\t.hljs-status {\n\t\t\t\t\t\t\t\t\t\tcolor: #3182bd;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.asciidoc .hljs-emphasis,\n\t\t\t\t\t\t\t\t\t.markdown .hljs-emphasis {\n\t\t\t\t\t\t\t\t\t\tfont-style: italic;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.nginx .hljs-built_in {\n\t\t\t\t\t\t\t\t\t\tfont-weight: normal;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.coffeescript .javascript,\n\t\t\t\t\t\t\t\t\t.javascript .xml,\n\t\t\t\t\t\t\t\t\t.lasso .markup,\n\t\t\t\t\t\t\t\t\t.tex .hljs-formula,\n\t\t\t\t\t\t\t\t\t.xml .javascript,\n\t\t\t\t\t\t\t\t\t.xml .vbscript,\n\t\t\t\t\t\t\t\t\t.xml .css,\n\t\t\t\t\t\t\t\t\t.xml .hljs-cdata {\n\t\t\t\t\t\t\t\t\t\topacity: 0.5;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.css .hljs-attribute,\n\t\t\t\t\t\t\t\t\t.html .hljs-attribute {\n\t\t\t\t\t\t\t\t\t\tcolor: #e6550d;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t.css .hljs-class,\n\t\t\t\t\t\t\t\t\t.html .hljs-tag,\n\t\t\t\t\t\t\t\t\t.html .hljs-title {\n\t\t\t\t\t\t\t\t\t\tcolor: #3182bd;\n\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t  </style>\n\t\t\t\t\t\t\t\t<link href=\"https://fonts.googleapis.com/css?family=Open+Sans:300\" rel=\"stylesheet\">\n\t\t\t\t\t\t\t\t<link rel=\"shortcut icon\" href=\"" + _favicon2.default + "\" />\n\t\t\t\t\t\t\t</head>\n\t\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t\t<div id=\"react-root\">" + reactString + "</div>\n\t\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>";
	
											_this.type = "text/html";
											_this.body = _reactTransmit2.default.injectIntoMarkup(template, reactData, [webserver + "/dist/client.js"]);
	
											callback(null);
										}).catch(function (e) {
											callback(e);
										});
									});
								};
	
							case 2:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));
	
			app.listen(port, function () {
				console.info("==> ✅  Server is listening");
				console.info("==> 🌎  Go to http://%s:%s", hostname, port);
			});
	
			if (true) {
				if (true) {
					console.log("[HMR] Waiting for server-side updates");
	
					module.hot.accept(12, function () {
						routes = __webpack_require__(12);
					});
	
					module.hot.addStatusHandler(function (status) {
						if (status === "abort") {
							setTimeout(function () {
								return process.exit(0);
							}, 0);
						}
					});
				}
			}
		})();
	} catch (error) {
		console.error(error.stack || error);
	
		throw error;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("koa");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("koa-proxy");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("koa-static");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("react-transmit");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(10);
	
	var _Main = __webpack_require__(13);
	
	var _Main2 = _interopRequireDefault(_Main);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * The React Router routes for both the server and the client.
	 */
	module.exports = _react2.default.createElement(
		_reactRouter.Router,
		null,
		_react2.default.createElement(_reactRouter.Route, { path: "/docs/:endpoint", component: _Main2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: "*", component: _Main2.default })
	);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactInlineCss = __webpack_require__(14);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _materialColors = __webpack_require__(15);
	
	var _materialColors2 = _interopRequireDefault(_materialColors);
	
	var _Doc = __webpack_require__(16);
	
	var _Doc2 = _interopRequireDefault(_Doc);
	
	var _Nav = __webpack_require__(22);
	
	var _Nav2 = _interopRequireDefault(_Nav);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Main = function (_React$Component) {
		_inherits(Main, _React$Component);
	
		function Main() {
			_classCallCheck(this, Main);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Main).apply(this, arguments));
		}
	
		_createClass(Main, [{
			key: "render",
			value: function render() {
				return _react2.default.createElement(
					_reactInlineCss2.default,
					{ stylesheet: Main.css(), namespace: "Main", key: this.props.routeParams.endpoint },
					_react2.default.createElement(
						"div",
						{ className: "container" },
						_react2.default.createElement(
							"div",
							{ className: "container-body" },
							_react2.default.createElement("div", { className: "container-fill-left" }),
							_react2.default.createElement(
								"div",
								{ className: "container-nav" },
								_react2.default.createElement(_Nav2.default, this.props)
							),
							_react2.default.createElement(
								"div",
								{ className: "container-content" },
								_react2.default.createElement(_Doc2.default, _extends({ className: "container-content" }, this.props))
							),
							_react2.default.createElement("div", { className: "container-fill-right" })
						)
					)
				);
			}
		}], [{
			key: "css",
			value: function css() {
				return "\n\t\t\t& {\n\t\t\t\tfont-family: 'Open Sans', 'Helvetica', sans-serif;\n\t\t\t}\n\n\t\t\t& h1 {\n\t\t\t\tpadding: 0 0 0.25em;\n\t\t\t\tfont-weight: normal;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t& h2 {\n\t\t\t\tpadding: 0 0 0.5em;\n\t\t\t\tfont-weight: normal;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t& .container {\n\t\t\t\tdisplay: flex;\n\t\t\t\tmin-height: 100vh;\n\t\t\t\twidth: 100%;\n\t\t\t\tbackground: " + _materialColors2.default.grey['50'] + ";\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\n\t\t\t& .container-body {\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex: 1;\n\t\t\t}\n\n\t\t\t& .container-content {\n\t\t\t\tflex: 5;\n\t\t\t\tmax-width: 1000px;\n\t\t\t\tpadding: 1em 3em;\n\t\t\t}\n\n\t\t\t& .container-nav {\n\t\t\t\tflex: 0 0 20em;\n\t\t\t\torder -1;\n\t\t\t\tcolor: " + _materialColors2.default.grey['50'] + ";\n\t\t\t\tbackground: " + _materialColors2.default.grey['900'] + ";\n\t\t\t\tpadding: 1em 3em;\n\t\t\t}\n\n\t\t\t& .container-fill-left {\n\t\t\t\tflex: 1;\n\t\t\t\tbackground: " + _materialColors2.default.grey['900'] + ";\n\t\t\t}\n\n\t\t\t& .container-fill-right {\n\t\t\t\tflex: 1;\n\t\t\t\tbackground: " + _materialColors2.default.grey['50'] + ";\n\t\t\t}\n\n\t\t\t& code {\n\t\t\t\tfont-family: 'Consolas', 'Menlo', monospace;\n\t\t\t\tborder-radius: 0.5em;\n\t\t\t\tfont-size: 0.8em;\n\t\t\t\tpadding: 0.5em;\n\t\t\t\tborder: 1px solid " + _materialColors2.default.grey['200'] + ";\n\t\t\t}\n\n\t\t";
			}
		}]);
	
		return Main;
	}(_react2.default.Component);
	
	exports.default = Main;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("react-inline-css");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("material-colors");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactAddonsCssTransitionGroup = __webpack_require__(17);
	
	var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);
	
	var _swagger = __webpack_require__(18);
	
	var _swagger2 = _interopRequireDefault(_swagger);
	
	var _jsonFormat = __webpack_require__(20);
	
	var _jsonFormat2 = _interopRequireDefault(_jsonFormat);
	
	var _reactHighlight = __webpack_require__(21);
	
	var _reactHighlight2 = _interopRequireDefault(_reactHighlight);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Main React application entry-point for both the server and client.
	 */
	
	var Doc = function (_React$Component) {
	  _inherits(Doc, _React$Component);
	
	  function Doc() {
	    _classCallCheck(this, Doc);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Doc).apply(this, arguments));
	  }
	
	  _createClass(Doc, [{
	    key: "render",
	    value: function render() {
	      var pathDefinition = _swagger2.default.getPath(this.props.params.endpoint);
	      return _react2.default.createElement(
	        _reactAddonsCssTransitionGroup2.default,
	        { transitionName: "fade", transitionEnterTimeout: 250, transitionLeaveTimeout: 150, transitionAppearTimeout: 150, transitionAppear: true },
	        _swagger2.default.getFullPath(this.props.params.endpoint) ? _react2.default.createElement(SwaggerDoc, { path: this.props.params.endpoint, definition: pathDefinition }) : _react2.default.createElement(NoDoc, null)
	      );
	    }
	  }]);
	
	  return Doc;
	}(_react2.default.Component);
	
	exports.default = Doc;
	
	var SwaggerDoc = function (_React$Component2) {
	  _inherits(SwaggerDoc, _React$Component2);
	
	  function SwaggerDoc() {
	    _classCallCheck(this, SwaggerDoc);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SwaggerDoc).apply(this, arguments));
	  }
	
	  _createClass(SwaggerDoc, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "h1",
	          null,
	          _swagger2.default.getFullPath(this.props.path) || "Home"
	        ),
	        _react2.default.createElement(
	          _reactHighlight2.default,
	          { className: "json" },
	          (0, _jsonFormat2.default)(this.props.definition, { type: 'space', size: 2 })
	        )
	      );
	    }
	  }]);
	
	  return SwaggerDoc;
	}(_react2.default.Component);
	
	// Displayed if the route is not known
	
	
	var NoDoc = function (_React$Component3) {
	  _inherits(NoDoc, _React$Component3);
	
	  function NoDoc() {
	    _classCallCheck(this, NoDoc);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(NoDoc).apply(this, arguments));
	  }
	
	  _createClass(NoDoc, [{
	    key: "render",
	    value: function render() {
	      return _react2.default.createElement(
	        "h1",
	        null,
	        "Home"
	      );
	    }
	  }]);
	
	  return NoDoc;
	}(_react2.default.Component);

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("react-addons-css-transition-group");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _swagger = __webpack_require__(19);
	
	var _swagger2 = _interopRequireDefault(_swagger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var swagger = _swagger2.default;
	
	// Returns the basePath + path
	swagger.getFullPath = function (path) {
	  return path ? _swagger2.default.basePath + path : null;
	};
	
	swagger.getPaths = function () {
	  return Object.keys(_swagger2.default.paths || {});
	};
	swagger.getPath = function (path) {
	  return path && _swagger2.default.paths && _swagger2.default.paths[path] || {};
	};
	swagger.getTitle = function () {
	  return _swagger2.default.info && _swagger2.default.info.title || "API";
	};
	swagger.getDescription = function () {
	  return _swagger2.default.info && _swagger2.default.info.description || "";
	};
	swagger.getVersion = function () {
	  return _swagger2.default.info && _swagger2.default.info.version || "";
	};
	
	exports.default = _swagger2.default;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = {
		"swagger": "2.0",
		"info": {
			"title": "Uber API",
			"description": "Move your app forward with the Uber API",
			"version": "1.0.0"
		},
		"host": "api.uber.com",
		"schemes": [
			"https"
		],
		"basePath": "/v1",
		"produces": [
			"application/json"
		],
		"paths": {
			"/products": {
				"get": {
					"summary": "Product Types",
					"description": "The Products endpoint returns information about the Uber products offered at a given location. The response includes the display name and other details about each product, and lists the products in the proper display order.",
					"parameters": [
						{
							"name": "latitude",
							"in": "query",
							"description": "Latitude component of location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "longitude",
							"in": "query",
							"description": "Longitude component of location.",
							"required": true,
							"type": "number",
							"format": "double"
						}
					],
					"tags": [
						"Products"
					],
					"responses": {
						"200": {
							"description": "An array of products",
							"schema": {
								"type": "array",
								"items": {
									"$ref": "#/definitions/Product"
								}
							}
						},
						"default": {
							"description": "Unexpected error",
							"schema": {
								"$ref": "#/definitions/Error"
							}
						}
					}
				}
			},
			"/estimates/price": {
				"get": {
					"summary": "Price Estimates",
					"description": "The Price Estimates endpoint returns an estimated price range for each product offered at a given location. The price estimate is provided as a formatted string with the full price range and the localized currency symbol.<br><br>The response also includes low and high estimates, and the [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code for situations requiring currency conversion. When surge is active for a particular product, its surge_multiplier will be greater than 1, but the price estimate already factors in this multiplier.",
					"parameters": [
						{
							"name": "start_latitude",
							"in": "query",
							"description": "Latitude component of start location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "start_longitude",
							"in": "query",
							"description": "Longitude component of start location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "end_latitude",
							"in": "query",
							"description": "Latitude component of end location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "end_longitude",
							"in": "query",
							"description": "Longitude component of end location.",
							"required": true,
							"type": "number",
							"format": "double"
						}
					],
					"tags": [
						"Estimates"
					],
					"responses": {
						"200": {
							"description": "An array of price estimates by product",
							"schema": {
								"type": "array",
								"items": {
									"$ref": "#/definitions/PriceEstimate"
								}
							}
						},
						"default": {
							"description": "Unexpected error",
							"schema": {
								"$ref": "#/definitions/Error"
							}
						}
					}
				}
			},
			"/estimates/time": {
				"get": {
					"summary": "Time Estimates",
					"description": "The Time Estimates endpoint returns ETAs for all products offered at a given location, with the responses expressed as integers in seconds. We recommend that this endpoint be called every minute to provide the most accurate, up-to-date ETAs.",
					"parameters": [
						{
							"name": "start_latitude",
							"in": "query",
							"description": "Latitude component of start location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "start_longitude",
							"in": "query",
							"description": "Longitude component of start location.",
							"required": true,
							"type": "number",
							"format": "double"
						},
						{
							"name": "customer_uuid",
							"in": "query",
							"type": "string",
							"format": "uuid",
							"description": "Unique customer identifier to be used for experience customization."
						},
						{
							"name": "product_id",
							"in": "query",
							"type": "string",
							"description": "Unique identifier representing a specific product for a given latitude & longitude."
						}
					],
					"tags": [
						"Estimates"
					],
					"responses": {
						"200": {
							"description": "An array of products",
							"schema": {
								"type": "array",
								"items": {
									"$ref": "#/definitions/Product"
								}
							}
						},
						"default": {
							"description": "Unexpected error",
							"schema": {
								"$ref": "#/definitions/Error"
							}
						}
					}
				}
			},
			"/me": {
				"get": {
					"summary": "User Profile",
					"description": "The User Profile endpoint returns information about the Uber user that has authorized with the application.",
					"tags": [
						"User"
					],
					"responses": {
						"200": {
							"description": "Profile information for a user",
							"schema": {
								"$ref": "#/definitions/Profile"
							}
						},
						"default": {
							"description": "Unexpected error",
							"schema": {
								"$ref": "#/definitions/Error"
							}
						}
					}
				}
			},
			"/history": {
				"get": {
					"summary": "User Activity",
					"description": "The User Activity endpoint returns data about a user's lifetime activity with Uber. The response will include pickup locations and times, dropoff locations and times, the distance of past requests, and information about which products were requested.<br><br>The history array in the response will have a maximum length based on the limit parameter. The response value count may exceed limit, therefore subsequent API requests may be necessary.",
					"parameters": [
						{
							"name": "offset",
							"in": "query",
							"type": "integer",
							"format": "int32",
							"description": "Offset the list of returned results by this amount. Default is zero."
						},
						{
							"name": "limit",
							"in": "query",
							"type": "integer",
							"format": "int32",
							"description": "Number of items to retrieve. Default is 5, maximum is 100."
						}
					],
					"tags": [
						"User"
					],
					"responses": {
						"200": {
							"description": "History information for the given user",
							"schema": {
								"$ref": "#/definitions/Activities"
							}
						},
						"default": {
							"description": "Unexpected error",
							"schema": {
								"$ref": "#/definitions/Error"
							}
						}
					}
				}
			}
		},
		"definitions": {
			"Product": {
				"properties": {
					"product_id": {
						"type": "string",
						"description": "Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles."
					},
					"description": {
						"type": "string",
						"description": "Description of product."
					},
					"display_name": {
						"type": "string",
						"description": "Display name of product."
					},
					"capacity": {
						"type": "string",
						"description": "Capacity of product. For example, 4 people."
					},
					"image": {
						"type": "string",
						"description": "Image URL representing the product."
					}
				}
			},
			"PriceEstimate": {
				"properties": {
					"product_id": {
						"type": "string",
						"description": "Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles"
					},
					"currency_code": {
						"type": "string",
						"description": "[ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code."
					},
					"display_name": {
						"type": "string",
						"description": "Display name of product."
					},
					"estimate": {
						"type": "string",
						"description": "Formatted string of estimate in local currency of the start location. Estimate could be a range, a single number (flat rate) or \"Metered\" for TAXI."
					},
					"low_estimate": {
						"type": "number",
						"description": "Lower bound of the estimated price."
					},
					"high_estimate": {
						"type": "number",
						"description": "Upper bound of the estimated price."
					},
					"surge_multiplier": {
						"type": "number",
						"description": "Expected surge multiplier. Surge is active if surge_multiplier is greater than 1. Price estimate already factors in the surge multiplier."
					}
				}
			},
			"Profile": {
				"properties": {
					"first_name": {
						"type": "string",
						"description": "First name of the Uber user."
					},
					"last_name": {
						"type": "string",
						"description": "Last name of the Uber user."
					},
					"email": {
						"type": "string",
						"description": "Email address of the Uber user"
					},
					"picture": {
						"type": "string",
						"description": "Image URL of the Uber user."
					},
					"promo_code": {
						"type": "string",
						"description": "Promo code of the Uber user."
					}
				}
			},
			"Activity": {
				"properties": {
					"uuid": {
						"type": "string",
						"description": "Unique identifier for the activity"
					}
				}
			},
			"Activities": {
				"properties": {
					"offset": {
						"type": "integer",
						"format": "int32",
						"description": "Position in pagination."
					},
					"limit": {
						"type": "integer",
						"format": "int32",
						"description": "Number of items to retrieve (100 max)."
					},
					"count": {
						"type": "integer",
						"format": "int32",
						"description": "Total number of items available."
					},
					"history": {
						"type": "array",
						"items": {
							"$ref": "#/definitions/Activity"
						}
					}
				}
			},
			"Error": {
				"properties": {
					"code": {
						"type": "integer",
						"format": "int32"
					},
					"message": {
						"type": "string"
					},
					"fields": {
						"type": "string"
					}
				}
			}
		}
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("json-format");

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = require("react-highlight");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _favicon = __webpack_require__(23);
	
	var _favicon2 = _interopRequireDefault(_favicon);
	
	var _reactRouter = __webpack_require__(10);
	
	var _reactInlineCss = __webpack_require__(14);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _materialColors = __webpack_require__(15);
	
	var _materialColors2 = _interopRequireDefault(_materialColors);
	
	var _swagger = __webpack_require__(18);
	
	var _swagger2 = _interopRequireDefault(_swagger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Nav = function (_React$Component) {
	  _inherits(Nav, _React$Component);
	
	  function Nav() {
	    _classCallCheck(this, Nav);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(Nav).apply(this, arguments));
	  }
	
	  _createClass(Nav, [{
	    key: "render",
	    value: function render() {
	      var _this2 = this;
	
	      return _react2.default.createElement(
	        _reactInlineCss2.default,
	        { stylesheet: Nav.css(), namespace: "Nav" },
	        _react2.default.createElement(
	          "h1",
	          null,
	          _react2.default.createElement("img", { src: _favicon2.default, style: { verticalAlign: 'middle', paddingRight: '0.25em', height: '1.5em' } }),
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: "/" },
	            _swagger2.default.getTitle()
	          )
	        ),
	        _react2.default.createElement(
	          "p",
	          null,
	          _swagger2.default.getDescription()
	        ),
	        _react2.default.createElement(
	          "h2",
	          null,
	          _swagger2.default.getVersion()
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "nav-links" },
	          _swagger2.default.getPaths().map(function (path) {
	            return _react2.default.createElement(SelectableLink, { endpoint: _this2.props.params.endpoint, path: path, key: _swagger2.default.getFullPath(path), to: "/docs/" + encodeURIComponent(path), text: "" + _swagger2.default.getFullPath(path) });
	          })
	        )
	      );
	    }
	  }], [{
	    key: "css",
	    value: function css() {
	      return "\n      & a {\n        color: " + _materialColors2.default.grey['50'] + ";\n        text-decoration: none; \n      }\n\n\t\t\t& .nav-links a {\n        display: block;\n        border-left: 1px solid " + _materialColors2.default.cyan['200'] + ";\n        padding: 0.25em 0em 0.25em 1em;\n        text-decoration: none;\n        word-wrap: break-word;\n        white-space: pre-wrap;\n        max-width: 20em;\n\t\t\t\tcolor: " + _materialColors2.default.cyan['200'] + ";\n\t\t\t}\n\n      & .selected-link {\n        display: block;\n        border-left: 1px solid " + _materialColors2.default.cyan['50'] + ";\n        padding: 0.25em 0em 0.25em 1em;\n        word-wrap: break-word;\n        white-space: pre-wrap;\n        max-width: 20em;\n\t\t\t\tcolor: " + _materialColors2.default.cyan['50'] + ";\n\t\t\t}\n\n      & .nav-links a:hover {\n        border-left: 1px solid " + _materialColors2.default.grey['50'] + ";\n        color: " + _materialColors2.default.grey['50'] + ";\n      }\n\t\t";
	    }
	  }]);
	
	  return Nav;
	}(_react2.default.Component);
	
	exports.default = Nav;
	
	var SelectableLink = function (_React$Component2) {
	  _inherits(SelectableLink, _React$Component2);
	
	  function SelectableLink() {
	    _classCallCheck(this, SelectableLink);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectableLink).apply(this, arguments));
	  }
	
	  _createClass(SelectableLink, [{
	    key: "render",
	    value: function render() {
	      return this.props.endpoint === this.props.path ? _react2.default.createElement(
	        "div",
	        { className: "selected-link" },
	        this.props.text
	      ) : _react2.default.createElement(
	        _reactRouter.Link,
	        { to: this.props.to },
	        this.props.text
	      );
	    }
	  }]);
	
	  return SelectableLink;
	}(_react2.default.Component);

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/favicon.ico";

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map