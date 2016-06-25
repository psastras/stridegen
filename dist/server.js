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
/******/ 	var hotCurrentHash = "e9b866e76b38bd3de323"; // eslint-disable-line no-unused-vars
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
	
	var _favicon = __webpack_require__(17);
	
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
	
										_reactTransmit2.default.renderToString(Root, renderProps).then(function (_ref) {
											var reactString = _ref.reactString;
											var reactData = _ref.reactData;
	
											var template = "<!doctype html>\n\t\t\t\t\t\t<html lang=\"en-us\">\n\t\t\t\t\t\t\t<head>\n\t\t\t\t\t\t\t\t<meta charset=\"utf-8\" />\n\t\t\t\t\t\t\t\t<title>stride</title>\n\t\t\t\t\t\t\t\t<style>body { margin: 0; padding: 0 }</style>\n\t\t\t\t\t\t\t\t<link href=\"https://fonts.googleapis.com/css?family=Open+Sans:300\" rel=\"stylesheet\">\n\t\t\t\t\t\t\t\t<link rel=\"shortcut icon\" href=\"" + _favicon2.default + "\" />\n\t\t\t\t\t\t\t</head>\n\t\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t\t<div id=\"react-root\">" + reactString + "</div>\n\t\t\t\t\t\t\t</body>\n\t\t\t\t\t\t</html>";
	
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactInlineCss = __webpack_require__(14);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _materialColors = __webpack_require__(15);
	
	var _materialColors2 = _interopRequireDefault(_materialColors);
	
	var _Doc = __webpack_require__(16);
	
	var _Doc2 = _interopRequireDefault(_Doc);
	
	var _Nav = __webpack_require__(20);
	
	var _Nav2 = _interopRequireDefault(_Nav);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/**
	 * Main React application entry-point for both the server and client.
	 */
	
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
					{ stylesheet: Main.css(), namespace: "Main" },
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
								_react2.default.createElement(_Doc2.default, this.props)
							),
							_react2.default.createElement("div", { className: "container-fill-right" })
						)
					)
				);
			}
		}], [{
			key: "css",
			value: function css() {
				/**
	    * <InlineCss> component allows you to write a CSS stylesheet for your component. Target
	    * your component with `&` and its children with `& selectors`. Be specific.
	    */
				return "\n\t\t\t& {\n\t\t\t\tfont-family: 'Open Sans', 'Helvetica', sans-serif;\n\t\t\t}\n\n\t\t\t& h1 {\n\t\t\t\tpadding: 0 0 1em;\n\t\t\t\tfont-weight: normal;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t& h2 {\n\t\t\t\tpadding: 0 0 0.5em;\n\t\t\t\tfont-weight: normal;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t& .container {\n\t\t\t\tdisplay: flex;\n\t\t\t\tmin-height: 100vh;\n\t\t\t\twidth: 100%;\n\t\t\t\tbackground: " + _materialColors2.default.grey['50'] + ";\n\t\t\t\tflex-direction: column;\n\t\t\t}\n\n\t\t\t& .container-body {\n\t\t\t\tdisplay: flex;\n\t\t\t\tflex: 1;\n\t\t\t}\n\n\t\t\t& .container-content {\n\t\t\t\tflex: 5;\n\t\t\t\tmax-width: 1000px;\n\t\t\t\tpadding: 1em 3em;\n\t\t\t}\n\n\t\t\t& .container-nav {\n\t\t\t\tflex: 0 0 20em;\n\t\t\t\torder -1;\n\t\t\t\tcolor: " + _materialColors2.default.grey['50'] + ";\n\t\t\t\tbackground: " + _materialColors2.default.grey['900'] + ";\n\t\t\t\tpadding: 1em 3em;\n\t\t\t}\n\n\t\t\t& .container-fill-left {\n\t\t\t\tflex: 1;\n\t\t\t\tbackground: " + _materialColors2.default.grey['900'] + ";\n\t\t\t}\n\n\t\t\t& .container-fill-right {\n\t\t\t\tflex: 1;\n\t\t\t\tbackground: " + _materialColors2.default.grey['50'] + ";\n\t\t\t}\n\t\t";
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
	      return _react2.default.createElement(
	        "div",
	        null,
	        _react2.default.createElement(
	          "h1",
	          null,
	          this.props.routeParams.endpoint || "Home"
	        ),
	        _react2.default.createElement(
	          "p",
	          null,
	          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a facilisis purus, nec dapibus purus. Maecenas tincidunt volutpat lectus, at sodales nisi eleifend eu. Nullam maximus non turpis in suscipit. Phasellus ac velit facilisis, suscipit odio quis, rutrum tellus. Fusce suscipit orci eu cursus commodo. Vivamus eget nunc et nisi scelerisque tempor. In eu eleifend justo. Pellentesque fringilla elementum lorem, non aliquet arcu accumsan non. Nulla facilisi. Duis suscipit pretium metus, vel eleifend massa consectetur accumsan. Nulla nec bibendum lectus, a aliquet odio. Aliquam ipsum neque, interdum eget convallis sed, lobortis et sem. Nulla nec mauris eu augue blandit elementum. In malesuada at magna a ullamcorper. Nullam pretium in dui vitae faucibus. Donec euismod lectus nulla, at iaculis ante commodo nec."
	        ),
	        _react2.default.createElement(
	          "p",
	          null,
	          "Fusce vel porta nulla. Proin a magna erat. Nulla tortor tellus, scelerisque ac enim a, varius luctus lacus. Sed pellentesque, ipsum vel imperdiet tempor, nisl nunc pulvinar odio, quis interdum ante risus a quam. Cras tristique libero purus, id fringilla enim venenatis et. Phasellus nec ex ut arcu interdum luctus. Proin id quam id turpis vehicula mollis et a est. Nam lacus felis, ultricies id sem eget, rhoncus aliquet massa."
	        )
	      );
	    }
	  }]);
	
	  return Doc;
	}(_react2.default.Component);
	
	exports.default = Doc;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/favicon.ico";

/***/ },
/* 18 */,
/* 19 */,
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(8);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _favicon = __webpack_require__(17);
	
	var _favicon2 = _interopRequireDefault(_favicon);
	
	var _reactRouter = __webpack_require__(10);
	
	var _reactInlineCss = __webpack_require__(14);
	
	var _reactInlineCss2 = _interopRequireDefault(_reactInlineCss);
	
	var _materialColors = __webpack_require__(15);
	
	var _materialColors2 = _interopRequireDefault(_materialColors);
	
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
	            "Stride Docs"
	          )
	        ),
	        _react2.default.createElement(
	          "h2",
	          null,
	          "API"
	        ),
	        _react2.default.createElement(
	          "div",
	          { className: "nav-links" },
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: "/docs/foo%2Fbar" },
	            "foo/bar"
	          ),
	          _react2.default.createElement(
	            _reactRouter.Link,
	            { to: "/docs/foo%2Fbar2" },
	            "foo/bar2"
	          )
	        )
	      );
	    }
	  }], [{
	    key: "css",
	    value: function css() {
	      return "\n      & a {\n        color: " + _materialColors2.default.grey['50'] + ";\n        text-decoration: none; \n      }\n\n\t\t\t& .nav-links a {\n        display: block;\n        border-left: 1px solid " + _materialColors2.default.cyan['200'] + ";\n        padding: 0.25em 0em 0.25em 1em;\n        text-decoration: none;\n        word-wrap: break-word;\n        white-space: pre-wrap;\n        max-width: 20em;\n\t\t\t\tcolor: " + _materialColors2.default.cyan['200'] + ";\n\t\t\t}\n\n      & .nav-links a:hover {\n        border-left: 1px solid " + _materialColors2.default.grey['50'] + ";\n        color: " + _materialColors2.default.grey['50'] + ";\n      }\n\t\t";
	    }
	  }]);
	
	  return Nav;
	}(_react2.default.Component);
	
	exports.default = Nav;

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map