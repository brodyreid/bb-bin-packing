(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BinPacking", [], factory);
	else if(typeof exports === 'object')
		exports["BinPacking"] = factory();
	else
		root["BinPacking"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./3D/Bin.js":
/*!*******************!*\
  !*** ./3D/Bin.js ***!
  \*******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Bin; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./3D/util.js");
/* harmony import */ var _lib_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/log */ "./lib/log.js");


const log = (0,_lib_log__WEBPACK_IMPORTED_MODULE_1__.createLogger)('3D:');

class Bin {

  name = '';
  width = 0;
  height = 0;
  depth = 0;
  maxWeight = 0;

  items = [];

  constructor(name, w, h, d, mw) {
    this.name = name;
    this.width = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( w );
    this.height = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( h );
    this.depth = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( d );
    this.maxWeight = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( mw );
  }

  getName() {
    return this.name;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDepth() {
    return this.depth;
  }

  getMaxWeight() {
    return this.maxWeight;
  }

  getItems() {
    return this.items;
  }

  getVolume() {
    return this.getWidth() * this.getHeight() * this.getDepth();
  }

  getPackedWeight() {
    return this.items.reduce( ( weight, item ) => weight + item.getWeight(), 0 );
  }

  weighItem(item) {
    const maxWeight = this.getMaxWeight();
    return ! maxWeight || item.getWeight() + this.getPackedWeight() <= maxWeight;
  }

  /**
   * Calculate a score for a given item and rotation type.
   *
   * Scores are higher for rotations that closest match item dimensions to Bin dimensions.
   * For example, rotating the item so the longest side is aligned with the longest Bin side.
   *
   * Example (Bin is 11 x 8.5 x 5.5, Item is 8.1 x 5.2 x 5.2):
   *  Rotation 0:
   *    8.1 / 11  = 0.736
   *    5.2 / 8.5 = 0.612
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.736 ** 2 + 0.612 ** 2 + 0.945 ** 2 = 1.809
   *
   *  Rotation 1:
   *    8.1 / 8.5 = 0.953
   *    5.2 / 11 = 0.473
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.953 ** 2 + 0.473 ** 2 + 0.945 ** 2 = 2.025
   *
   * @param {Item} item
   * @param {int} rotationType
   * @return {float} score
   */
  scoreRotation(item, rotationType) {
    item.rotationType = rotationType;
    let d = item.getDimension();

    // If the item doesn't fit in the Bin
    if ( this.getWidth() < d[0] || this.getHeight() < d[1] || this.getDepth() < d[2] ) {
        return 0;
    }

    // Square the results to increase the impact of high values (e.g. > 0.8)
    const widthScore = Math.pow( d[0] / this.getWidth(), 2 );
    const heightScore = Math.pow( d[1] / this.getHeight(), 2 );
    const depthScore = Math.pow( d[2] / this.getDepth(), 2 );

    return widthScore + heightScore + depthScore;
  }

  /**
   * Calculate the best rotation order for a given Item based on scoreRotation().
   *
   * @param {Item} item
   * @return {Array} Rotation types sorted by their score, DESC
   */
  getBestRotationOrder(item) {
    const rotationScores = {};

    // Score all rotation types
	for (let i=0; i<item.allowedRotation.length; i++) {
	    const r = item.allowedRotation[i];
		rotationScores[r] = this.scoreRotation( item, r );
    }

    // Sort the rotation types (index of scores object) DESC
    // and ensure Int values (Object.keys returns strings)
    const sortedRotations = Object.keys( rotationScores ).sort( ( a, b ) => {
      return rotationScores[b] - rotationScores[a];
    } ).map( Number );

    return sortedRotations;
  }

  putItem(item, p) {
    const box = this;
    let fit = false;
    const rotations = this.getBestRotationOrder( item );
    item.position = p;

    for ( let i = 0; i < rotations.length; i++ ) {
      item.rotationType = rotations[i];
      let d = item.getDimension();

      if (box.getWidth() < p[0] + d[0] || box.getHeight() < p[1] + d[1] || box.getDepth() < p[2] + d[2]) {
        fit = false;
      } else {
        fit = true;

        for (let j=0; j<box.items.length; j++) {
          let _j = box.items[j];
          if (_j.intersect(item)) {
            fit = false;
            break;
          }
        }

        if (fit) {
          box.items.push(item);
        }
      }

      log('try to putItem', fit, 'item', item.toString(), 'box', box.toString());

      if (fit) {
        break;
      }
    }
    return fit;
  }

  toString() {
    return `Bin:${this.name} (WxHxD = ${this.getWidth()}x${this.getHeight()}x${this.getDepth()}, MaxWg. = ${this.getMaxWeight()})`;
  }

}

/***/ }),

/***/ "./3D/Item.js":
/*!********************!*\
  !*** ./3D/Item.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotationType_WHD": function() { return /* binding */ RotationType_WHD; },
/* harmony export */   "RotationType_HWD": function() { return /* binding */ RotationType_HWD; },
/* harmony export */   "RotationType_HDW": function() { return /* binding */ RotationType_HDW; },
/* harmony export */   "RotationType_DHW": function() { return /* binding */ RotationType_DHW; },
/* harmony export */   "RotationType_DWH": function() { return /* binding */ RotationType_DWH; },
/* harmony export */   "RotationType_WDH": function() { return /* binding */ RotationType_WDH; },
/* harmony export */   "WidthAxis": function() { return /* binding */ WidthAxis; },
/* harmony export */   "HeightAxis": function() { return /* binding */ HeightAxis; },
/* harmony export */   "DepthAxis": function() { return /* binding */ DepthAxis; },
/* harmony export */   "StartPosition": function() { return /* binding */ StartPosition; },
/* harmony export */   "RotationTypeStrings": function() { return /* binding */ RotationTypeStrings; },
/* harmony export */   "default": function() { return /* binding */ Item; },
/* harmony export */   "rectIntersect": function() { return /* binding */ rectIntersect; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./3D/util.js");


const RotationType_WHD = 0;
const RotationType_HWD = 1;
const RotationType_HDW = 2;
const RotationType_DHW = 3;
const RotationType_DWH = 4;
const RotationType_WDH = 5;

const WidthAxis = 0;
const HeightAxis = 1;
const DepthAxis = 2;

const StartPosition = [0, 0, 0];

const RotationTypeStrings = {
  [RotationType_WHD]: 'RotationType_WHD (w,h,d)',
  [RotationType_HWD]: 'RotationType_HWD (h,w,d)',
  [RotationType_HDW]: 'RotationType_HDW (h,d,w)',
  [RotationType_DHW]: 'RotationType_DHW (d,h,w)',
  [RotationType_DWH]: 'RotationType_DWH (d,w,h)',
  [RotationType_WDH]: 'RotationType_WDH (w,d,h)',
};

class Item {

  name = '';
  width = 0;
  height = 0;
  depth = 0;
  weight = 0;
  allowedRotation = [0,1,2,3,4,5];

  rotationType = RotationType_WHD;
  position = []; // x, y, z

  constructor(name, w, h, d, wg, allowedRotation) {
    this.name = name;
    this.width = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( w );
    this.height = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( h );
    this.depth = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( d );
    this.weight = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( wg );
    this.allowedRotation = allowedRotation ? allowedRotation : this.allowedRotation;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDepth() {
    return this.depth;
  }

  getWeight() {
    return this.weight;
  }

  getRotationType() {
    return this.rotationType;
  }

  getAllowedRotation() {
    return this.allowedRotation;
  }

  getRotationTypeString() {
    return RotationTypeStrings[this.getRotationType()];
  }

  getDimension() {
    let d;
    switch (this.rotationType) {
      case RotationType_WHD:
        d = [this.getWidth(), this.getHeight(), this.getDepth()];
        break;
      case RotationType_HWD:
        d = [this.getHeight(), this.getWidth(), this.getDepth()];
        break;
      case RotationType_HDW:
        d = [this.getHeight(), this.getDepth(), this.getWidth()];
        break;
      case RotationType_DHW:
        d = [this.getDepth(), this.getHeight(), this.getWidth()];
        break;
      case RotationType_DWH:
        d = [this.getDepth(), this.getWidth(), this.getHeight()];
        break;
      case RotationType_WDH:
        d = [this.getWidth(), this.getDepth(), this.getHeight()];
        break;
    }
    return d;
  }

  intersect(i2) {
    return rectIntersect(this, i2, WidthAxis, HeightAxis) &&
        rectIntersect(this, i2, HeightAxis, DepthAxis) &&
        rectIntersect(this, i2, WidthAxis, DepthAxis);
  }

  getVolume() {
    return this.getWidth() * this.getHeight() * this.getDepth();
  }

  toString() {
    return `Item:${this.name} (${this.getRotationTypeString()} = ${this.getDimension().join('x')}, Wg. = ${this.weight})`;
  }
}

const rectIntersect = (i1, i2, x, y) => {
  let d1, d2, cx1, cy1, cx2, cy2, ix, iy;

  d1 = i1.getDimension();
  d2 = i2.getDimension();

  cx1 = i1.position[x] + d1[x] / 2;
  cy1 = i1.position[y] + d1[y] / 2;
  cx2 = i2.position[x] + d2[x] / 2;
  cy2 = i2.position[y] + d2[y] / 2;

  ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
};

/***/ }),

/***/ "./3D/Packer.js":
/*!**********************!*\
  !*** ./3D/Packer.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Packer; }
/* harmony export */ });
/* harmony import */ var _Bin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bin */ "./3D/Bin.js");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Item */ "./3D/Item.js");



class Packer {

  bins = [];
  items = [];
  unfitItems = [];

  addBin(bin) {
    this.bins.push(bin);
  }

  addItem(item) {
    this.items.push(item);
  }

  findFittedBin(i) {
    for (let _i=0; _i<this.bins.length; _i++) {
      let b = this.bins[_i];

      if (!b.weighItem(i) || !b.putItem(i, _Item__WEBPACK_IMPORTED_MODULE_1__.StartPosition)) {
        continue;
      }

      if (b.items.length === 1 && b.items[0] === i) {
        b.items = [];
      }

      return b;
    }
    return null;
  }

  getBiggerBinThan(b) {
    let v = b.getVolume();
    for (let _i=0; _i<this.bins; _i++) {
      let b2 = this.bins[_i];
      if (b2.getVolume() > v) {
        return b2;
      }
    }
    return null;
  }

  unfitItem() {
    if (this.items.length === 0) {
      return;
    }
    this.unfitItems.push(this.items[0]);
    this.items.splice(0, 1);
  }

  packToBin(b, items) {
    let b2 = null;
    let unpacked = [];
    let fit = b.weighItem(items[0]) && b.putItem(items[0], _Item__WEBPACK_IMPORTED_MODULE_1__.StartPosition);

    if (!fit) {
      let b2 = this.getBiggerBinThan(b);
      if (b2) {
        return this.packToBin(b2, items);
      }
      return this.items;
    }

    // Pack unpacked items.
    for (let _i=1; _i < this.items.length; _i++) {
      let fitted = false;
      let item = this.items[_i];

      if (b.weighItem(item)) {
        // Try available pivots in current bin that are not intersect with
        // existing items in current bin.
        lookup:
        for (let _pt=0; _pt < 3; _pt++) {
          for (let _j=0; _j < b.items.length; _j++) {
            let pv;
            let ib = b.items[_j];
            let d = ib.getDimension();
            switch (_pt) {
              case _Item__WEBPACK_IMPORTED_MODULE_1__.WidthAxis:
                pv = [ib.position[0] + d[0], ib.position[1], ib.position[2]];
                break;
              case _Item__WEBPACK_IMPORTED_MODULE_1__.HeightAxis:
                pv = [ib.position[0], ib.position[1] + d[1], ib.position[2]];
                break;
              case _Item__WEBPACK_IMPORTED_MODULE_1__.DepthAxis:
                pv = [ib.position[0], ib.position[1], ib.position[2] + d[2]];
                break;
            }

            if (b.putItem(item, pv)) {
              fitted = true;
              break lookup;
            }
          }
        }
      }

      if (!fitted) {
        while (b2 !== null) {
          b2 = this.getBiggerBinThan(b);
          if (b2) {
            b2.items.push(item);
            let left = this.packToBin(b2, b2.items);
            if (left.length === 0) {
              b = b2;
              fitted = true;
              break;
            }
          }
        }

        if (!fitted) {
          unpacked.push(item);
        }
      }
    }

    return unpacked;
  }

  pack() {
    // Sort bins smallest to largest.
    this.bins.sort((a, b) => {
      return a.getVolume() - b.getVolume();
    });

    // Sort items largest to smallest.
    this.items.sort((a, b) => {
      return b.getVolume() - a.getVolume();
    });

    while (this.items.length > 0) {
      let bin = this.findFittedBin(this.items[0]);

      if (bin === null) {
        this.unfitItem();
        continue;
      }

      this.items = this.packToBin(bin, this.items);
    }

    return null;
  }
}


/***/ }),

/***/ "./3D/util.js":
/*!********************!*\
  !*** ./3D/util.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "factoredInteger": function() { return /* binding */ factoredInteger; }
/* harmony export */ });
/**
 * Precision to retain in factoredInteger()
 */
const FACTOR = 5;

/**
 * Factor a number by FACTOR and round to the nearest whole number
 */
const factoredInteger = ( value ) => (
    Math.round( value * ( 10 ** FACTOR ) )
);


/***/ }),

/***/ "./lib/log.js":
/*!********************!*\
  !*** ./lib/log.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enableLog": function() { return /* binding */ enableLog; },
/* harmony export */   "createLogger": function() { return /* binding */ createLogger; },
/* harmony export */   "log": function() { return /* binding */ log; }
/* harmony export */ });
let isLogEnabled = false;
function enableLog(enable = true) {
    isLogEnabled = enable;
}

function createLogger(namespace = 'binpackingjs') {
    return log.bind(undefined, namespace);
}

function log(namespace, ...args) {
    return isLogEnabled ? console.debug.apply(console, [namespace].concat(args)) : undefined;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*********************!*\
  !*** ./3D/index.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bin": function() { return /* reexport safe */ _Bin__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "Item": function() { return /* reexport safe */ _Item__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "Packer": function() { return /* reexport safe */ _Packer__WEBPACK_IMPORTED_MODULE_2__.default; }
/* harmony export */ });
/* harmony import */ var _Bin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bin */ "./3D/Bin.js");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Item */ "./3D/Item.js");
/* harmony import */ var _Packer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Packer */ "./3D/Packer.js");





}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vM0QvQmluLmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9JdGVtLmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9QYWNrZXIuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL3V0aWwuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uL2xpYi9sb2cuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7Ozs7Ozs7OztBQ1Z5QztBQUNEO0FBQ3hDLFlBQVksc0RBQVk7O0FBRVQ7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLHNEQUFlO0FBQ2hDLGtCQUFrQixzREFBZTtBQUNqQyxpQkFBaUIsc0RBQWU7QUFDaEMscUJBQXFCLHNEQUFlO0FBQ3BDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7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QUNoQyx3QkFBd0IscUJBQXFCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDRDQUFTO0FBQzVCO0FBQ0E7QUFDQSxtQkFBbUIsNkNBQVU7QUFDN0I7QUFDQTtBQUNBLG1CQUFtQiw0Q0FBUztBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQSxDOzs7Ozs7VUNYQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLDZDQUE2Qyx3REFBd0QsRTs7Ozs7V0NBckc7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOd0I7QUFDRTtBQUNJIiwiZmlsZSI6IkJQM0QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkJpblBhY2tpbmdcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQmluUGFja2luZ1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJCaW5QYWNraW5nXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IHsgZmFjdG9yZWRJbnRlZ2VyIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7Y3JlYXRlTG9nZ2VyfSBmcm9tIFwiLi4vbGliL2xvZ1wiO1xuY29uc3QgbG9nID0gY3JlYXRlTG9nZ2VyKCczRDonKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmluIHtcblxuICBuYW1lID0gJyc7XG4gIHdpZHRoID0gMDtcbiAgaGVpZ2h0ID0gMDtcbiAgZGVwdGggPSAwO1xuICBtYXhXZWlnaHQgPSAwO1xuXG4gIGl0ZW1zID0gW107XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdywgaCwgZCwgbXcpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMud2lkdGggPSBmYWN0b3JlZEludGVnZXIoIHcgKTtcbiAgICB0aGlzLmhlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggaCApO1xuICAgIHRoaXMuZGVwdGggPSBmYWN0b3JlZEludGVnZXIoIGQgKTtcbiAgICB0aGlzLm1heFdlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggbXcgKTtcbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9XG5cbiAgZ2V0SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIGdldERlcHRoKCkge1xuICAgIHJldHVybiB0aGlzLmRlcHRoO1xuICB9XG5cbiAgZ2V0TWF4V2VpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLm1heFdlaWdodDtcbiAgfVxuXG4gIGdldEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICB9XG5cbiAgZ2V0Vm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdpZHRoKCkgKiB0aGlzLmdldEhlaWdodCgpICogdGhpcy5nZXREZXB0aCgpO1xuICB9XG5cbiAgZ2V0UGFja2VkV2VpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLnJlZHVjZSggKCB3ZWlnaHQsIGl0ZW0gKSA9PiB3ZWlnaHQgKyBpdGVtLmdldFdlaWdodCgpLCAwICk7XG4gIH1cblxuICB3ZWlnaEl0ZW0oaXRlbSkge1xuICAgIGNvbnN0IG1heFdlaWdodCA9IHRoaXMuZ2V0TWF4V2VpZ2h0KCk7XG4gICAgcmV0dXJuICEgbWF4V2VpZ2h0IHx8IGl0ZW0uZ2V0V2VpZ2h0KCkgKyB0aGlzLmdldFBhY2tlZFdlaWdodCgpIDw9IG1heFdlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgYSBzY29yZSBmb3IgYSBnaXZlbiBpdGVtIGFuZCByb3RhdGlvbiB0eXBlLlxuICAgKlxuICAgKiBTY29yZXMgYXJlIGhpZ2hlciBmb3Igcm90YXRpb25zIHRoYXQgY2xvc2VzdCBtYXRjaCBpdGVtIGRpbWVuc2lvbnMgdG8gQmluIGRpbWVuc2lvbnMuXG4gICAqIEZvciBleGFtcGxlLCByb3RhdGluZyB0aGUgaXRlbSBzbyB0aGUgbG9uZ2VzdCBzaWRlIGlzIGFsaWduZWQgd2l0aCB0aGUgbG9uZ2VzdCBCaW4gc2lkZS5cbiAgICpcbiAgICogRXhhbXBsZSAoQmluIGlzIDExIHggOC41IHggNS41LCBJdGVtIGlzIDguMSB4IDUuMiB4IDUuMik6XG4gICAqICBSb3RhdGlvbiAwOlxuICAgKiAgICA4LjEgLyAxMSAgPSAwLjczNlxuICAgKiAgICA1LjIgLyA4LjUgPSAwLjYxMlxuICAgKiAgICA1LjIgLyA1LjUgPSAwLjk0NVxuICAgKiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgICAwLjczNiAqKiAyICsgMC42MTIgKiogMiArIDAuOTQ1ICoqIDIgPSAxLjgwOVxuICAgKlxuICAgKiAgUm90YXRpb24gMTpcbiAgICogICAgOC4xIC8gOC41ID0gMC45NTNcbiAgICogICAgNS4yIC8gMTEgPSAwLjQ3M1xuICAgKiAgICA1LjIgLyA1LjUgPSAwLjk0NVxuICAgKiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgICAwLjk1MyAqKiAyICsgMC40NzMgKiogMiArIDAuOTQ1ICoqIDIgPSAyLjAyNVxuICAgKlxuICAgKiBAcGFyYW0ge0l0ZW19IGl0ZW1cbiAgICogQHBhcmFtIHtpbnR9IHJvdGF0aW9uVHlwZVxuICAgKiBAcmV0dXJuIHtmbG9hdH0gc2NvcmVcbiAgICovXG4gIHNjb3JlUm90YXRpb24oaXRlbSwgcm90YXRpb25UeXBlKSB7XG4gICAgaXRlbS5yb3RhdGlvblR5cGUgPSByb3RhdGlvblR5cGU7XG4gICAgbGV0IGQgPSBpdGVtLmdldERpbWVuc2lvbigpO1xuXG4gICAgLy8gSWYgdGhlIGl0ZW0gZG9lc24ndCBmaXQgaW4gdGhlIEJpblxuICAgIGlmICggdGhpcy5nZXRXaWR0aCgpIDwgZFswXSB8fCB0aGlzLmdldEhlaWdodCgpIDwgZFsxXSB8fCB0aGlzLmdldERlcHRoKCkgPCBkWzJdICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvLyBTcXVhcmUgdGhlIHJlc3VsdHMgdG8gaW5jcmVhc2UgdGhlIGltcGFjdCBvZiBoaWdoIHZhbHVlcyAoZS5nLiA+IDAuOClcbiAgICBjb25zdCB3aWR0aFNjb3JlID0gTWF0aC5wb3coIGRbMF0gLyB0aGlzLmdldFdpZHRoKCksIDIgKTtcbiAgICBjb25zdCBoZWlnaHRTY29yZSA9IE1hdGgucG93KCBkWzFdIC8gdGhpcy5nZXRIZWlnaHQoKSwgMiApO1xuICAgIGNvbnN0IGRlcHRoU2NvcmUgPSBNYXRoLnBvdyggZFsyXSAvIHRoaXMuZ2V0RGVwdGgoKSwgMiApO1xuXG4gICAgcmV0dXJuIHdpZHRoU2NvcmUgKyBoZWlnaHRTY29yZSArIGRlcHRoU2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBiZXN0IHJvdGF0aW9uIG9yZGVyIGZvciBhIGdpdmVuIEl0ZW0gYmFzZWQgb24gc2NvcmVSb3RhdGlvbigpLlxuICAgKlxuICAgKiBAcGFyYW0ge0l0ZW19IGl0ZW1cbiAgICogQHJldHVybiB7QXJyYXl9IFJvdGF0aW9uIHR5cGVzIHNvcnRlZCBieSB0aGVpciBzY29yZSwgREVTQ1xuICAgKi9cbiAgZ2V0QmVzdFJvdGF0aW9uT3JkZXIoaXRlbSkge1xuICAgIGNvbnN0IHJvdGF0aW9uU2NvcmVzID0ge307XG5cbiAgICAvLyBTY29yZSBhbGwgcm90YXRpb24gdHlwZXNcblx0Zm9yIChsZXQgaT0wOyBpPGl0ZW0uYWxsb3dlZFJvdGF0aW9uLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBjb25zdCByID0gaXRlbS5hbGxvd2VkUm90YXRpb25baV07XG5cdFx0cm90YXRpb25TY29yZXNbcl0gPSB0aGlzLnNjb3JlUm90YXRpb24oIGl0ZW0sIHIgKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSByb3RhdGlvbiB0eXBlcyAoaW5kZXggb2Ygc2NvcmVzIG9iamVjdCkgREVTQ1xuICAgIC8vIGFuZCBlbnN1cmUgSW50IHZhbHVlcyAoT2JqZWN0LmtleXMgcmV0dXJucyBzdHJpbmdzKVxuICAgIGNvbnN0IHNvcnRlZFJvdGF0aW9ucyA9IE9iamVjdC5rZXlzKCByb3RhdGlvblNjb3JlcyApLnNvcnQoICggYSwgYiApID0+IHtcbiAgICAgIHJldHVybiByb3RhdGlvblNjb3Jlc1tiXSAtIHJvdGF0aW9uU2NvcmVzW2FdO1xuICAgIH0gKS5tYXAoIE51bWJlciApO1xuXG4gICAgcmV0dXJuIHNvcnRlZFJvdGF0aW9ucztcbiAgfVxuXG4gIHB1dEl0ZW0oaXRlbSwgcCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXM7XG4gICAgbGV0IGZpdCA9IGZhbHNlO1xuICAgIGNvbnN0IHJvdGF0aW9ucyA9IHRoaXMuZ2V0QmVzdFJvdGF0aW9uT3JkZXIoIGl0ZW0gKTtcbiAgICBpdGVtLnBvc2l0aW9uID0gcDtcblxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHJvdGF0aW9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGl0ZW0ucm90YXRpb25UeXBlID0gcm90YXRpb25zW2ldO1xuICAgICAgbGV0IGQgPSBpdGVtLmdldERpbWVuc2lvbigpO1xuXG4gICAgICBpZiAoYm94LmdldFdpZHRoKCkgPCBwWzBdICsgZFswXSB8fCBib3guZ2V0SGVpZ2h0KCkgPCBwWzFdICsgZFsxXSB8fCBib3guZ2V0RGVwdGgoKSA8IHBbMl0gKyBkWzJdKSB7XG4gICAgICAgIGZpdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZml0ID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8Ym94Lml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IF9qID0gYm94Lml0ZW1zW2pdO1xuICAgICAgICAgIGlmIChfai5pbnRlcnNlY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIGZpdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpdCkge1xuICAgICAgICAgIGJveC5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxvZygndHJ5IHRvIHB1dEl0ZW0nLCBmaXQsICdpdGVtJywgaXRlbS50b1N0cmluZygpLCAnYm94JywgYm94LnRvU3RyaW5nKCkpO1xuXG4gICAgICBpZiAoZml0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZml0O1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBCaW46JHt0aGlzLm5hbWV9IChXeEh4RCA9ICR7dGhpcy5nZXRXaWR0aCgpfXgke3RoaXMuZ2V0SGVpZ2h0KCl9eCR7dGhpcy5nZXREZXB0aCgpfSwgTWF4V2cuID0gJHt0aGlzLmdldE1heFdlaWdodCgpfSlgO1xuICB9XG5cbn0iLCJpbXBvcnQgeyBmYWN0b3JlZEludGVnZXIgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX1dIRCA9IDA7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0hXRCA9IDE7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0hEVyA9IDI7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0RIVyA9IDM7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0RXSCA9IDQ7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX1dESCA9IDU7XG5cbmV4cG9ydCBjb25zdCBXaWR0aEF4aXMgPSAwO1xuZXhwb3J0IGNvbnN0IEhlaWdodEF4aXMgPSAxO1xuZXhwb3J0IGNvbnN0IERlcHRoQXhpcyA9IDI7XG5cbmV4cG9ydCBjb25zdCBTdGFydFBvc2l0aW9uID0gWzAsIDAsIDBdO1xuXG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlU3RyaW5ncyA9IHtcbiAgW1JvdGF0aW9uVHlwZV9XSERdOiAnUm90YXRpb25UeXBlX1dIRCAodyxoLGQpJyxcbiAgW1JvdGF0aW9uVHlwZV9IV0RdOiAnUm90YXRpb25UeXBlX0hXRCAoaCx3LGQpJyxcbiAgW1JvdGF0aW9uVHlwZV9IRFddOiAnUm90YXRpb25UeXBlX0hEVyAoaCxkLHcpJyxcbiAgW1JvdGF0aW9uVHlwZV9ESFddOiAnUm90YXRpb25UeXBlX0RIVyAoZCxoLHcpJyxcbiAgW1JvdGF0aW9uVHlwZV9EV0hdOiAnUm90YXRpb25UeXBlX0RXSCAoZCx3LGgpJyxcbiAgW1JvdGF0aW9uVHlwZV9XREhdOiAnUm90YXRpb25UeXBlX1dESCAodyxkLGgpJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0ge1xuXG4gIG5hbWUgPSAnJztcbiAgd2lkdGggPSAwO1xuICBoZWlnaHQgPSAwO1xuICBkZXB0aCA9IDA7XG4gIHdlaWdodCA9IDA7XG4gIGFsbG93ZWRSb3RhdGlvbiA9IFswLDEsMiwzLDQsNV07XG5cbiAgcm90YXRpb25UeXBlID0gUm90YXRpb25UeXBlX1dIRDtcbiAgcG9zaXRpb24gPSBbXTsgLy8geCwgeSwgelxuXG4gIGNvbnN0cnVjdG9yKG5hbWUsIHcsIGgsIGQsIHdnLCBhbGxvd2VkUm90YXRpb24pIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMud2lkdGggPSBmYWN0b3JlZEludGVnZXIoIHcgKTtcbiAgICB0aGlzLmhlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggaCApO1xuICAgIHRoaXMuZGVwdGggPSBmYWN0b3JlZEludGVnZXIoIGQgKTtcbiAgICB0aGlzLndlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggd2cgKTtcbiAgICB0aGlzLmFsbG93ZWRSb3RhdGlvbiA9IGFsbG93ZWRSb3RhdGlvbiA/IGFsbG93ZWRSb3RhdGlvbiA6IHRoaXMuYWxsb3dlZFJvdGF0aW9uO1xuICB9XG5cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgZ2V0RGVwdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVwdGg7XG4gIH1cblxuICBnZXRXZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMud2VpZ2h0O1xuICB9XG5cbiAgZ2V0Um90YXRpb25UeXBlKCkge1xuICAgIHJldHVybiB0aGlzLnJvdGF0aW9uVHlwZTtcbiAgfVxuXG4gIGdldEFsbG93ZWRSb3RhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxvd2VkUm90YXRpb247XG4gIH1cblxuICBnZXRSb3RhdGlvblR5cGVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIFJvdGF0aW9uVHlwZVN0cmluZ3NbdGhpcy5nZXRSb3RhdGlvblR5cGUoKV07XG4gIH1cblxuICBnZXREaW1lbnNpb24oKSB7XG4gICAgbGV0IGQ7XG4gICAgc3dpdGNoICh0aGlzLnJvdGF0aW9uVHlwZSkge1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfV0hEOlxuICAgICAgICBkID0gW3RoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXREZXB0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9IV0Q6XG4gICAgICAgIGQgPSBbdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldERlcHRoKCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX0hEVzpcbiAgICAgICAgZCA9IFt0aGlzLmdldEhlaWdodCgpLCB0aGlzLmdldERlcHRoKCksIHRoaXMuZ2V0V2lkdGgoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfREhXOlxuICAgICAgICBkID0gW3RoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXRXaWR0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9EV0g6XG4gICAgICAgIGQgPSBbdGhpcy5nZXREZXB0aCgpLCB0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX1dESDpcbiAgICAgICAgZCA9IFt0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRIZWlnaHQoKV07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGludGVyc2VjdChpMikge1xuICAgIHJldHVybiByZWN0SW50ZXJzZWN0KHRoaXMsIGkyLCBXaWR0aEF4aXMsIEhlaWdodEF4aXMpICYmXG4gICAgICAgIHJlY3RJbnRlcnNlY3QodGhpcywgaTIsIEhlaWdodEF4aXMsIERlcHRoQXhpcykgJiZcbiAgICAgICAgcmVjdEludGVyc2VjdCh0aGlzLCBpMiwgV2lkdGhBeGlzLCBEZXB0aEF4aXMpO1xuICB9XG5cbiAgZ2V0Vm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdpZHRoKCkgKiB0aGlzLmdldEhlaWdodCgpICogdGhpcy5nZXREZXB0aCgpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBJdGVtOiR7dGhpcy5uYW1lfSAoJHt0aGlzLmdldFJvdGF0aW9uVHlwZVN0cmluZygpfSA9ICR7dGhpcy5nZXREaW1lbnNpb24oKS5qb2luKCd4Jyl9LCBXZy4gPSAke3RoaXMud2VpZ2h0fSlgO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWN0SW50ZXJzZWN0ID0gKGkxLCBpMiwgeCwgeSkgPT4ge1xuICBsZXQgZDEsIGQyLCBjeDEsIGN5MSwgY3gyLCBjeTIsIGl4LCBpeTtcblxuICBkMSA9IGkxLmdldERpbWVuc2lvbigpO1xuICBkMiA9IGkyLmdldERpbWVuc2lvbigpO1xuXG4gIGN4MSA9IGkxLnBvc2l0aW9uW3hdICsgZDFbeF0gLyAyO1xuICBjeTEgPSBpMS5wb3NpdGlvblt5XSArIGQxW3ldIC8gMjtcbiAgY3gyID0gaTIucG9zaXRpb25beF0gKyBkMlt4XSAvIDI7XG4gIGN5MiA9IGkyLnBvc2l0aW9uW3ldICsgZDJbeV0gLyAyO1xuXG4gIGl4ID0gTWF0aC5tYXgoY3gxLCBjeDIpIC0gTWF0aC5taW4oY3gxLCBjeDIpO1xuICBpeSA9IE1hdGgubWF4KGN5MSwgY3kyKSAtIE1hdGgubWluKGN5MSwgY3kyKTtcblxuICByZXR1cm4gaXggPCAoZDFbeF0gKyBkMlt4XSkgLyAyICYmIGl5IDwgKGQxW3ldICsgZDJbeV0pIC8gMjtcbn07IiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQge1xuICBJdGVtLFxuICBTdGFydFBvc2l0aW9uLFxuICBXaWR0aEF4aXMsXG4gIEhlaWdodEF4aXMsXG4gIERlcHRoQXhpc1xufSBmcm9tICcuL0l0ZW0nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrZXIge1xuXG4gIGJpbnMgPSBbXTtcbiAgaXRlbXMgPSBbXTtcbiAgdW5maXRJdGVtcyA9IFtdO1xuXG4gIGFkZEJpbihiaW4pIHtcbiAgICB0aGlzLmJpbnMucHVzaChiaW4pO1xuICB9XG5cbiAgYWRkSXRlbShpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgZmluZEZpdHRlZEJpbihpKSB7XG4gICAgZm9yIChsZXQgX2k9MDsgX2k8dGhpcy5iaW5zLmxlbmd0aDsgX2krKykge1xuICAgICAgbGV0IGIgPSB0aGlzLmJpbnNbX2ldO1xuXG4gICAgICBpZiAoIWIud2VpZ2hJdGVtKGkpIHx8ICFiLnB1dEl0ZW0oaSwgU3RhcnRQb3NpdGlvbikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChiLml0ZW1zLmxlbmd0aCA9PT0gMSAmJiBiLml0ZW1zWzBdID09PSBpKSB7XG4gICAgICAgIGIuaXRlbXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0QmlnZ2VyQmluVGhhbihiKSB7XG4gICAgbGV0IHYgPSBiLmdldFZvbHVtZSgpO1xuICAgIGZvciAobGV0IF9pPTA7IF9pPHRoaXMuYmluczsgX2krKykge1xuICAgICAgbGV0IGIyID0gdGhpcy5iaW5zW19pXTtcbiAgICAgIGlmIChiMi5nZXRWb2x1bWUoKSA+IHYpIHtcbiAgICAgICAgcmV0dXJuIGIyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHVuZml0SXRlbSgpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy51bmZpdEl0ZW1zLnB1c2godGhpcy5pdGVtc1swXSk7XG4gICAgdGhpcy5pdGVtcy5zcGxpY2UoMCwgMSk7XG4gIH1cblxuICBwYWNrVG9CaW4oYiwgaXRlbXMpIHtcbiAgICBsZXQgYjIgPSBudWxsO1xuICAgIGxldCB1bnBhY2tlZCA9IFtdO1xuICAgIGxldCBmaXQgPSBiLndlaWdoSXRlbShpdGVtc1swXSkgJiYgYi5wdXRJdGVtKGl0ZW1zWzBdLCBTdGFydFBvc2l0aW9uKTtcblxuICAgIGlmICghZml0KSB7XG4gICAgICBsZXQgYjIgPSB0aGlzLmdldEJpZ2dlckJpblRoYW4oYik7XG4gICAgICBpZiAoYjIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFja1RvQmluKGIyLCBpdGVtcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICB9XG5cbiAgICAvLyBQYWNrIHVucGFja2VkIGl0ZW1zLlxuICAgIGZvciAobGV0IF9pPTE7IF9pIDwgdGhpcy5pdGVtcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIGxldCBmaXR0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc1tfaV07XG5cbiAgICAgIGlmIChiLndlaWdoSXRlbShpdGVtKSkge1xuICAgICAgICAvLyBUcnkgYXZhaWxhYmxlIHBpdm90cyBpbiBjdXJyZW50IGJpbiB0aGF0IGFyZSBub3QgaW50ZXJzZWN0IHdpdGhcbiAgICAgICAgLy8gZXhpc3RpbmcgaXRlbXMgaW4gY3VycmVudCBiaW4uXG4gICAgICAgIGxvb2t1cDpcbiAgICAgICAgZm9yIChsZXQgX3B0PTA7IF9wdCA8IDM7IF9wdCsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgX2o9MDsgX2ogPCBiLml0ZW1zLmxlbmd0aDsgX2orKykge1xuICAgICAgICAgICAgbGV0IHB2O1xuICAgICAgICAgICAgbGV0IGliID0gYi5pdGVtc1tfal07XG4gICAgICAgICAgICBsZXQgZCA9IGliLmdldERpbWVuc2lvbigpO1xuICAgICAgICAgICAgc3dpdGNoIChfcHQpIHtcbiAgICAgICAgICAgICAgY2FzZSBXaWR0aEF4aXM6XG4gICAgICAgICAgICAgICAgcHYgPSBbaWIucG9zaXRpb25bMF0gKyBkWzBdLCBpYi5wb3NpdGlvblsxXSwgaWIucG9zaXRpb25bMl1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIEhlaWdodEF4aXM6XG4gICAgICAgICAgICAgICAgcHYgPSBbaWIucG9zaXRpb25bMF0sIGliLnBvc2l0aW9uWzFdICsgZFsxXSwgaWIucG9zaXRpb25bMl1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIERlcHRoQXhpczpcbiAgICAgICAgICAgICAgICBwdiA9IFtpYi5wb3NpdGlvblswXSwgaWIucG9zaXRpb25bMV0sIGliLnBvc2l0aW9uWzJdICsgZFsyXV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiLnB1dEl0ZW0oaXRlbSwgcHYpKSB7XG4gICAgICAgICAgICAgIGZpdHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrIGxvb2t1cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmaXR0ZWQpIHtcbiAgICAgICAgd2hpbGUgKGIyICE9PSBudWxsKSB7XG4gICAgICAgICAgYjIgPSB0aGlzLmdldEJpZ2dlckJpblRoYW4oYik7XG4gICAgICAgICAgaWYgKGIyKSB7XG4gICAgICAgICAgICBiMi5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgbGV0IGxlZnQgPSB0aGlzLnBhY2tUb0JpbihiMiwgYjIuaXRlbXMpO1xuICAgICAgICAgICAgaWYgKGxlZnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIGIgPSBiMjtcbiAgICAgICAgICAgICAgZml0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaXR0ZWQpIHtcbiAgICAgICAgICB1bnBhY2tlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVucGFja2VkO1xuICB9XG5cbiAgcGFjaygpIHtcbiAgICAvLyBTb3J0IGJpbnMgc21hbGxlc3QgdG8gbGFyZ2VzdC5cbiAgICB0aGlzLmJpbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuZ2V0Vm9sdW1lKCkgLSBiLmdldFZvbHVtZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gU29ydCBpdGVtcyBsYXJnZXN0IHRvIHNtYWxsZXN0LlxuICAgIHRoaXMuaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGIuZ2V0Vm9sdW1lKCkgLSBhLmdldFZvbHVtZSgpO1xuICAgIH0pO1xuXG4gICAgd2hpbGUgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGJpbiA9IHRoaXMuZmluZEZpdHRlZEJpbih0aGlzLml0ZW1zWzBdKTtcblxuICAgICAgaWYgKGJpbiA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnVuZml0SXRlbSgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pdGVtcyA9IHRoaXMucGFja1RvQmluKGJpbiwgdGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsIi8qKlxuICogUHJlY2lzaW9uIHRvIHJldGFpbiBpbiBmYWN0b3JlZEludGVnZXIoKVxuICovXG5jb25zdCBGQUNUT1IgPSA1O1xuXG4vKipcbiAqIEZhY3RvciBhIG51bWJlciBieSBGQUNUT1IgYW5kIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHdob2xlIG51bWJlclxuICovXG5leHBvcnQgY29uc3QgZmFjdG9yZWRJbnRlZ2VyID0gKCB2YWx1ZSApID0+IChcbiAgICBNYXRoLnJvdW5kKCB2YWx1ZSAqICggMTAgKiogRkFDVE9SICkgKVxuKTtcbiIsImxldCBpc0xvZ0VuYWJsZWQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVMb2coZW5hYmxlID0gdHJ1ZSkge1xuICAgIGlzTG9nRW5hYmxlZCA9IGVuYWJsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihuYW1lc3BhY2UgPSAnYmlucGFja2luZ2pzJykge1xuICAgIHJldHVybiBsb2cuYmluZCh1bmRlZmluZWQsIG5hbWVzcGFjZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cobmFtZXNwYWNlLCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIGlzTG9nRW5hYmxlZCA/IGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgW25hbWVzcGFjZV0uY29uY2F0KGFyZ3MpKSA6IHVuZGVmaW5lZDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nO1xuaW1wb3J0IFBhY2tlciBmcm9tICcuL1BhY2tlcic7XG5cbmV4cG9ydCB7IEJpbiwgSXRlbSwgUGFja2VyIH07Il0sInNvdXJjZVJvb3QiOiIifQ==